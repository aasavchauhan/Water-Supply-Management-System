# 🚀 Quick Start Guide

Get your Water Supply Management System running in 5 minutes!

## Prerequisites
- Node.js 18+ installed ([Download here](https://nodejs.org/))
- Neon account ([Sign up free](https://console.neon.tech/))

## Setup Steps

### Option 1: Automated Setup (Recommended)

Run the setup script:
```powershell
.\setup.ps1
```

The script will:
- ✅ Check Node.js and npm
- ✅ Install all dependencies
- ✅ Create .env file
- ✅ Generate Prisma client
- ✅ Set up database

### Option 2: Manual Setup

**1. Install dependencies**
```powershell
npm install
```

**2. Create .env file**
Create a file named `.env` in the project root:
```env
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/database?sslmode=require"
```

**3. Get Neon Database URL**
- Go to [console.neon.tech](https://console.neon.tech/)
- Sign in or create account
- Click "Create Project"
- Copy the connection string
- Paste it in your `.env` file

**4. Initialize Database**
```powershell
npx prisma generate
npx prisma db push
```

**5. Start Development Server**
```powershell
npm run dev
```

## 🎉 You're Ready!

Open http://localhost:5173 in your browser.

## First Steps After Setup

1. **Add a Farmer**
   - Click "Farmers" in navigation
   - Click "Add Farmer" button
   - Fill in farmer details
   - Save

2. **Record Water Supply**
   - Click "New Supply" in navigation
   - Select farmer
   - Choose billing method (Meter or Time)
   - Enter readings/times
   - Submit

3. **Record Payment**
   - Go to Dashboard
   - Find farmer in recent activities
   - Click farmer name to view profile
   - Click "Record Payment"

## 📱 Install as Mobile App

### Android (Chrome/Edge)
1. Open app in Chrome
2. Tap menu (⋮)
3. Tap "Install app"
4. Confirm

### iOS (Safari)
1. Open app in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. Tap "Add"

## Common Issues

### Dependencies fail to install
```powershell
rm -r node_modules, package-lock.json; npm install
```

### Database connection fails
- Check DATABASE_URL in .env
- Ensure no extra spaces
- Verify Neon project is active

### Prisma errors
```powershell
npx prisma generate
npx prisma db push
```

## Next Steps

- ✅ Read [README.md](./README.md) for full documentation
- ✅ Check [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md) for detailed setup
- ✅ Review [PROJECT_SPECIFICATION.md](./PROJECT_SPECIFICATION.md) for features

## Need Help?

1. Check troubleshooting in README.md
2. Review Neon documentation
3. Verify all prerequisites are met

---

**Happy farming! 🌾💧**
