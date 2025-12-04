import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/src/config/env';
import { scrapeResult, saveResult } from '@/lib/scraper';

export async function POST(request: NextRequest) {
    // 1. Verify Secret
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== env.api.secretKey) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { start, end } = await request.json();
        const startNum = BigInt(start);
        const endNum = BigInt(end);

        console.log(`👷 Worker started for range: ${start} - ${end}`);

        let processed = 0;
        let success = 0;
        const errors: string[] = [];

        // Loop through range
        for (let ht = startNum; ht <= endNum; ht++) {
            const hallTicket = ht.toString();
            processed++;

            try {
                // Add delay to avoid rate limiting
                await new Promise(r => setTimeout(r, env.scraper.delayMs));

                const result = await scrapeResult(hallTicket);
                if (result) {
                    await saveResult(result);
                    success++;
                    console.log(`✅ Saved: ${hallTicket}`);
                } else {
                    // console.log(`❌ Not found: ${hallTicket}`);
                }
            } catch (err) {
                console.error(`Error processing ${hallTicket}:`, err);
                errors.push(hallTicket);
            }
        }

        return NextResponse.json({
            status: 'complete',
            range: { start, end },
            stats: { processed, success, errors: errors.length }
        });

    } catch (error) {
        console.error('Worker error:', error);
        return NextResponse.json({ error: 'Worker failed' }, { status: 500 });
    }
}
