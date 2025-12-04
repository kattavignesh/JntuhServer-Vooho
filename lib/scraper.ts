import * as cheerio from 'cheerio';
import pool from './db';
import redis from './redis';
import { env } from '@/src/config/env';

interface Subject {
    code: string;
    name: string;
    credits: string;
}

interface Mark {
    subject_code: string;
    internal: string;
    external: string;
    total: string;
    grade: string;
    grade_points: string;
    credits: string;
}

interface StudentResult {
    hall_ticket: string;
    name: string;
    college_code: string;
    regulation: string;
    year: string;
    semester: string;
    status: string;
    sgpa: string;
    cgpa: string;
    subjects: Subject[];
    marks: Mark[];
}

export async function scrapeResult(hallTicket: string, examCode: string = env.jntuh.examCode): Promise<StudentResult | null> {
    try {
        // 1. Fetch HTML from JNTUH
        const formData = new URLSearchParams();
        formData.append('htno', hallTicket);
        formData.append('exid', examCode);
        formData.append('url', env.jntuh.baseUrl);

        const response = await fetch(env.jntuh.baseUrl + '/resultAction', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            // Set a timeout
            signal: AbortSignal.timeout(env.scraper.timeoutMs),
        });

        if (!response.ok) return null;

        const html = await response.text();
        const $ = cheerio.load(html);

        // 2. Check if result exists (look for Name field)
        const name = $('table').find("td:contains('Name')").next().text().trim();
        if (!name) return null; // Invalid hall ticket or no result

        // 3. Parse Student Info
        const fatherName = $('table').find("td:contains('Father Name')").next().text().trim();
        const collegeCode = $('table').find("td:contains('College Code')").next().text().trim();

        // Parse table headers to find marks table
        // Note: This is a simplified parser. JNTUH HTML structure varies.
        // We assume standard table structure for R22/R18

        const marks: Mark[] = [];
        const subjects: Subject[] = [];

        // Find the marks table (usually the one with Subject Code header)
        $('table').each((i, table) => {
            const headers = $(table).find('th').map((j, th) => $(th).text().trim()).get();
            if (headers.includes('Subject Code') && headers.includes('Subject Name')) {
                // This is the marks table
                $(table).find('tr').each((k, row) => {
                    const cols = $(row).find('td').map((l, td) => $(td).text().trim()).get();
                    if (cols.length >= 7) {
                        const subjectCode = cols[0];
                        const subjectName = cols[1];
                        const internal = cols[2];
                        const external = cols[3];
                        const total = cols[4];
                        const grade = cols[5];
                        const credits = cols[6];

                        if (subjectCode && subjectName) {
                            subjects.push({ code: subjectCode, name: subjectName, credits });
                            marks.push({
                                subject_code: subjectCode,
                                internal,
                                external,
                                total,
                                grade,
                                grade_points: '0', // JNTUH doesn't always show points, calculate if needed
                                credits
                            });
                        }
                    }
                });
            }
        });

        // Parse SGPA/CGPA if available
        // (This logic depends heavily on specific result page format)
        const sgpa = '0.00';
        const cgpa = '0.00';
        const status = marks.some(m => m.grade === 'F' || m.grade === 'Ab') ? 'FAIL' : 'PASS';

        return {
            hall_ticket: hallTicket,
            name,
            college_code: collegeCode,
            regulation: 'R22', // Inferred or parsed
            year: '1', // Placeholder
            semester: '1', // Placeholder
            status,
            sgpa,
            cgpa,
            subjects,
            marks
        };

    } catch (error) {
        console.error(`Error scraping ${hallTicket}:`, error);
        return null;
    }
}

export async function saveResult(result: StudentResult) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Insert/Update Student
        await client.query(`
      INSERT INTO students (hall_ticket, name, college_code, regulation, year, semester, status, sgpa, cgpa)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (hall_ticket) DO UPDATE SET
        status = EXCLUDED.status,
        sgpa = EXCLUDED.sgpa,
        cgpa = EXCLUDED.cgpa,
        updated_at = CURRENT_TIMESTAMP
    `, [
            result.hall_ticket, result.name, result.college_code, result.regulation,
            result.year, result.semester, result.status, result.sgpa, result.cgpa
        ]);

        // 2. Insert Subjects (Ignore if exists)
        for (const sub of result.subjects) {
            await client.query(`
        INSERT INTO subjects (subject_code, subject_name, credits)
        VALUES ($1, $2, $3)
        ON CONFLICT (subject_code) DO NOTHING
      `, [sub.code, sub.name, sub.credits]);
        }

        // 3. Insert Marks
        for (const mark of result.marks) {
            await client.query(`
        INSERT INTO marks (hall_ticket, subject_code, internal, external, total, grade, grade_points, credits)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (hall_ticket, subject_code) DO UPDATE SET
          internal = EXCLUDED.internal,
          external = EXCLUDED.external,
          total = EXCLUDED.total,
          grade = EXCLUDED.grade
      `, [
                result.hall_ticket, mark.subject_code, mark.internal, mark.external,
                mark.total, mark.grade, mark.grade_points, mark.credits
            ]);
        }

        await client.query('COMMIT');

        // 4. Cache in Redis
        if (redis) {
            await redis.set(`result:${result.hall_ticket}`, JSON.stringify(result), {
                ex: env.cache.ttlSeconds
            });
        }

        return true;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(`Error saving result for ${result.hall_ticket}:`, error);
        throw error;
    } finally {
        client.release();
    }
}
