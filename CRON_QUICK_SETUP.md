# Quick Setup Guide for External Cron Jobs

## ✅ Your endpoint now supports 3 authentication methods!

### Method 1: Authorization Header (Recommended)
**Best for:** cron-job.org, EasyCron, GitHub Actions

**URL:**
```
https://jntuhservervooho.vercel.app/api/cron/watcher
```

**Header:**
```
Authorization: Bearer YOUR_CRON_SECRET
```

---

### Method 2: Query Parameter (Simple)
**Best for:** Services that don't support custom headers (Uptime Robot, etc.)

**URL:**
```
https://jntuhservervooho.vercel.app/api/cron/watcher?secret=YOUR_CRON_SECRET
```

**No headers needed!**

---

### Method 3: Vercel Cron Header (Automatic)
**Best for:** Vercel's built-in cron jobs

**Configured in vercel.json** - No manual setup needed

---

## 🚀 Quick Setup Steps

### 1. Set CRON_SECRET in Vercel
1. Go to: https://vercel.com/dashboard
2. Select: `jntuhservervooho`
3. Go to: Settings → Environment Variables
4. Add:
   - Name: `CRON_SECRET`
   - Value: `your-secure-secret-key`
   - Environments: All (Production, Preview, Development)
5. **Redeploy** your app

### 2. Configure Your Cron Service

#### For cron-job.org:
```
URL: https://jntuhservervooho.vercel.app/api/cron/watcher
Method: GET
Header: Authorization: Bearer YOUR_CRON_SECRET
Schedule: * * * * * (every minute)
```

#### For Uptime Robot or similar:
```
URL: https://jntuhservervooho.vercel.app/api/cron/watcher?secret=YOUR_CRON_SECRET
Method: GET
Interval: 1 minute
```

#### For EasyCron:
```
URL: https://jntuhservervooho.vercel.app/api/cron/watcher
HTTP Method: GET
Custom Headers: Authorization: Bearer YOUR_CRON_SECRET
Cron Expression: * * * * *
```

### 3. Test It

**Test with query parameter (easiest):**
```
https://jntuhservervooho.vercel.app/api/cron/watcher?secret=YOUR_CRON_SECRET
```

Just paste this URL in your browser (replace YOUR_CRON_SECRET with your actual secret)

**Expected response:**
```json
{
  "status": "ok",
  "latest_result": "...",
  "timestamp": "2025-12-09T..."
}
```

---

## 🔧 Troubleshooting

### Still getting "Unauthorized"?
- [ ] Check CRON_SECRET is set in Vercel
- [ ] Verify you've redeployed after adding the secret
- [ ] Make sure the secret matches exactly (no extra spaces)
- [ ] Try the query parameter method first (easier to test)

### How to verify it's working?
1. Check Vercel Logs: Dashboard → Your Project → Logs
2. Look for: `🔍 Checked JNTUH. Latest: ...`
3. Check your cron service's execution history

---

## 📝 Which method should I use?

| Cron Service | Recommended Method | Example |
|--------------|-------------------|---------|
| cron-job.org | Header | `Authorization: Bearer SECRET` |
| EasyCron | Header | `Authorization: Bearer SECRET` |
| Uptime Robot | Query Param | `?secret=SECRET` |
| GitHub Actions | Header | `Authorization: Bearer SECRET` |
| Vercel Cron | Auto | Already configured in vercel.json |
| Other/Unknown | Query Param | `?secret=SECRET` (simplest) |

---

## 🎯 Next Steps

1. ✅ Set CRON_SECRET in Vercel (if not already done)
2. ✅ Redeploy your application
3. ✅ Test with: `https://jntuhservervooho.vercel.app/api/cron/watcher?secret=YOUR_SECRET`
4. ✅ Configure your cron service
5. ✅ Monitor logs to confirm it's working

**Need help?** Let me know which cron service you're using!
