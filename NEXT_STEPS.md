# 🎯 STEP 3 & 4: Quick Setup Guide

## ✅ What You've Completed
- [x] Step 1: Neon Postgres setup
- [x] Step 2: Upstash Redis setup
- [ ] Step 3: Generate secrets (DONE - see below)
- [ ] Step 4: Create .env.local file

---

## 🔐 Step 3: Your Generated Secrets

I've generated secure random secrets for you:

```
CRON_SECRET=g691/PktO5cQpD2upVwUg5hXLXuCuPPBHMsT6wsXBKwM=
API_SECRET_KEY=I67dCfHIPfLyhw7r4XlOegRLcHaOTFFBgQIpTKgHKftg=
```

✅ **Step 3 Complete!** These are ready to use.

---

## 📝 Step 4: Create Your .env.local File

### Option A: Manual Creation (Recommended)

1. **Create a new file** in the project root named: `.env.local`

2. **Copy the template** from `SETUP_YOUR_ENV.txt` into `.env.local`

3. **Fill in these 3 values:**

   ```env
   # From Neon (Step 1)
   DATABASE_URL=postgresql://your-actual-connection-string-here
   
   # From Upstash (Step 2)
   UPSTASH_REDIS_REST_URL=https://your-actual-url-here
   UPSTASH_REDIS_REST_TOKEN=your-actual-token-here
   ```

4. **Save the file**

### Option B: Command Line

Run this in PowerShell:

```powershell
# Copy the template
Copy-Item .env.local.example .env.local

# Then edit .env.local in your text editor
notepad .env.local
```

---

## 📋 What You Need to Fill In

### 1. DATABASE_URL (from Neon)

**Where to find it:**
- Go to: https://console.neon.tech
- Click your project
- Click "Connection Details"
- Copy the **"Pooled connection"** string

**Example:**
```
postgresql://myuser:mypass@ep-cool-name-123.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 2. UPSTASH_REDIS_REST_URL (from Upstash)

**Where to find it:**
- Go to: https://console.upstash.com
- Click your database
- Scroll to **"REST API"** section
- Copy the **UPSTASH_REDIS_REST_URL**

**Example:**
```
https://merry-firefly-12345.upstash.io
```

### 3. UPSTASH_REDIS_REST_TOKEN (from Upstash)

**Where to find it:**
- Same page as above
- Copy the **UPSTASH_REDIS_REST_TOKEN**

**Example:**
```
AXQgASQgOTk4ZjE4YmEtYjk3Ny00YzQzLWI5ZTctMGE4ZjE4YmEtYjk3Nw==
```

---

## ✅ Validation

After creating `.env.local`, run:

```bash
node scripts/validate-env.js
```

You should see:
```
✅ All environment variables are properly configured!
```

---

## 🎯 Your Complete .env.local Should Look Like:

```env
# Database
DATABASE_URL=postgresql://[your-neon-connection-string]

# Redis
UPSTASH_REDIS_REST_URL=https://[your-upstash-url]
UPSTASH_REDIS_REST_TOKEN=[your-upstash-token]

# Secrets (already generated)
CRON_SECRET=g691/PktO5cQpD2upVwUg5hXLXuCuPPBHMsT6wsXBKwM=
API_SECRET_KEY=I67dCfHIPfLyhw7r4XlOegRLcHaOTFFBgQIpTKgHKftg=

# JNTUH Config
JNTUH_RESULTS_BASE_URL=http://results.jntuh.ac.in/results/
JNTUH_EXAM_CODE=1323
JNTUH_RESULT_TYPE=grade

# Scraper - R22 Test Range
SCRAPER_WORKER_COUNT=5
HALL_TICKET_START=220100000001
HALL_TICKET_END=220100000100
SCRAPER_DELAY_MS=200
SCRAPER_TIMEOUT_MS=10000
SCRAPER_MAX_RETRIES=3

# Other
WATCHER_CRON_SCHEDULE=* * * * *
ENABLE_REDIS_CACHE=true
CACHE_TTL_SECONDS=3600
NODE_ENV=development
```

---

## 🆘 Troubleshooting

### "I can't find my Neon connection string"
1. Go to https://console.neon.tech
2. Click your project name
3. Look for "Connection Details" or "Connection String"
4. Make sure to select "Pooled connection"

### "I can't find my Upstash credentials"
1. Go to https://console.upstash.com
2. Click your database name
3. Scroll down to find "REST API" section (NOT the regular connection)
4. Copy both URL and TOKEN

### "Validation fails"
- Make sure `.env.local` exists in project root
- Check there are no extra spaces
- Verify DATABASE_URL starts with `postgresql://`
- Ensure all three credentials are filled in

---

## ➡️ Next Steps (After .env.local is ready)

1. ✅ Validate: `node scripts/validate-env.js`
2. 📦 Install dependencies: `npm install`
3. 🗄️ Create database tables (next step)
4. 🧪 Test locally: `npm run dev`
5. 🚀 Deploy to Vercel

---

## 📞 Quick Links

- **Neon Dashboard:** https://console.neon.tech
- **Upstash Dashboard:** https://console.upstash.com
- **Your Secrets:** See top of this file
- **Full Template:** See `SETUP_YOUR_ENV.txt`

---

**You're almost there! Just create `.env.local` and fill in those 3 values!** 🚀
