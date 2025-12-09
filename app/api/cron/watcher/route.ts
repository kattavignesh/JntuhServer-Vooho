import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/src/config/env';
import * as cheerio from 'cheerio';

export async function GET(request: NextRequest) {
    // 1. Verify Cron Secret
    // Support both Vercel Cron (via special header) and manual Bearer token
    const authHeader = request.headers.get('authorization');
    const vercelCronHeader = request.headers.get('x-vercel-cron-secret');

    // Check if request is from Vercel Cron or has valid Bearer token
    const isVercelCron = vercelCronHeader === env.cron.secret;
    const isBearerAuth = authHeader === `Bearer ${env.cron.secret}`;

    if (!isVercelCron && !isBearerAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 2. Check JNTUH Results Page
        const response = await fetch(env.jntuh.baseUrl);
        const html = await response.text();
        const $ = cheerio.load(html);

        // 3. Look for new results (simplified logic)
        // In reality, you'd check the latest link text against a stored "last seen" value
        // or check if specific keywords like "R22" and "Regular" appear in top links.

        const links = $('table a').map((i, el) => $(el).text().trim()).get();
        const latestResult = links[0] || 'No results found';

        console.log(`🔍 Checked JNTUH. Latest: ${latestResult}`);

        // Logic: If new result found -> Trigger Scraper
        // For now, we just log it.

        return NextResponse.json({
            status: 'ok',
            latest_result: latestResult,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Watcher error:', error);
        return NextResponse.json({ error: 'Watcher failed' }, { status: 500 });
    }
}
