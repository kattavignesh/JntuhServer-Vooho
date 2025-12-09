# Testing the Watcher Endpoint

## Option 1: Using cURL

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET_HERE" https://jntuhservervooho.vercel.app/api/cron/watcher
```

## Option 2: Using PowerShell

```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_CRON_SECRET_HERE"
}
Invoke-RestMethod -Uri "https://jntuhservervooho.vercel.app/api/cron/watcher" -Headers $headers
```

## Option 3: Using Postman or Thunder Client

1. Set the URL to: `https://jntuhservervooho.vercel.app/api/cron/watcher`
2. Set Method to: `GET`
3. Add Header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_CRON_SECRET_HERE`

## Important Notes

- Replace `YOUR_CRON_SECRET_HERE` with the actual value of your `CRON_SECRET` environment variable
- The `CRON_SECRET` must be set in your Vercel project's environment variables
- You can find/set it in: Vercel Dashboard → Your Project → Settings → Environment Variables
