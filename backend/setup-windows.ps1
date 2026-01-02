# Windows setup script for backend
# Run: .\setup-windows.ps1

Write-Host "e-med Backend Setup (Windows)" -ForegroundColor Cyan
Write-Host "==============================`n" -ForegroundColor Cyan

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "`nChecking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm $npmVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Create .env file if it doesn't exist
Write-Host "`nChecking .env file..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✓ Created .env file from .env.example" -ForegroundColor Green
        Write-Host "⚠ Please edit .env file and set your configuration!" -ForegroundColor Yellow
    } else {
        Write-Host "✗ .env.example not found" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

# Generate secrets
Write-Host "`nGenerating JWT secrets..." -ForegroundColor Yellow
$jwtSecret = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
$jwtRefreshSecret = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))

Write-Host "`nGenerated secrets (copy to .env file):" -ForegroundColor Cyan
Write-Host "JWT_SECRET=$jwtSecret" -ForegroundColor White
Write-Host "JWT_REFRESH_SECRET=$jwtRefreshSecret" -ForegroundColor White

Write-Host "`n✓ Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file with your database credentials" -ForegroundColor White
Write-Host "2. Set JWT_SECRET and JWT_REFRESH_SECRET (use values above)" -ForegroundColor White
Write-Host "3. Run database migrations" -ForegroundColor White
Write-Host "4. Start server: npm run dev" -ForegroundColor White


