# 🚀 Vercel Deployment Guide - Step by Step

This guide will walk you through deploying your JNTUH automation system to Vercel.

## 📋 Prerequisites

Before deploying to Vercel, make sure you have:
- [x] App running locally (http://localhost:3000)
- [x] Neon Postgres database created
- [x] Upstash Redis database created
- [x] GitHub account
- [ ] Code pushed to GitHub
- [ ] Vercel account

---

## Part 1: Push Code to GitHub (10 minutes)

### Step 1: Initialize Git (if not done)

```bash
# Check if git is initialized
git status

# If not initialized, run:
git init
```

### Step 2: Create .gitignore (Already Done ✓)

Your `.gitignore` is already configured to exclude:
- `.env.local` (your secrets)
- `node_modules/`
- `.next/`
- Other sensitive files

### Step 3: Commit Your Code

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit - JNTUH R22 automation system"
```

### Step 4: Create GitHub Repository

1. Go to **https://github.com**
2. Click **"+"** (top right) → **"New repository"**
3. Fill in:
   - **Repository name:** `jntuh-automation`
   - **Description:** "Automated JNTUH R22 results fetching system"
   - **Visibility:** Private (recommended) or Public
   - **DO NOT** check "Initialize with README" (you already have code)
4. Click **"Create repository"**

### Step 5: Push to GitHub

Copy the commands from GitHub (they'll look like this):

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/jntuh-automation.git

# Push code
git branch -M main
git push -u origin main
```

**✅ Part 1 Complete!** Your code is now on GitHub.

---

## Part 2: Create Vercel Account (5 minutes)

### Step 1: Sign Up

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. **IMPORTANT:** Choose **"Continue with GitHub"**
   - This connects Vercel to your GitHub account
   - Makes deployment much easier
4. Authorize Vercel to access your GitHub repositories

### Step 2: Complete Setup

1. Choose a team name (or use default)
2. Skip any optional steps
3. You'll land on the Vercel dashboard

**✅ Part 2 Complete!** Vercel account ready.

---

## Part 3: Import Your Project (15 minutes)

### Step 1: Import Repository

1. On Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **"jntuh-automation"**
4. Click **"Import"**

### Step 2: Configure Project

**Framework Preset:**
- Should auto-detect as **"Next.js"** ✓
- If not, select "Next.js" from dropdown

**Root Directory:**
- Leave as `./` (default)

**Build Settings:**
- Build Command: `next build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

**Don't click Deploy yet!** We need to add environment variables first.

---

## Part 4: Add Environment Variables (10 minutes)

This is the **most important step**!

### Step 1: Scroll to Environment Variables

On the import page, scroll down to **"Environment Variables"** section.

### Step 2: Add Each Variable

Click to expand the section, then add these variables **one by one**:

#### Required Variables (Must Add)

| Name | Value | Where to Get It |
|------|-------|-----------------|
| `DATABASE_URL` | Your Neon connection string | Neon Dashboard → Connection Details |
| `CRON_SECRET` | `g691/PktO5cQpD2upVwUg5hXLXuCuPPBHMsT6wsXBKwM=` | From SETUP_YOUR_ENV.txt |
| `API_SECRET_KEY` | `I67dCfHIPfLyhw7r4XlOegRLcHaOTFFBgQIpTKgHKftg=` | From SETUP_YOUR_ENV.txt |

#### Redis Variables (Recommended)

| Name | Value | Where to Get It |
|------|-------|-----------------|
| `UPSTASH_REDIS_REST_URL` | Your Upstash URL | Upstash Dashboard → REST API |
| `UPSTASH_REDIS_REST_TOKEN` | Your Upstash token | Upstash Dashboard → REST API |

#### R22 Configuration (Optional - uses defaults if not set)

| Name | Value |
|------|-------|
| `JNTUH_EXAM_CODE` | `1323` |
| `JNTUH_RESULTS_BASE_URL` | `http://results.jntuh.ac.in/results/` |
| `JNTUH_RESULT_TYPE` | `grade` |
| `SCRAPER_WORKER_COUNT` | `20` |
| `HALL_TICKET_START` | `220100000001` |
| `HALL_TICKET_END` | `220999999999` |
| `SCRAPER_DELAY_MS` | `50` |
| `SCRAPER_TIMEOUT_MS` | `10000` |
| `SCRAPER_MAX_RETRIES` | `3` |
| `ENABLE_REDIS_CACHE` | `true` |
| `CACHE_TTL_SECONDS` | `604800` |

### Step 3: How to Add Each Variable

For each variable:

1. **Type the Name** in the left field (e.g., `DATABASE_URL`)
2. **Paste the Value** in the right field
3. **Select Environment:** 
   - Check **"Production"** ✓
   - Check **"Preview"** ✓ (optional)
   - Check **"Development"** ✓ (optional)
4. Click **"Add"** button
5. Repeat for all variables

### Step 4: Verify All Variables Added

Make sure you see all these in the list:
- ✅ DATABASE_URL
- ✅ CRON_SECRET
- ✅ API_SECRET_KEY
- ✅ UPSTASH_REDIS_REST_URL
- ✅ UPSTASH_REDIS_REST_TOKEN
- ✅ (Optional) Other configuration variables

---

## Part 5: Deploy! (5 minutes)

### Step 1: Click Deploy

After adding all environment variables:

1. Click the **"Deploy"** button
2. Wait 2-3 minutes for the build to complete
3. Watch the build logs (optional but interesting!)

### Step 2: Build Process

You'll see:
```
Building...
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
✓ Build completed
```

### Step 3: Success!

When deployment succeeds, you'll see:
- 🎉 **Congratulations** screen
- Your deployment URL (e.g., `jntuh-automation.vercel.app`)
- Screenshot preview of your site

### Step 4: Visit Your Site

Click **"Visit"** or go to your deployment URL.

You should see your JNTUH Automation homepage live!

**✅ Part 5 Complete!** Your app is deployed!

---

## Part 6: Configure Cron Jobs (5 minutes)

To enable automatic result checking every minute:

### Step 1: Create vercel.json

In your project root, create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/watcher",
      "schedule": "* * * * *"
    }
  ]
}
```

### Step 2: Commit and Push

```bash
git add vercel.json
git commit -m "Add cron job configuration"
git push origin main
```

### Step 3: Verify Cron Jobs

1. Go to Vercel dashboard
2. Click your project
3. Go to **"Settings"** → **"Cron Jobs"**
4. You should see your cron job listed
5. Verify it's **enabled** ✓

**✅ Part 6 Complete!** Cron jobs configured.

---

## Part 7: Test Your Deployment (5 minutes)

### Test 1: Homepage

Visit: `https://your-project.vercel.app`

Should show your JNTUH Automation homepage.

### Test 2: Health Check

Visit: `https://your-project.vercel.app/api/health`

Should return JSON with status information.

### Test 3: Environment Variables

Check that the health endpoint shows:
```json
{
  "status": "ok",
  "database": {
    "configured": true
  },
  "redis": {
    "configured": true,
    "enabled": true
  }
}
```

---

## 🎯 Post-Deployment Checklist

After deployment, verify:

- [ ] Site is accessible at your Vercel URL
- [ ] Homepage loads correctly
- [ ] `/api/health` returns success
- [ ] Database connection works
- [ ] Redis connection works
- [ ] Environment variables are set
- [ ] Cron jobs are enabled
- [ ] No build errors in logs

---

## 🔧 Managing Your Deployment

### View Deployment Logs

1. Go to Vercel dashboard
2. Click your project
3. Click **"Deployments"** tab
4. Click any deployment to see logs

### Update Environment Variables

1. Go to **"Settings"** → **"Environment Variables"**
2. Find the variable to update
3. Click **"Edit"**
4. Update value
5. Click **"Save"**
6. **Redeploy** for changes to take effect

### Redeploy

After changing environment variables:

1. Go to **"Deployments"** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**

Or push a new commit:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

---

## 🌐 Custom Domain (Optional)

### Add Your Own Domain

1. Go to **"Settings"** → **"Domains"**
2. Click **"Add"**
3. Enter your domain (e.g., `results.yourdomain.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

---

## 📊 Monitoring Your App

### View Analytics

1. Go to **"Analytics"** tab
2. See:
   - Page views
   - API requests
   - Response times
   - Error rates

### View Function Logs

1. Go to **"Logs"** tab
2. Filter by:
   - Time range
   - Function name
   - Status code
3. Debug issues in real-time

---

## 🆘 Troubleshooting

### "Build Failed"

**Check:**
1. Build logs in Vercel dashboard
2. Make sure all dependencies are in `package.json`
3. Verify `next.config.js` is correct

**Solution:**
```bash
# Test build locally first
npm run build
```

### "Environment Variable Not Found"

**Check:**
1. Variable is added in Vercel dashboard
2. Variable name matches exactly (case-sensitive)
3. Selected "Production" environment

**Solution:**
1. Go to Settings → Environment Variables
2. Add missing variable
3. Redeploy

### "Database Connection Failed"

**Check:**
1. `DATABASE_URL` is correct
2. Neon database is active (not paused)
3. Connection string includes `?sslmode=require`

**Solution:**
1. Test connection in Neon dashboard
2. Copy fresh connection string
3. Update in Vercel
4. Redeploy

### "Cron Jobs Not Running"

**Check:**
1. `vercel.json` exists in project root
2. File is committed to GitHub
3. Cron jobs enabled in Settings

**Solution:**
1. Verify `vercel.json` syntax
2. Push to GitHub
3. Check Settings → Cron Jobs

---

## 🎉 Deployment Complete!

### What You Now Have

- ✅ **Live Website:** `https://your-project.vercel.app`
- ✅ **Automatic Deployments:** Push to GitHub = auto-deploy
- ✅ **Cron Jobs:** Checking for results every minute
- ✅ **Serverless Functions:** Fast, scalable APIs
- ✅ **Global CDN:** Fast worldwide access
- ✅ **SSL Certificate:** Automatic HTTPS
- ✅ **Analytics:** Built-in monitoring

### Your URLs

Save these:

```
Production Site:    https://your-project.vercel.app
Vercel Dashboard:   https://vercel.com/dashboard
GitHub Repo:        https://github.com/YOUR_USERNAME/jntuh-automation
Neon Dashboard:     https://console.neon.tech
Upstash Dashboard:  https://console.upstash.com
```

---

## 🚀 Next Steps

1. **Test the scraper** with a small range
2. **Monitor cron jobs** in Vercel logs
3. **Check database** for scraped results
4. **Scale up** to full R22 range when ready
5. **Share your URL** with users!

---

## 💡 Pro Tips

1. **Use Preview Deployments:** Every branch gets its own URL
2. **Enable Vercel Analytics:** Free insights into usage
3. **Set up Alerts:** Get notified of deployment failures
4. **Use Environment Groups:** Manage variables across projects
5. **Check Function Logs:** Debug issues in production

---

**Congratulations! Your JNTUH automation system is now live on Vercel! 🎉**

Need help with any step? Check the detailed guides in the `docs/` folder!
