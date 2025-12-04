# Complete Deployment Setup Guide

This guide will walk you through setting up **Neon Postgres**, **Upstash Redis**, and **Vercel** for your JNTUH automation system.

## 📋 Prerequisites

- A GitHub account
- A Google/GitHub account for signing into services
- Your project code ready to push

---

## Part 1: Neon Postgres Setup (5 minutes)

### Step 1: Create Neon Account

1. Go to **[neon.tech](https://neon.tech)**
2. Click **"Sign Up"** (top right)
3. Sign up with GitHub or Google
4. Verify your email if prompted

### Step 2: Create Your Database

1. After login, you'll see the dashboard
2. Click **"Create a project"** or **"New Project"**
3. Fill in the details:
   - **Project Name:** `jntuh-automation` (or any name you prefer)
   - **Region:** Choose closest to your users (e.g., `US East (Ohio)` or `Asia Pacific (Singapore)`)
   - **Postgres Version:** Leave default (latest)
4. Click **"Create Project"**

### Step 3: Get Your Connection String

1. After project creation, you'll see the **Connection Details** page
2. Look for **"Connection string"** section
3. Select **"Pooled connection"** (recommended for serverless)
4. Copy the connection string - it looks like:
   ```
   postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. **IMPORTANT:** Save this somewhere safe! You'll need it for `.env.local`

### Step 4: Create Database Tables (We'll do this later)

We'll create the tables after setting up the Next.js project.

### ✅ Neon Setup Complete!

**What you have:**
- ✅ Neon Postgres database
- ✅ Connection string (DATABASE_URL)

---

## Part 2: Upstash Redis Setup (5 minutes)

### Step 1: Create Upstash Account

1. Go to **[upstash.com](https://upstash.com)**
2. Click **"Login"** or **"Get Started"**
3. Sign up with GitHub or Google
4. Verify your email if prompted

### Step 2: Create Redis Database

1. After login, click **"Create Database"** (green button)
2. Fill in the details:
   - **Name:** `jntuh-cache` (or any name)
   - **Type:** Select **"Regional"** (free tier)
   - **Region:** Choose closest to your Vercel region
     - If Vercel is in US East → Choose `us-east-1`
     - If Vercel is in Asia → Choose `ap-southeast-1`
   - **TLS:** Keep enabled (recommended)
3. Click **"Create"**

### Step 3: Get Your Redis Credentials

1. After creation, you'll see your database dashboard
2. Scroll down to **"REST API"** section (NOT the regular connection)
3. You'll see two values:
   - **UPSTASH_REDIS_REST_URL:** `https://your-name-12345.upstash.io`
   - **UPSTASH_REDIS_REST_TOKEN:** `AXQgASQgOTk4ZjE4YmEt...` (long string)
4. Click the **copy icon** next to each to copy them
5. **IMPORTANT:** Save both values! You'll need them for `.env.local`

### ✅ Upstash Redis Setup Complete!

**What you have:**
- ✅ Redis database
- ✅ REST URL (UPSTASH_REDIS_REST_URL)
- ✅ REST Token (UPSTASH_REDIS_REST_TOKEN)

---

## Part 3: Vercel Setup (10 minutes)

### Step 1: Push Code to GitHub

First, let's get your code on GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - JNTUH automation system"

# Create a new repository on GitHub
# Go to github.com → Click "+" → "New repository"
# Name it: jntuh-automation
# Don't initialize with README (we already have code)
# Copy the repository URL

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/jntuh-automation.git
git branch -M main
git push -u origin main
```

### Step 2: Create Vercel Account

1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Sign Up"**
3. **IMPORTANT:** Sign up with the **same GitHub account** you used above
4. Authorize Vercel to access your GitHub repositories

### Step 3: Import Your Project

1. After login, you'll see the Vercel dashboard
2. Click **"Add New..."** → **"Project"**
3. You'll see a list of your GitHub repositories
4. Find **"jntuh-automation"** and click **"Import"**

### Step 4: Configure Project Settings

1. **Framework Preset:** Should auto-detect as **"Next.js"**
2. **Root Directory:** Leave as `./` (default)
3. **Build Command:** Leave default (`next build`)
4. **Output Directory:** Leave default (`.next`)
5. **Don't deploy yet!** We need to add environment variables first

### Step 5: Add Environment Variables

1. Scroll down to **"Environment Variables"** section
2. Click to expand it
3. Add each variable one by one:

**Required Variables:**

| Name | Value | Where to get it |
|------|-------|-----------------|
| `DATABASE_URL` | Your Neon connection string | From Neon dashboard (Part 1, Step 3) |
| `CRON_SECRET` | Generate a random string | Run: `node scripts/generate-secrets.js` |
| `API_SECRET_KEY` | Generate a random string | Run: `node scripts/generate-secrets.js` |

**Redis Variables (Optional but recommended):**

| Name | Value | Where to get it |
|------|-------|-----------------|
| `UPSTASH_REDIS_REST_URL` | Your Upstash URL | From Upstash dashboard (Part 2, Step 3) |
| `UPSTASH_REDIS_REST_TOKEN` | Your Upstash token | From Upstash dashboard (Part 2, Step 3) |

**Other Variables (Optional - use defaults):**

| Name | Value |
|------|-------|
| `JNTUH_EXAM_CODE` | `1323` |
| `SCRAPER_WORKER_COUNT` | `10` |
| `HALL_TICKET_START` | `160121733001` |
| `HALL_TICKET_END` | `160121733999` |

**How to add each variable:**
1. Type the **Name** in the left field
2. Paste the **Value** in the right field
3. Select **"Production"** environment
4. Click **"Add"**
5. Repeat for all variables

### Step 6: Deploy!

1. After adding all environment variables, click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. You'll see a success screen with your deployment URL

### Step 7: Enable Cron Jobs

1. Go to your project dashboard on Vercel
2. Click **"Settings"** tab
3. Scroll to **"Cron Jobs"** section
4. Cron jobs should be automatically detected from `vercel.json`
5. Verify the watcher cron is listed and enabled

### ✅ Vercel Setup Complete!

**What you have:**
- ✅ Project deployed on Vercel
- ✅ Environment variables configured
- ✅ Cron jobs enabled
- ✅ Live URL (e.g., `jntuh-automation.vercel.app`)

---

## Part 4: Generate Secrets Locally

Before we test, let's generate secure secrets for your local development:

```bash
# Generate secrets
node scripts/generate-secrets.js
```

Copy the output and add to your `.env.local` file.

---

## Part 5: Configure Local Environment

Create `.env.local` file in your project root:

```bash
# Copy the example
cp .env.example .env.local
```

Edit `.env.local` and add your values:

```env
# Database (from Neon)
DATABASE_URL=postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require

# Redis (from Upstash)
UPSTASH_REDIS_REST_URL=https://your-name-12345.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXQgASQgOTk4ZjE4YmEt...

# Secrets (from generate-secrets.js)
CRON_SECRET=your-generated-secret-here
API_SECRET_KEY=your-generated-api-key-here

# JNTUH Config
JNTUH_EXAM_CODE=1323
JNTUH_RESULTS_BASE_URL=http://results.jntuh.ac.in/results/

# Scraper Config (adjust as needed)
SCRAPER_WORKER_COUNT=3
HALL_TICKET_START=160121733001
HALL_TICKET_END=160121733050
SCRAPER_DELAY_MS=200
```

---

## Part 6: Validate Setup

Run the validation script:

```bash
node scripts/validate-env.js
```

You should see:
```
✅ All environment variables are properly configured!
```

---

## 🎉 Setup Complete!

### What You've Accomplished:

1. ✅ **Neon Postgres** - Database ready
2. ✅ **Upstash Redis** - Cache ready
3. ✅ **Vercel** - Deployed and live
4. ✅ **Environment Variables** - Configured locally and in production
5. ✅ **Cron Jobs** - Enabled for automatic result checking

### Next Steps:

1. **Create database tables** (we'll do this next)
2. **Test the API endpoints**
3. **Monitor the cron job**
4. **Start scraping results**

---

## 📊 Quick Reference

### Your Dashboard URLs

Save these for quick access:

- **Neon Dashboard:** https://console.neon.tech
- **Upstash Dashboard:** https://console.upstash.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Your Live Site:** `https://your-project.vercel.app`

### Important Credentials

Keep these safe (never commit to git):

```
DATABASE_URL=postgresql://...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
CRON_SECRET=...
API_SECRET_KEY=...
```

---

## 🆘 Troubleshooting

### "Database connection failed"
- Check DATABASE_URL is correct
- Verify Neon project is active (not paused)
- Ensure `?sslmode=require` is in the URL

### "Redis connection failed"
- Verify both URL and TOKEN are set
- Check you copied from "REST API" section (not regular connection)
- Redis is optional - system works without it

### "Deployment failed on Vercel"
- Check build logs in Vercel dashboard
- Verify all required env variables are set
- Make sure Next.js project structure is correct

### "Cron jobs not running"
- Verify `vercel.json` exists in project root
- Check cron jobs are enabled in Vercel settings
- Ensure CRON_SECRET matches in both local and Vercel

---

## 🔐 Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] Never committed secrets to GitHub
- [ ] Used strong random strings for secrets
- [ ] Different secrets for dev and production
- [ ] Database has SSL enabled (`sslmode=require`)
- [ ] Redis has TLS enabled

---

## 📞 Support Resources

- **Neon Docs:** https://neon.tech/docs
- **Upstash Docs:** https://docs.upstash.com/redis
- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

**Ready to proceed?** Let's create the database schema next! 🚀
