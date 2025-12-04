/**
 * Type definitions for environment variables
 * This file provides TypeScript type safety for process.env
 */

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // Database
            DATABASE_URL: string;

            // Redis (Optional)
            UPSTASH_REDIS_REST_URL?: string;
            UPSTASH_REDIS_REST_TOKEN?: string;

            // JNTUH Configuration
            JNTUH_RESULTS_BASE_URL?: string;
            JNTUH_EXAM_CODE?: string;
            JNTUH_RESULT_TYPE?: string;

            // Scraper Configuration
            SCRAPER_WORKER_COUNT?: string;
            HALL_TICKET_START?: string;
            HALL_TICKET_END?: string;
            SCRAPER_DELAY_MS?: string;
            SCRAPER_TIMEOUT_MS?: string;
            SCRAPER_MAX_RETRIES?: string;

            // Cron Configuration
            CRON_SECRET: string;
            WATCHER_CRON_SCHEDULE?: string;

            // API Configuration
            API_SECRET_KEY: string;
            ENABLE_REDIS_CACHE?: string;
            CACHE_TTL_SECONDS?: string;

            // Environment
            NODE_ENV: 'development' | 'production' | 'test';

            // Vercel (automatically set)
            VERCEL?: string;
            VERCEL_ENV?: 'production' | 'preview' | 'development';
            VERCEL_URL?: string;
        }
    }
}

export { };
