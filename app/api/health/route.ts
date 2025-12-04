import { NextResponse } from 'next/server';
import { env } from '@/src/config/env';

export async function GET() {
    try {
        const status = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: env.app.env,
            database: {
                configured: !!env.database.url,
                type: 'Neon Postgres',
            },
            redis: {
                configured: env.redis.enabled,
                enabled: env.cache.enabled,
            },
            scraper: {
                workers: env.scraper.workerCount,
                hallTicketRange: {
                    start: env.scraper.hallTicketStart,
                    end: env.scraper.hallTicketEnd,
                },
            },
        };

        return NextResponse.json(status, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                status: 'error',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
