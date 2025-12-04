/**
 * Environment Validation Script
 * 
 * Validates that all required environment variables are set correctly.
 * Run with: node scripts/validate-env.js
 */

require('dotenv').config({ path: '.env.local' });

const REQUIRED_VARS = [
    'DATABASE_URL',
    'CRON_SECRET',
    'API_SECRET_KEY',
];

const OPTIONAL_VARS = [
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'JNTUH_RESULTS_BASE_URL',
    'JNTUH_EXAM_CODE',
    'JNTUH_RESULT_TYPE',
    'SCRAPER_WORKER_COUNT',
    'HALL_TICKET_START',
    'HALL_TICKET_END',
    'SCRAPER_DELAY_MS',
    'SCRAPER_TIMEOUT_MS',
    'SCRAPER_MAX_RETRIES',
    'ENABLE_REDIS_CACHE',
    'CACHE_TTL_SECONDS',
];

let hasErrors = false;
let hasWarnings = false;

console.log('🔍 JNTUH Automation - Environment Validation\n');

// Check required variables
console.log('📋 Checking required variables...\n');
REQUIRED_VARS.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
        console.log(`❌ ${varName}: MISSING (required)`);
        hasErrors = true;
    } else {
        // Mask sensitive values
        const displayValue = value.length > 20
            ? `${value.substring(0, 10)}...${value.substring(value.length - 5)}`
            : '***';
        console.log(`✅ ${varName}: ${displayValue}`);
    }
});

// Check optional variables
console.log('\n📋 Checking optional variables...\n');
OPTIONAL_VARS.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
        console.log(`⚠️  ${varName}: not set (using default)`);
        hasWarnings = true;
    } else {
        console.log(`✅ ${varName}: ${value}`);
    }
});

// Special checks
console.log('\n🔍 Running special validations...\n');

// Check DATABASE_URL format
if (process.env.DATABASE_URL) {
    if (!process.env.DATABASE_URL.startsWith('postgresql://')) {
        console.log('❌ DATABASE_URL: Must start with "postgresql://"');
        hasErrors = true;
    } else {
        console.log('✅ DATABASE_URL format looks correct');
    }
}

// Check Redis configuration
const hasRedisUrl = !!process.env.UPSTASH_REDIS_REST_URL;
const hasRedisToken = !!process.env.UPSTASH_REDIS_REST_TOKEN;

if (hasRedisUrl && !hasRedisToken) {
    console.log('⚠️  UPSTASH_REDIS_REST_URL is set but UPSTASH_REDIS_REST_TOKEN is missing');
    hasWarnings = true;
} else if (!hasRedisUrl && hasRedisToken) {
    console.log('⚠️  UPSTASH_REDIS_REST_TOKEN is set but UPSTASH_REDIS_REST_URL is missing');
    hasWarnings = true;
} else if (hasRedisUrl && hasRedisToken) {
    console.log('✅ Redis configuration is complete');
} else {
    console.log('⚠️  Redis is not configured (caching will be disabled)');
    hasWarnings = true;
}

// Check secret strength
if (process.env.CRON_SECRET && process.env.CRON_SECRET.length < 20) {
    console.log('⚠️  CRON_SECRET is too short (should be at least 20 characters)');
    hasWarnings = true;
}

if (process.env.API_SECRET_KEY && process.env.API_SECRET_KEY.length < 20) {
    console.log('⚠️  API_SECRET_KEY is too short (should be at least 20 characters)');
    hasWarnings = true;
}

// Summary
console.log('\n' + '─'.repeat(60));
if (hasErrors) {
    console.log('\n❌ Validation FAILED - Please fix the errors above\n');
    process.exit(1);
} else if (hasWarnings) {
    console.log('\n⚠️  Validation passed with warnings - Review warnings above\n');
    process.exit(0);
} else {
    console.log('\n✅ All environment variables are properly configured!\n');
    process.exit(0);
}
