# 🧪 Local Testing Guide

This guide will help you test the JNTUH automation system on your local machine before deploying to Vercel.

## ✅ Prerequisites Checklist

Before you start:
- [ ] `.env.local` file created with your credentials
- [ ] Node.js installed (v18 or higher)
- [ ] Git initialized in project
- [ ] Neon Postgres database created
- [ ] Upstash Redis database created (optional)

---

## 📦 Step 1: Initialize Next.js Project

Since this is a fresh project, we need to set up Next.js first.

### Option A: Create Next.js App (Recommended)

```bash
# Initialize Next.js with TypeScript
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# When prompted:
# ✓ Would you like to use TypeScript? → Yes
# ✓ Would you like to use ESLint? → Yes
# ✓ Would you like to use Tailwind CSS? → Yes
# ✓ Would you like to use `src/` directory? → No
# ✓ Would you like to use App Router? → Yes
# ✓ Would you like to customize the default import alias? → No
```

### Option B: Manual Setup

If you prefer manual setup:

```bash
# Install dependencies
npm install next@latest react@latest react-dom@latest typescript @types/react @types/node

# Install additional dependencies
npm install @neondatabase/serverless
npm install @upstash/redis
npm install cheerio  # For HTML parsing
npm install dotenv
```

---

## 🗄️ Step 2: Create Database Schema

Create the database tables in your Neon Postgres:

```bash
# We'll create a migration script
node scripts/create-tables.js
```

**Note:** We need to create this script first. See below.

---

## 🚀 Step 3: Start Development Server

```bash
# Install all dependencies
npm install

# Start the development server
npm run dev
```

The server will start at: **http://localhost:3000**

---

## 🧪 Step 4: Test the APIs

### Test 1: Health Check

Open your browser or use curl:

```bash
# Browser
http://localhost:3000/api/health

# Or curl
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "redis": "connected"
}
```

### Test 2: Check a Single Result

```bash
# Replace with an actual R22 hall ticket
curl http://localhost:3000/api/check/220123456789
```

### Test 3: Trigger Scraper (Small Range)

```bash
# Start scraping with your test range
curl -X POST http://localhost:3000/api/scrape/start \
  -H "x-api-key: I67dCfHIPfLyhw7r4XlOegRLcHaOTFFBgQIpTKgHKftg="
```

This will scrape the range defined in your `.env.local`:
- `HALL_TICKET_START=220100000001`
- `HALL_TICKET_END=220100000100` (100 students)

---

## 📊 Step 5: Monitor Progress

### Check Console Logs

Watch your terminal for:
```
✅ Scraping started
📥 Processing hall ticket: 220100000001
✅ Found result for: 220100000001
❌ No result for: 220100000002 (404)
...
✅ Scraping complete! Found 45 results out of 100
```

### Check Database

You can check your Neon database:

1. Go to https://console.neon.tech
2. Click your project
3. Click "Tables" or "SQL Editor"
4. Run query:
   ```sql
   SELECT COUNT(*) FROM students;
   SELECT * FROM students LIMIT 10;
   ```

### Check Redis Cache

If Redis is enabled:

1. Go to https://console.upstash.com
2. Click your database
3. Click "Data Browser"
4. Search for cached results

---

## 🎯 Local Testing Workflow

### Phase 1: Minimal Test (5 minutes)

```env
# In .env.local - test with just 10 hall tickets
HALL_TICKET_START=220100000001
HALL_TICKET_END=220100000010
SCRAPER_WORKER_COUNT=2
```

**Run:**
```bash
npm run dev
# Then trigger scraper via API
```

### Phase 2: Small Batch (15 minutes)

```env
# Test with 100 hall tickets
HALL_TICKET_START=220100000001
HALL_TICKET_END=220100000100
SCRAPER_WORKER_COUNT=5
```

### Phase 3: Medium Batch (1 hour)

```env
# Test with 1000 hall tickets
HALL_TICKET_START=220100000001
HALL_TICKET_END=220100001000
SCRAPER_WORKER_COUNT=10
```

### Phase 4: Production Ready

Once everything works locally, deploy to Vercel with full range:
```env
HALL_TICKET_START=220100000001
HALL_TICKET_END=220999999999
SCRAPER_WORKER_COUNT=20
```

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production (test build)
npm run build

# Run production build locally
npm run start

# Type checking
npm run type-check

# Linting
npm run lint

# Validate environment
node scripts/validate-env.js
```

---

## 📁 Project Structure

After setup, your project should look like:

```
jntuhautomation/
├── app/
│   ├── api/
│   │   ├── check/[hallTicket]/route.ts
│   │   ├── scrape/
│   │   │   ├── start/route.ts
│   │   │   └── worker/route.ts
│   │   └── health/route.ts
│   └── page.tsx
├── lib/
│   ├── db.ts              # Database connection
│   ├── redis.ts           # Redis connection
│   └── scraper.ts         # Scraping logic
├── src/
│   ├── config/
│   │   └── env.ts         # Environment config
│   └── types/
│       └── env.d.ts       # Type definitions
├── scripts/
│   ├── generate-secrets.js
│   ├── validate-env.js
│   └── create-tables.js   # Database setup
├── .env.local             # Your local config
├── .env.example           # Template
├── package.json
├── tsconfig.json
└── next.config.js
```

---

## 🧪 Testing Checklist

- [ ] Environment variables validated
- [ ] Development server starts without errors
- [ ] Database connection works
- [ ] Redis connection works (if enabled)
- [ ] Health check API responds
- [ ] Can scrape a single hall ticket
- [ ] Can scrape small batch (10 tickets)
- [ ] Results saved to database
- [ ] Results cached in Redis
- [ ] Can retrieve results via API
- [ ] Error handling works (invalid hall tickets)

---

## 🐛 Common Issues & Solutions

### "Module not found: Can't resolve 'next'"

**Solution:**
```bash
npm install next react react-dom
```

### "Database connection failed"

**Solution:**
- Check `DATABASE_URL` in `.env.local`
- Verify Neon database is active
- Test connection in Neon dashboard

### "Redis connection failed"

**Solution:**
- Check Redis credentials in `.env.local`
- Redis is optional - set `ENABLE_REDIS_CACHE=false` to disable

### "Port 3000 already in use"

**Solution:**
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 npm run dev
```

### "Cannot find module '@/config/env'"

**Solution:**
- Make sure `src/config/env.ts` exists
- Check `tsconfig.json` has correct paths

---

## 📊 Performance Monitoring

### Local Performance Metrics

Monitor these while testing:

| Metric | Good | Warning | Bad |
|--------|------|---------|-----|
| **Requests/sec** | 10-20 | 5-10 | <5 |
| **Success rate** | >80% | 50-80% | <50% |
| **Avg response time** | <500ms | 500-1000ms | >1000ms |
| **Memory usage** | <200MB | 200-500MB | >500MB |

### Check Performance

```bash
# Monitor memory usage
node --max-old-space-size=512 npm run dev

# Check request timing
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/check/220123456789
```

---

## 🎯 Local vs Production Differences

| Feature | Local | Production (Vercel) |
|---------|-------|---------------------|
| **Workers** | 5 | 20 |
| **Delay** | 200ms | 50ms |
| **Range** | 100 tickets | Full university |
| **Cron jobs** | Manual trigger | Automatic |
| **Timeout** | No limit | 60s (Pro) / 10s (Hobby) |

---

## ✅ When You're Ready for Production

After successful local testing:

1. **Commit your code:**
   ```bash
   git add .
   git commit -m "Initial working version"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Follow `docs/DEPLOYMENT_GUIDE.md`
   - Add environment variables
   - Enable cron jobs

3. **Update configuration:**
   - Increase workers to 20
   - Decrease delay to 50ms
   - Set full hall ticket range

---

## 🚀 Quick Start Commands

```bash
# Complete local setup in one go:

# 1. Validate environment
node scripts/validate-env.js

# 2. Install dependencies
npm install

# 3. Create database tables
node scripts/create-tables.js

# 4. Start development server
npm run dev

# 5. Test health check (in new terminal)
curl http://localhost:3000/api/health

# 6. Trigger test scrape
curl -X POST http://localhost:3000/api/scrape/start \
  -H "x-api-key: I67dCfHIPfLyhw7r4XlOegRLcHaOTFFBgQIpTKgHKftg="
```

---

## 📞 Need Help?

- **Environment issues:** Run `node scripts/validate-env.js`
- **Build errors:** Check `npm run build` output
- **API errors:** Check browser console / terminal logs
- **Database issues:** Check Neon dashboard

---

**Happy local testing! 🧪🚀**

Once everything works locally, deploying to Vercel will be smooth!
