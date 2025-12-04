# JNTUH Results Automation System

An automated system for fetching, storing, and serving JNTUH examination results with high availability and performance.

## 🚀 Features

- **Automated Result Watching**: Cron job checks every minute for new results
- **Parallel Scraping**: Multiple workers scrape results simultaneously for fast data collection
- **High Availability**: Results cached in Redis and stored in Postgres for reliability
- **Fast API**: Sub-second response times with Redis caching
- **Type-Safe**: Built with TypeScript for reliability
- **Vercel-Ready**: Optimized for serverless deployment

## 🛠️ Tech Stack

- **Framework**: Next.js (API Routes + Serverless Functions)
- **Language**: TypeScript
- **Database**: Neon Postgres (serverless PostgreSQL)
- **Cache**: Upstash Redis (optional, for performance)
- **Deployment**: Vercel (with cron jobs)

## 📋 Prerequisites

- Node.js 18+ installed
- A Neon Postgres database account ([neon.tech](https://neon.tech))
- (Optional) An Upstash Redis account ([upstash.com](https://upstash.com))
- A Vercel account for deployment ([vercel.com](https://vercel.com))

## ⚙️ Environment Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd jntuhautomation
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

### 3. Required Environment Variables

Edit `.env.local` and configure the following:

#### Database Configuration (Required)
```env
DATABASE_URL=postgresql://user:password@your-neon-host.neon.tech/jntuh_results?sslmode=require
```

Get your Neon Postgres connection string from:
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard

#### API Security (Required)
```env
CRON_SECRET=your-secret-key-here
API_SECRET_KEY=your-api-secret-key-here
```

Generate secure random strings for these values:
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

#### Redis Configuration (Optional, but recommended)
```env
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token-here
ENABLE_REDIS_CACHE=true
```

Get your Upstash Redis credentials from:
1. Go to [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Copy the REST URL and Token

#### JNTUH Configuration
```env
JNTUH_RESULTS_BASE_URL=http://results.jntuh.ac.in/results/
JNTUH_EXAM_CODE=1323
JNTUH_RESULT_TYPE=grade
```

Update `JNTUH_EXAM_CODE` when new results are released.

#### Scraper Configuration
```env
SCRAPER_WORKER_COUNT=10
HALL_TICKET_START=160121733001
HALL_TICKET_END=160121733999
SCRAPER_DELAY_MS=100
SCRAPER_TIMEOUT_MS=10000
SCRAPER_MAX_RETRIES=3
```

Adjust hall ticket ranges based on your target batch.

### 4. Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ | - | Neon Postgres connection string |
| `UPSTASH_REDIS_REST_URL` | ❌ | - | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | ❌ | - | Upstash Redis authentication token |
| `CRON_SECRET` | ✅ | - | Secret for authenticating cron jobs |
| `API_SECRET_KEY` | ✅ | - | Secret for protected API endpoints |
| `JNTUH_RESULTS_BASE_URL` | ❌ | `http://results.jntuh.ac.in/results/` | JNTUH results portal URL |
| `JNTUH_EXAM_CODE` | ❌ | `1323` | Current exam code |
| `JNTUH_RESULT_TYPE` | ❌ | `grade` | Result type (grade/cbcs) |
| `SCRAPER_WORKER_COUNT` | ❌ | `10` | Number of parallel scraping workers |
| `HALL_TICKET_START` | ❌ | `160121733001` | Starting hall ticket number |
| `HALL_TICKET_END` | ❌ | `160121733999` | Ending hall ticket number |
| `SCRAPER_DELAY_MS` | ❌ | `100` | Delay between requests (ms) |
| `SCRAPER_TIMEOUT_MS` | ❌ | `10000` | Request timeout (ms) |
| `SCRAPER_MAX_RETRIES` | ❌ | `3` | Max retry attempts |
| `ENABLE_REDIS_CACHE` | ❌ | `true` | Enable/disable Redis caching |
| `CACHE_TTL_SECONDS` | ❌ | `604800` | Cache TTL (7 days) |
| `NODE_ENV` | ❌ | `development` | Environment mode |

## 🚀 Running Locally

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## 📦 Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add all environment variables from `.env.example`
4. Deploy!

### 3. Configure Cron Jobs

In your Vercel project, add a `vercel.json` file (already included) to enable cron jobs.

## 📚 API Documentation

### Check Result
```
GET /api/check/:hallTicket
```

Returns student result from cache or database.

### Start Scraping (Protected)
```
POST /api/scrape/start
Headers: { "x-api-key": "your-api-secret-key" }
```

Initiates the scraping process for all hall tickets.

### Worker Endpoint (Protected)
```
POST /api/scrape/worker
Headers: { "x-api-key": "your-api-secret-key" }
Body: { "start": "160121733001", "end": "160121733100" }
```

Scrapes a specific range of hall tickets.

## 🔒 Security Notes

- **Never commit `.env.local` or `.env` files**
- Use strong random strings for `CRON_SECRET` and `API_SECRET_KEY`
- Rotate secrets periodically
- Use environment variables in Vercel dashboard for production

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.
