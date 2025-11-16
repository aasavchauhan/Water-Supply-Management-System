# Water Supply Management System - Setup Script
# Run this script to set up the complete application

Write-Host "🌊 Water Supply Management System - Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "✓ Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "  Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
Write-Host "✓ Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "  npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ npm is not installed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 1: Installing dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green

Write-Host ""
Write-Host "Step 2: Checking .env file..." -ForegroundColor Cyan
if (-Not (Test-Path ".env")) {
    Write-Host "  ⚠ .env file not found" -ForegroundColor Yellow
    Write-Host "  Creating .env from example..." -ForegroundColor Yellow
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "  ✓ Created .env file" -ForegroundColor Green
    } else {
        # Create .env file
        @"
# Database connection string from Neon
# Get this from: https://console.neon.tech/
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/database?sslmode=require"
"@ | Out-File -FilePath ".env" -Encoding UTF8
        Write-Host "  ✓ Created .env template" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "  ⚠ IMPORTANT: You need to add your Neon database connection string!" -ForegroundColor Yellow
    Write-Host "  1. Go to https://console.neon.tech/" -ForegroundColor White
    Write-Host "  2. Create a new project (or use existing)" -ForegroundColor White
    Write-Host "  3. Copy the connection string" -ForegroundColor White
    Write-Host "  4. Edit .env file and replace the DATABASE_URL value" -ForegroundColor White
    Write-Host ""
    $continue = Read-Host "  Have you set up your DATABASE_URL in .env? (y/n)"
    if ($continue -ne 'y') {
        Write-Host "  Please set up DATABASE_URL in .env and run this script again" -ForegroundColor Yellow
        exit 0
    }
} else {
    Write-Host "  ✓ .env file found" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 3: Generating Prisma client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Prisma client generated" -ForegroundColor Green

Write-Host ""
Write-Host "Step 4: Pushing database schema..." -ForegroundColor Cyan
npx prisma db push
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to push database schema" -ForegroundColor Red
    Write-Host "  Please check your DATABASE_URL in .env file" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Database schema created" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: npm run dev" -ForegroundColor White
Write-Host "  2. Open: http://localhost:5173" -ForegroundColor White
Write-Host "  3. Start managing your water supply!" -ForegroundColor White
Write-Host ""
Write-Host "📱 To install as mobile app:" -ForegroundColor Cyan
Write-Host "  • On Android: Chrome menu > Install app" -ForegroundColor White
Write-Host "  • On iOS: Safari > Share > Add to Home Screen" -ForegroundColor White
Write-Host ""
Write-Host "📚 For more info, check:" -ForegroundColor Cyan
Write-Host "  • README.md - Complete documentation" -ForegroundColor White
Write-Host "  • INSTALLATION_GUIDE.md - Detailed setup guide" -ForegroundColor White
Write-Host ""
