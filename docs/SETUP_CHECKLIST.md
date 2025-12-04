# 🚀 Quick Setup Checklist

Use this checklist to track your setup progress. Check off each item as you complete it.

## ☑️ Part 1: Neon Postgres (5 min)

- [ ] Go to [neon.tech](https://neon.tech)
- [ ] Sign up with GitHub/Google
- [ ] Create new project named `jntuh-automation`
- [ ] Choose region closest to you
- [ ] Copy **Pooled connection string**
- [ ] Save to password manager/notes
- [ ] Paste into `.env.local` as `DATABASE_URL`

**✓ You should have:** A connection string starting with `postgresql://`

---

## ☑️ Part 2: Upstash Redis (5 min)

- [ ] Go to [upstash.com](https://upstash.com)
- [ ] Sign up with GitHub/Google
- [ ] Create database named `jntuh-cache`
- [ ] Select **Regional** type
- [ ] Choose region matching Vercel
- [ ] Scroll to **REST API** section
- [ ] Copy `UPSTASH_REDIS_REST_URL`
- [ ] Copy `UPSTASH_REDIS_REST_TOKEN`
- [ ] Save both to password manager/notes
- [ ] Paste into `.env.local`

**✓ You should have:** Two values - a URL and a long token

---

## ☑️ Part 3: Generate Secrets (2 min)

- [ ] Open terminal in project folder
- [ ] Run: `node scripts/generate-secrets.js`
- [ ] Copy the `CRON_SECRET` value
- [ ] Copy the `API_SECRET_KEY` value
- [ ] Paste both into `.env.local`

**✓ You should have:** Two random base64 strings

---

## ☑️ Part 4: Local Environment (3 min)

- [ ] Copy `.env.example` to `.env.local`
- [ ] Add `DATABASE_URL` from Neon
- [ ] Add `UPSTASH_REDIS_REST_URL` from Upstash
- [ ] Add `UPSTASH_REDIS_REST_TOKEN` from Upstash
- [ ] Add `CRON_SECRET` from generate-secrets
- [ ] Add `API_SECRET_KEY` from generate-secrets
- [ ] Adjust `HALL_TICKET_START` and `HALL_TICKET_END` if needed
- [ ] Save the file

**✓ You should have:** A complete `.env.local` file

---

## ☑️ Part 5: Validate Setup (1 min)

- [ ] Run: `node scripts/validate-env.js`
- [ ] Check for ✅ success message
- [ ] Fix any ❌ errors shown

**✓ You should see:** "All environment variables are properly configured!"

---

## ☑️ Part 6: GitHub Setup (5 min)

- [ ] Go to [github.com](https://github.com)
- [ ] Click "+" → "New repository"
- [ ] Name it `jntuh-automation`
- [ ] Keep it **Private** (recommended)
- [ ] Don't initialize with README
- [ ] Click "Create repository"
- [ ] Copy the repository URL

**In your terminal:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git branch -M main
git push -u origin main
```

- [ ] Verify code is on GitHub

**✓ You should have:** Code pushed to GitHub

---

## ☑️ Part 7: Vercel Deployment (10 min)

- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign up with **same GitHub account**
- [ ] Click "Add New..." → "Project"
- [ ] Import `jntuh-automation` repository
- [ ] Verify Framework = "Next.js"

### Add Environment Variables:

- [ ] Add `DATABASE_URL` (from Neon)
- [ ] Add `UPSTASH_REDIS_REST_URL` (from Upstash)
- [ ] Add `UPSTASH_REDIS_REST_TOKEN` (from Upstash)
- [ ] Add `CRON_SECRET` (from generate-secrets)
- [ ] Add `API_SECRET_KEY` (from generate-secrets)
- [ ] Add `JNTUH_EXAM_CODE` = `1323`
- [ ] Add `SCRAPER_WORKER_COUNT` = `10`
- [ ] Add `HALL_TICKET_START` = `160121733001`
- [ ] Add `HALL_TICKET_END` = `160121733999`

- [ ] Click "Deploy"
- [ ] Wait for build to complete (2-3 min)
- [ ] Copy your deployment URL

**✓ You should have:** Live site at `https://your-project.vercel.app`

---

## ☑️ Part 8: Verify Deployment (2 min)

- [ ] Go to Vercel project → Settings → Cron Jobs
- [ ] Verify cron job is listed
- [ ] Check it's enabled
- [ ] Visit your deployment URL
- [ ] Check for any errors in Vercel logs

**✓ You should see:** Cron job active, site deployed

---

## 🎉 Setup Complete!

### Final Checklist:

- [ ] ✅ Neon Postgres database created
- [ ] ✅ Upstash Redis database created
- [ ] ✅ Secrets generated
- [ ] ✅ `.env.local` configured
- [ ] ✅ Environment validated
- [ ] ✅ Code pushed to GitHub
- [ ] ✅ Deployed on Vercel
- [ ] ✅ Cron jobs enabled

---

## 📝 Save These URLs

Write down these URLs for future reference:

```
Neon Dashboard:    https://console.neon.tech
Upstash Dashboard: https://console.upstash.com
Vercel Dashboard:  https://vercel.com/dashboard
GitHub Repo:       https://github.com/YOUR_USERNAME/jntuh-automation
Live Site:         https://your-project.vercel.app
```

---

## 🔑 Your Credentials Summary

Make sure you have all these saved securely:

```env
DATABASE_URL=postgresql://...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
CRON_SECRET=...
API_SECRET_KEY=...
```

**⚠️ NEVER commit these to GitHub!**

---

## ➡️ Next Steps

Now that setup is complete, you can:

1. **Create database tables** - Run migration scripts
2. **Test API endpoints** - Check if everything works
3. **Configure scraper** - Set correct hall ticket ranges
4. **Monitor cron jobs** - Watch for result releases
5. **Start scraping** - Fetch actual results

---

## 🆘 Need Help?

If you're stuck on any step:

1. Check the detailed guide: `docs/DEPLOYMENT_GUIDE.md`
2. Check environment setup: `docs/ENVIRONMENT_SETUP.md`
3. Run validation: `node scripts/validate-env.js`
4. Check Vercel deployment logs
5. Verify all credentials are correct

---

**Estimated Total Time:** 30-35 minutes

**Difficulty:** Beginner-friendly ⭐⭐☆☆☆

**Cost:** $0 (all free tiers)
