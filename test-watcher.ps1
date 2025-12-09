# Test Watcher Endpoint Script
# Replace YOUR_ACTUAL_SECRET with the CRON_SECRET from Vercel

param(
    [Parameter(Mandatory=$false)]
    [string]$CronSecret = "YOUR_ACTUAL_SECRET"
)

Write-Host "Testing Watcher Endpoint..." -ForegroundColor Cyan
Write-Host "Using CRON_SECRET: $CronSecret" -ForegroundColor Yellow
Write-Host ""

try {
    $headers = @{
        "Authorization" = "Bearer $CronSecret"
    }
    
    $response = Invoke-RestMethod -Uri "https://jntuhservervooho.vercel.app/api/cron/watcher" -Headers $headers -Method Get
    
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 401) {
        Write-Host "❌ Unauthorized (401)" -ForegroundColor Red
        Write-Host ""
        Write-Host "This means:" -ForegroundColor Yellow
        Write-Host "  1. The CRON_SECRET you provided is incorrect, OR" -ForegroundColor Yellow
        Write-Host "  2. The CRON_SECRET is not set in Vercel environment variables" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To fix:" -ForegroundColor Cyan
        Write-Host "  1. Go to Vercel Dashboard → Settings → Environment Variables" -ForegroundColor White
        Write-Host "  2. Check or add CRON_SECRET" -ForegroundColor White
        Write-Host "  3. Redeploy your application" -ForegroundColor White
        Write-Host "  4. Run this script again with: .\test-watcher.ps1 -CronSecret 'your-actual-secret'" -ForegroundColor White
    } else {
        Write-Host "❌ Error: $statusCode" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Usage:" -ForegroundColor Cyan
Write-Host "  .\test-watcher.ps1 -CronSecret 'your-actual-secret-here'" -ForegroundColor White
