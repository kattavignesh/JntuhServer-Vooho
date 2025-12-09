# Fixing the Watcher Endpoint Unauthorized Error

## Problem
The `/api/cron/watcher` endpoint returns `{"error":"Unauthorized"}` because it requires authentication.

## Root Cause
The endpoint checks for authentication via:
1. **Bearer Token** in the `Authorization` header
2. **Vercel Cron Secret** in the `x-vercel-cron-secret` header

Without either of these, the request is rejected.

## Solutions

### ✅ Solution 1: Set Up Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Navigate to: https://vercel.com/dashboard
   - Select your project: `jntuhservervooho`

2. **Add Environment Variables**
   - Go to: Settings → Environment Variables
   - Add the following variables:

   | Variable Name | Value | Environment |
   |--------------|-------|-------------|
   | `CRON_SECRET` | `your-secret-key-here` | Production, Preview, Development |
   | `API_SECRET_KEY` | `your-api-secret-here` | Production, Preview, Development |
   | `DATABASE_URL` | `your-neon-db-url` | Production, Preview, Development |

3. **Redeploy**
   - After adding environment variables, redeploy your application
   - You can trigger a redeploy by pushing a new commit or using the Vercel dashboard

### ✅ Solution 2: Test the Endpoint Manually

Once the `CRON_SECRET` is set in Vercel, you can test the endpoint:

#### Using cURL:
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://jntuhservervooho.vercel.app/api/cron/watcher
```

#### Using PowerShell:
```powershell
$headers = @{ "Authorization" = "Bearer YOUR_CRON_SECRET" }
Invoke-RestMethod -Uri "https://jntuhservervooho.vercel.app/api/cron/watcher" -Headers $headers
```

### ✅ Solution 3: Automatic Cron Execution (Recommended)

The `vercel.json` file has been updated to include a cron configuration:

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

**What this does:**
- Vercel will automatically call `/api/cron/watcher` every minute
- Vercel adds the `x-vercel-cron-secret` header automatically
- No manual authentication needed for cron-triggered requests

**To enable:**
1. Commit and push the updated `vercel.json`
2. Vercel will automatically detect and configure the cron job
3. Check cron logs in Vercel Dashboard → Your Project → Cron

## Next Steps

1. **Set Environment Variables** in Vercel (most important!)
2. **Push the changes** to trigger a new deployment
3. **Verify the cron job** is running in Vercel Dashboard
4. **Check logs** to see if the watcher is working

## Checking if it Works

After deployment, you can:

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Your Project → Logs
   - Look for messages like: `🔍 Checked JNTUH. Latest: ...`

2. **Test Manually:**
   ```bash
   curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://jntuhservervooho.vercel.app/api/cron/watcher
   ```

3. **Expected Response:**
   ```json
   {
     "status": "ok",
     "latest_result": "...",
     "timestamp": "2025-12-09T..."
   }
   ```

## Important Notes

- The `CRON_SECRET` must match between your environment variables and the request
- Vercel Cron jobs are only available on Pro plans (check your plan)
- For testing, you can use the Bearer token method
- The cron schedule `* * * * *` means "every minute"

## Troubleshooting

If you still get "Unauthorized":
1. Verify `CRON_SECRET` is set in Vercel environment variables
2. Make sure you've redeployed after adding the variable
3. Check that the secret matches exactly (no extra spaces)
4. Try accessing with the Bearer token manually to test
