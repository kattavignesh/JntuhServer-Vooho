# Setting Up External Cron Job for Watcher Endpoint

## Overview
Since you're using an external cron job service (not Vercel Cron), you need to configure it to send the proper authentication header.

## Step 1: Get Your CRON_SECRET

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Select your project: `jntuhservervooho`
3. Go to: **Settings** → **Environment Variables**
4. Find or create `CRON_SECRET`
   - If it doesn't exist, create it with a secure random value
   - Example: `jntuh-watcher-2024-secure-key`
5. **Important:** Redeploy after adding/changing the secret

## Step 2: Configure Your Cron Job Service

### For cron-job.org:

1. **URL:**
   ```
   https://jntuhservervooho.vercel.app/api/cron/watcher
   ```

2. **Method:** `GET`

3. **Headers:** Add a custom header
   - **Header Name:** `Authorization`
   - **Header Value:** `Bearer YOUR_CRON_SECRET_HERE`
   
   Replace `YOUR_CRON_SECRET_HERE` with the actual value from Vercel

4. **Schedule:** Set your desired frequency (e.g., every minute: `* * * * *`)

### For EasyCron:

1. **URL:**
   ```
   https://jntuhservervooho.vercel.app/api/cron/watcher
   ```

2. **HTTP Method:** `GET`

3. **Custom Headers:**
   ```
   Authorization: Bearer YOUR_CRON_SECRET_HERE
   ```

4. **Cron Expression:** `* * * * *` (every minute)

### For Uptime Robot or Similar:

If your service doesn't support custom headers, you have two options:

#### Option A: Use Query Parameter Authentication (Recommended)
I can modify the endpoint to also accept the secret as a query parameter:
```
https://jntuhservervooho.vercel.app/api/cron/watcher?secret=YOUR_CRON_SECRET
```

#### Option B: Use a Different Service
Use a service that supports custom HTTP headers like:
- cron-job.org (Free, supports headers)
- EasyCron (Free tier available)
- GitHub Actions (Free for public repos)

## Step 3: Test Your Configuration

### Manual Test with curl (if available):
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://jntuhservervooho.vercel.app/api/cron/watcher
```

### Manual Test with PowerShell:
```powershell
$headers = @{ "Authorization" = "Bearer YOUR_CRON_SECRET" }
Invoke-RestMethod -Uri "https://jntuhservervooho.vercel.app/api/cron/watcher" -Headers $headers
```

### Expected Success Response:
```json
{
  "status": "ok",
  "latest_result": "...",
  "timestamp": "2025-12-09T..."
}
```

### Expected Error Response (if secret is wrong):
```json
{
  "error": "Unauthorized"
}
```

## Step 4: Monitor Your Cron Job

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Your Project → Logs
   - Look for messages like: `🔍 Checked JNTUH. Latest: ...`

2. **Check Cron Service Logs:**
   - Most cron services show execution history
   - Verify the requests are returning 200 OK

## Common Issues & Solutions

### Issue: Still getting "Unauthorized"

**Possible Causes:**
1. ❌ CRON_SECRET not set in Vercel
2. ❌ Wrong secret value in cron job configuration
3. ❌ Typo in the Authorization header format
4. ❌ Haven't redeployed after adding CRON_SECRET

**Solutions:**
1. ✅ Verify CRON_SECRET exists in Vercel environment variables
2. ✅ Copy-paste the secret (don't type it manually)
3. ✅ Ensure format is exactly: `Bearer YOUR_SECRET` (with space after "Bearer")
4. ✅ Redeploy the application

### Issue: Cron service doesn't support custom headers

**Solution:** Let me know which service you're using, and I can:
1. Add query parameter authentication support
2. Suggest an alternative service that supports headers

## Which Cron Service Are You Using?

Please let me know which service you're using:
- [ ] cron-job.org
- [ ] EasyCron
- [ ] Uptime Robot
- [ ] GitHub Actions
- [ ] Other: ___________

This will help me provide specific configuration instructions!
