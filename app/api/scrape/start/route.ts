import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/src/config/env';
import { getXZChunks, getXZTotalCount, getXZBreakdown, estimateScrapingTime } from '@/lib/xz-halltickets';

export async function POST(request: NextRequest) {
    // 1. Verify Secret
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== env.api.secretKey) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const totalTickets = getXZTotalCount();
        const workerCount = env.scraper.workerCount;
        const chunkSize = Math.ceil(totalTickets / workerCount);
        const breakdown = getXZBreakdown();
        const timeEstimate = estimateScrapingTime(env.scraper.delayMs, 300);

        console.log(`🚀 Starting XZ College scrape job`);
        console.log(`📊 Total: ${totalTickets} hall tickets`);
        console.log(`👷 Workers: ${workerCount}`);
        console.log(`📦 Chunk size: ${chunkSize}`);

        // Split hall tickets into chunks
        const chunks = getXZChunks(chunkSize);

        console.log(`✅ Created ${chunks.length} chunks`);

        // Return the plan (in production, you'd trigger workers here)
        const plan = chunks.map((chunk, i) => ({
            worker: i + 1,
            tickets: chunk.length,
            sample: chunk.slice(0, 3) // Show first 3 tickets as sample
        }));

        return NextResponse.json({
            status: 'started',
            message: 'XZ College scraping job initialized',
            config: {
                college: 'XZ',
                regulations: breakdown,
                total_tickets: totalTickets,
                workers: workerCount,
                chunk_size: chunkSize,
                time_estimate: timeEstimate
            },
            plan
        });

    } catch (error) {
        console.error('Start error:', error);
        return NextResponse.json({ error: 'Failed to start' }, { status: 500 });
    }
}
