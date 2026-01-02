# PowerShell script to generate JWT secrets
# Run: .\generate-secrets.ps1

Write-Host "Generating JWT secrets..." -ForegroundColor Green

$jwtSecret = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
$jwtRefreshSecret = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))

Write-Host "`nJWT_SECRET:" -ForegroundColor Yellow
Write-Host $jwtSecret -ForegroundColor White

Write-Host "`nJWT_REFRESH_SECRET:" -ForegroundColor Yellow
Write-Host $jwtRefreshSecret -ForegroundColor White

Write-Host "`nCopy these values to your .env file!" -ForegroundColor Green


