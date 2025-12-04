import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/src/config/env';

export async function POST(request: NextRequest) {
    // 1. Verify Secret
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== env.api.secretKey) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const start = BigInt(env.scraper.hallTicketStart);
        const end = BigInt(env.scraper.hallTicketEnd);
        const workerCount = env.scraper.workerCount;

        const total = Number(end - start) + 1;
        const chunkSize = Math.ceil(total / workerCount);

        console.log(`🚀 Starting scrape job. Total: ${total}, Workers: ${workerCount}, Chunk: ${chunkSize}`);

        const promises = [];

        // Split into chunks and call workers
        for (let i = 0; i < workerCount; i++) {
            const chunkStart = start + BigInt(i * chunkSize);
            let chunkEnd = chunkStart + BigInt(chunkSize) - 1n;
            if (chunkEnd > end) chunkEnd = end;

            if (chunkStart > end) break;

            // Call worker (fire and forget / async)
            // Note: In Vercel, we can't easily fire-and-forget without waiting.
            // For true parallelism, we'd use a queue (QStash/Inngest).
            // Here we just await them sequentially or use Promise.all (limited by timeout).

            // For this implementation, we'll just return the plan
            // A real production system would push these to a queue.
            promises.push({
                worker: i + 1,
                range: { start: chunkStart.toString(), end: chunkEnd.toString() }
            });
        }

        // In a real serverless setup, we would trigger these asynchronously.
        // For now, we return the plan so you can see what WOULD happen.
        // To actually run it, you'd need to call the worker endpoints.

        return NextResponse.json({
            status: 'started',
            message: 'Scraping job initialized',
            config: {
                total_students: total,
                workers: workerCount,
                chunk_size: chunkSize
            },
            plan: promises
        });

    } catch (error) {
        console.error('Start error:', error);
        return NextResponse.json({ error: 'Failed to start' }, { status: 500 });
    }
}
