# Quick Test - Check Current Status
# This will show you the current error to confirm authentication is working

Write-Host "Testing endpoint without authentication..." -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "https://jntuhservervooho.vercel.app/api/cron/watcher" -Method Get
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 401) {
        Write-Host "✅ Endpoint is working correctly!" -ForegroundColor Green
        Write-Host "   It's properly rejecting unauthorized requests." -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 Next steps:" -ForegroundColor Cyan
        Write-Host "   1. Get your CRON_SECRET from Vercel Dashboard" -ForegroundColor White
        Write-Host "   2. Run: .\test-watcher.ps1 -CronSecret 'your-secret'" -ForegroundColor White
    }
    else {
        Write-Host "Error: $statusCode" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
}
