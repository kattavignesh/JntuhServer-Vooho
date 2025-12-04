# Environment Variables Setup Guide

This guide provides detailed instructions for setting up all environment variables for the JNTUH Results Automation System.

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Generate secrets:**
   ```bash
   node scripts/generate-secrets.js
   ```

3. **Edit `.env.local`** with your actual values

4. **Validate configuration:**
   ```bash
   node scripts/validate-env.js
   ```

## Required Environment Variables

### 1. DATABASE_URL (Required)

**Purpose:** Connection string for Neon Postgres database

**Format:** 
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

**How to get:**
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Navigate to your project dashboard
4. Click "Connection Details"
5. Copy the connection string
6. Paste it as the value for `DATABASE_URL`

**Example:**
```env
DATABASE_URL=postgresql://myuser:mypassword@ep-cool-darkness-123456.us-east-2.aws.neon.tech/jntuh_results?sslmode=require
```

### 2. CRON_SECRET (Required)

**Purpose:** Secret key for authenticating cron job requests

**Security:** Must be a strong, random string (minimum 32 characters recommended)

**How to generate:**

**Option 1 - Use the helper script:**
```bash
node scripts/generate-secrets.js
```

**Option 2 - Generate manually:**

On Linux/Mac:
```bash
openssl rand -base64 32
```

On Windows PowerShell:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Example:**
```env
CRON_SECRET=xK9mP2vN8qR5tY7wE3aS6dF1gH4jL0zX
```

### 3. API_SECRET_KEY (Required)

**Purpose:** Secret key for authenticating protected API endpoints

**Security:** Must be a strong, random string (minimum 32 characters recommended)

**How to generate:** Same as CRON_SECRET above

**Example:**
```env
API_SECRET_KEY=bN5vC8xZ2mQ4wE7rT9yU1iO3pA6sD0fG
```

## Optional Environment Variables

### Redis Configuration (Recommended for Production)

#### UPSTASH_REDIS_REST_URL

**Purpose:** REST API URL for Upstash Redis

**How to get:**
1. Sign up at [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Select "REST API" tab
4. Copy the "UPSTASH_REDIS_REST_URL"

**Example:**
```env
UPSTASH_REDIS_REST_URL=https://us1-merry-firefly-12345.upstash.io
```

#### UPSTASH_REDIS_REST_TOKEN

**Purpose:** Authentication token for Upstash Redis

**How to get:** From the same page as the URL above

**Example:**
```env
UPSTASH_REDIS_REST_TOKEN=AXQgASQgOTk4ZjE4YmEtYjk3Ny00YzQzLWI5ZTctMGE4ZjE4YmEtYjk3Nw==
```

### JNTUH Configuration

#### JNTUH_RESULTS_BASE_URL

**Purpose:** Base URL for JNTUH results portal

**Default:** `http://results.jntuh.ac.in/results/`

**When to change:** If JNTUH changes their results portal URL

**Example:**
```env
JNTUH_RESULTS_BASE_URL=http://results.jntuh.ac.in/results/
```

#### JNTUH_EXAM_CODE

**Purpose:** Exam code for the current results

**Default:** `1323`

**When to change:** Update this when new results are released with a different exam code

**How to find:** Check the JNTUH results page URL or form parameters

**Example:**
```env
JNTUH_EXAM_CODE=1323
```

#### JNTUH_RESULT_TYPE

**Purpose:** Type of result to fetch

**Default:** `grade`

**Options:** `grade`, `cbcs`, etc.

**Example:**
```env
JNTUH_RESULT_TYPE=grade
```

### Scraper Configuration

#### SCRAPER_WORKER_COUNT

**Purpose:** Number of parallel workers for scraping

**Default:** `10`

**Recommendations:**
- Development: `3-5` (lower to avoid overwhelming your connection)
- Production: `10-20` (higher for faster scraping)

**Example:**
```env
SCRAPER_WORKER_COUNT=10
```

#### HALL_TICKET_START

**Purpose:** Starting hall ticket number for scraping

**Default:** `160121733001`

**How to determine:** Based on your target batch/college

**Example:**
```env
HALL_TICKET_START=160121733001
```

#### HALL_TICKET_END

**Purpose:** Ending hall ticket number for scraping

**Default:** `160121733999`

**Example:**
```env
HALL_TICKET_END=160121733999
```

#### SCRAPER_DELAY_MS

**Purpose:** Delay between requests in milliseconds

**Default:** `100`

**Recommendations:**
- Faster scraping: `50-100ms`
- Avoid rate limiting: `200-500ms`

**Example:**
```env
SCRAPER_DELAY_MS=100
```

#### SCRAPER_TIMEOUT_MS

**Purpose:** Request timeout in milliseconds

**Default:** `10000` (10 seconds)

**Example:**
```env
SCRAPER_TIMEOUT_MS=10000
```

#### SCRAPER_MAX_RETRIES

**Purpose:** Maximum number of retry attempts for failed requests

**Default:** `3`

**Example:**
```env
SCRAPER_MAX_RETRIES=3
```

### Cache Configuration

#### ENABLE_REDIS_CACHE

**Purpose:** Enable or disable Redis caching

**Default:** `true`

**Options:** `true`, `false`

**Note:** Automatically disabled if Redis credentials are not provided

**Example:**
```env
ENABLE_REDIS_CACHE=true
```

#### CACHE_TTL_SECONDS

**Purpose:** Cache time-to-live in seconds

**Default:** `604800` (7 days)

**Recommendations:**
- During result season: `86400` (1 day)
- After results stabilize: `604800` (7 days)

**Example:**
```env
CACHE_TTL_SECONDS=604800
```

### Cron Configuration

#### WATCHER_CRON_SCHEDULE

**Purpose:** Cron schedule for the result watcher

**Default:** `* * * * *` (every minute)

**Format:** Standard cron format

**Examples:**
- Every minute: `* * * * *`
- Every 5 minutes: `*/5 * * * *`
- Every hour: `0 * * * *`

**Example:**
```env
WATCHER_CRON_SCHEDULE=* * * * *
```

## Environment-Specific Configurations

### Development (.env.local)

```env
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/jntuh_dev
CRON_SECRET=dev-secret-123
API_SECRET_KEY=dev-api-key-456
SCRAPER_WORKER_COUNT=3
HALL_TICKET_START=160121733001
HALL_TICKET_END=160121733050
ENABLE_REDIS_CACHE=false
```

### Production (Vercel Environment Variables)

Set these in your Vercel project dashboard:

1. Go to your project on Vercel
2. Navigate to Settings → Environment Variables
3. Add each variable with its production value
4. Select "Production" environment
5. Save

**Important production values:**
- Use strong, unique secrets
- Enable Redis caching
- Use production database URL
- Adjust worker count based on your needs

## Validation

After setting up your environment variables, validate them:

```bash
node scripts/validate-env.js
```

This will check:
- ✅ All required variables are present
- ✅ Database URL format is correct
- ✅ Redis configuration is complete (if provided)
- ✅ Secrets are strong enough
- ⚠️ Warnings for missing optional variables

## Security Best Practices

1. **Never commit `.env.local` or `.env` files** to version control
2. **Use strong, random secrets** (minimum 32 characters)
3. **Rotate secrets periodically** (every 3-6 months)
4. **Use different secrets** for development and production
5. **Limit access** to environment variables in production
6. **Use Vercel's environment variables** for production deployment
7. **Enable SSL/TLS** for database connections (already in DATABASE_URL)

## Troubleshooting

### "Missing required environment variable" error

**Solution:** Check that you've created `.env.local` and set all required variables

### "Database connection failed" error

**Solution:** 
- Verify DATABASE_URL is correct
- Check that your Neon database is active
- Ensure `?sslmode=require` is in the connection string

### "Redis connection failed" warning

**Solution:**
- This is normal if you haven't set up Redis
- Redis is optional; the system will work without it
- To enable Redis, set both `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

### Cron jobs not running

**Solution:**
- Verify `CRON_SECRET` is set correctly
- Check that `vercel.json` includes cron configuration
- Ensure cron jobs are enabled in Vercel dashboard

## Additional Resources

- [Neon Postgres Documentation](https://neon.tech/docs)
- [Upstash Redis Documentation](https://docs.upstash.com/redis)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
