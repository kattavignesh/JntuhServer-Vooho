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
        const { hallTickets } = await request.json();

        if (!hallTickets || !Array.isArray(hallTickets)) {
            return NextResponse.json({ error: 'Invalid request. Expected { hallTickets: string[] }' }, { status: 400 });
        }

        console.log(`👷 Worker started for ${hallTickets.length} hall tickets`);

        let processed = 0;
        let success = 0;
        let notFound = 0;
        const errors: string[] = [];

        // Process each hall ticket
        for (const hallTicket of hallTickets) {
            processed++;

            try {
                // Add delay to avoid rate limiting
                if (processed > 1) {
                    await new Promise(r => setTimeout(r, env.scraper.delayMs));
                }

                const result = await scrapeResult(hallTicket);
                if (result) {
                    await saveResult(result);
                    success++;
                    console.log(`✅ ${hallTicket}`);
                } else {
                    notFound++;
                    // console.log(`❌ ${hallTicket} - Not found`);
                }
            } catch (err) {
                console.error(`Error processing ${hallTicket}:`, err);
                errors.push(hallTicket);
            }
        }

        return NextResponse.json({
            status: 'complete',
            stats: {
                processed,
                success,
                notFound,
                errors: errors.length
            }
        });

    } catch (error) {
        console.error('Worker error:', error);
        return NextResponse.json({ error: 'Worker failed' }, { status: 500 });
    }
}
