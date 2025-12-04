/**
 * Environment Configuration Module
 * 
 * Centralizes all environment variable access with type safety and validation.
 * Provides default values and ensures required variables are present.
 */

/**
 * Validates that a required environment variable is present
 * @param key - The environment variable key
 * @param value - The environment variable value
 * @returns The validated value
 * @throws Error if the value is missing
 */
function requireEnv(key: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Gets an optional environment variable with a default value
 * @param key - The environment variable key
 * @param defaultValue - The default value if not set
 * @returns The environment variable value or default
 */
function getEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Gets a boolean environment variable
 * @param key - The environment variable key
 * @param defaultValue - The default value if not set
 * @returns The boolean value
 */
function getBoolEnv(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Gets a number environment variable
 * @param key - The environment variable key
 * @param defaultValue - The default value if not set
 * @returns The number value
 */
function getNumberEnv(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Database Configuration
 */
export const database = {
  url: requireEnv('DATABASE_URL', process.env.DATABASE_URL),
} as const;

/**
 * Redis Configuration (Optional)
 */
export const redis = {
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
  enabled: getBoolEnv('ENABLE_REDIS_CACHE', true) && 
           !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
} as const;

/**
 * JNTUH Portal Configuration
 */
export const jntuh = {
  baseUrl: getEnv('JNTUH_RESULTS_BASE_URL', 'http://results.jntuh.ac.in/results/'),
  examCode: getEnv('JNTUH_EXAM_CODE', '1323'),
  resultType: getEnv('JNTUH_RESULT_TYPE', 'grade'),
} as const;

/**
 * Scraper Configuration
 */
export const scraper = {
  workerCount: getNumberEnv('SCRAPER_WORKER_COUNT', 10),
  hallTicketStart: getEnv('HALL_TICKET_START', '160121733001'),
  hallTicketEnd: getEnv('HALL_TICKET_END', '160121733999'),
  delayMs: getNumberEnv('SCRAPER_DELAY_MS', 100),
  timeoutMs: getNumberEnv('SCRAPER_TIMEOUT_MS', 10000),
  maxRetries: getNumberEnv('SCRAPER_MAX_RETRIES', 3),
} as const;

/**
 * Cron Job Configuration
 */
export const cron = {
  secret: requireEnv('CRON_SECRET', process.env.CRON_SECRET),
  watcherSchedule: getEnv('WATCHER_CRON_SCHEDULE', '* * * * *'),
} as const;

/**
 * API Configuration
 */
export const api = {
  secretKey: requireEnv('API_SECRET_KEY', process.env.API_SECRET_KEY),
  enableCache: getBoolEnv('ENABLE_REDIS_CACHE', true),
  cacheTtlSeconds: getNumberEnv('CACHE_TTL_SECONDS', 604800), // 7 days default
} as const;

/**
 * Cache Configuration
 */
export const cache = {
  ttlSeconds: getNumberEnv('CACHE_TTL_SECONDS', 604800), // 7 days
  enabled: redis.enabled && api.enableCache,
} as const;

/**
 * Application Environment
 */
export const app = {
  env: getEnv('NODE_ENV', 'development'),
  isDevelopment: getEnv('NODE_ENV', 'development') === 'development',
  isProduction: getEnv('NODE_ENV', 'development') === 'production',
  isVercel: getBoolEnv('VERCEL', false),
} as const;

/**
 * Complete environment configuration object
 */
export const env = {
  database,
  redis,
  jntuh,
  scraper,
  cron,
  api,
  cache,
  app,
} as const;

/**
 * Validates all required environment variables on startup
 * Call this function early in your application initialization
 */
export function validateEnv(): void {
  try {
    // Test required variables
    requireEnv('DATABASE_URL', process.env.DATABASE_URL);
    requireEnv('CRON_SECRET', process.env.CRON_SECRET);
    requireEnv('API_SECRET_KEY', process.env.API_SECRET_KEY);

    // Warn about optional Redis configuration
    if (!redis.enabled) {
      console.warn('⚠️  Redis caching is disabled. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to enable caching.');
    }

    console.log('✅ Environment variables validated successfully');
    console.log(`📊 Environment: ${app.env}`);
    console.log(`🗄️  Database: ${database.url.split('@')[1]?.split('/')[0] || 'configured'}`);
    console.log(`⚡ Redis Cache: ${redis.enabled ? 'enabled' : 'disabled'}`);
    console.log(`👷 Scraper Workers: ${scraper.workerCount}`);
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    throw error;
  }
}

export default env;
