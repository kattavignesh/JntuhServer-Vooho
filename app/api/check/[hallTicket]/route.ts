import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import redis from '@/lib/redis';
import { scrapeResult, saveResult } from '@/lib/scraper';

export async function GET(
  request: NextRequest,
  { params }: { params: { hallTicket: string } }
) {
  const hallTicket = params.hallTicket.toUpperCase();

  try {
    // 1. Check Redis Cache
    if (redis) {
      const cached = await redis.get(`result:${hallTicket}`);
      if (cached) {
        return NextResponse.json({ source: 'cache', data: cached });
      }
    }

    // 2. Check Database
    const client = await pool.connect();
    try {
      const res = await client.query(`
        SELECT s.*, 
               json_agg(json_build_object(
                 'subject_code', m.subject_code,
                 'subject_name', sub.subject_name,
                 'grade', m.grade,
                 'total', m.total
               )) as marks
        FROM students s
        LEFT JOIN marks m ON s.hall_ticket = m.hall_ticket
        LEFT JOIN subjects sub ON m.subject_code = sub.subject_code
        WHERE s.hall_ticket = $1
        GROUP BY s.hall_ticket
      `, [hallTicket]);

      if (res.rows.length > 0) {
        const data = res.rows[0];
        // Cache for next time
        if (redis) {
          await redis.set(`result:${hallTicket}`, JSON.stringify(data), { ex: 3600 });
        }
        return NextResponse.json({ source: 'database', data });
      }
    } finally {
      client.release();
    }

    // 3. Fallback: Live Scrape (if not in DB)
    // This is useful if a student checks before the scraper has reached them
    const liveResult = await scrapeResult(hallTicket);
    if (liveResult) {
      await saveResult(liveResult);
      return NextResponse.json({ source: 'live', data: liveResult });
    }

    return NextResponse.json({ error: 'Result not found' }, { status: 404 });

  } catch (error) {
    console.error('Error checking result:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
