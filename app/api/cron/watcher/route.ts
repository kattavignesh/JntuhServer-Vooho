import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/src/config/env';
import * as cheerio from 'cheerio';

export async function GET(request: NextRequest) {
    // 1. Verify Cron Secret
    // Support multiple authentication methods:
    // - Vercel Cron (via x-vercel-cron-secret header)
    // - Bearer token (via Authorization header)
    // - Query parameter (for cron services that don't support custom headers)

    const authHeader = request.headers.get('authorization');
    const vercelCronHeader = request.headers.get('x-vercel-cron-secret');
    const { searchParams } = new URL(request.url);
    const querySecret = searchParams.get('secret');

    // Check if request is authenticated via any method
    const isVercelCron = vercelCronHeader === env.cron.secret;
    const isBearerAuth = authHeader === `Bearer ${env.cron.secret}`;
    const isQueryAuth = querySecret === env.cron.secret;

    if (!isVercelCron && !isBearerAuth && !isQueryAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 2. Check JNTUH Results Page (the actual results are in home.jsp, not the frameset)
        const resultsUrl = `${env.jntuh.baseUrl}jsp/home.jsp`;
        const response = await fetch(resultsUrl);
        const html = await response.text();
        const $ = cheerio.load(html);

        // 3. Extract all result links from the page
        // Results are in anchor tags with links to SearchResult.jsp
        const results: Array<{ text: string; url: string; examCode: string }> = [];

        $('a[href*="SearchResult.jsp"]').each((i, el) => {
            const text = $(el).text().trim();
            const url = $(el).attr('href') || '';

            // Extract exam code from URL
            const examCodeMatch = url.match(/examCode=(\d+)/);
            const examCode = examCodeMatch ? examCodeMatch[1] : '';

            if (text && url) {
                results.push({ text, url, examCode });
            }
        });

        const latestResult = results.length > 0
            ? `${results[0].text} (Exam Code: ${results[0].examCode})`
            : 'No results found';

        console.log(`🔍 Checked JNTUH. Latest: ${latestResult}`);
        console.log(`📊 Total results available: ${results.length}`);

        // Logic: If new result found -> Trigger Scraper
        // TODO: Compare with last seen result and trigger scraper if different

        return NextResponse.json({
            status: 'ok',
            latest_result: latestResult,
            total_results: results.length,
            recent_results: results.slice(0, 5).map(r => ({
                title: r.text,
                exam_code: r.examCode
            })),
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Watcher error:', error);
        return NextResponse.json({ error: 'Watcher failed' }, { status: 500 });
    }
}
