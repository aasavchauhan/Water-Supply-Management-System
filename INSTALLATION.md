# Installation Guide

## Water Supply Management System - Complete Setup Instructions

### 📋 System Requirements

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Web Browser**: Chrome, Firefox, Safari, or Edge (latest version)
- **Operating System**: Windows, macOS, or Linux

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Node.js

If you don't have Node.js installed:

1. Visit https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the prompts
4. Verify installation by opening a terminal and running:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Navigate to Project Directory

Open a terminal (Command Prompt, PowerShell, or Terminal) and navigate to the project folder:

```bash
cd "c:\Users\AASAV CHAUHAN\Desktop\House\Water Supply Management System\Water-Supply-Management-System"
```

### Step 3: Install Dependencies

Run the following command to install all required packages:

```bash
npm install
```

This will take 2-3 minutes and install:
- React 18.3.1
- Vite 6.3.5
- Tailwind CSS 4.1.3
- Radix UI components
- Lucide icons
- React Router
- And all other dependencies

### Step 4: Start the Application

Run the development server:

```bash
npm run dev
```

You should see output like:
```
  VITE v6.3.5  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 5: Open in Browser

Open your web browser and navigate to:

```
http://localhost:3000
```

🎉 **That's it!** The application is now running and ready to use!

---

## 💾 Data Storage

### LocalStorage (Default - No Setup Required)

The application uses your browser's LocalStorage by default:

- ✅ **Pros**: 
  - No database setup needed
  - Works immediately
  - Fast and responsive
  - Perfect for testing and small-scale use
  
- ⚠️ **Limitations**: 
  - Data is stored per browser (not synced across devices)
  - Clearing browser data will delete all records
  - Limited to ~5-10MB storage

**Recommendation**: Export reports regularly as CSV backups!

### Neon DB (Optional - For Production)

To use a PostgreSQL database instead:

1. **Create Neon Account**:
   - Go to https://neon.tech
   - Sign up for a free account
   - Create a new project

2. **Get Connection String**:
   - In your Neon dashboard, copy the connection string
   - It looks like: `postgresql://user:password@host.neon.tech/database?sslmode=require`

3. **Update Environment**:
   - Open the `.env` file in the project root
   - Update the `DATABASE_URL`:
     ```
     DATABASE_URL=postgresql://your-connection-string-here
     ```

4. **Run Database Schema**:
   - Open Neon SQL Editor in your dashboard
   - Copy the entire contents of `database-schema.sql`
   - Paste and execute in the SQL Editor
   - Verify tables are created (farmers, supply_entries, payments, etc.)

5. **Restart the App**:
   ```bash
   npm run dev
   ```

---

## 🏗️ Build for Production

### Create Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

Opens the production build at http://localhost:4173

### Deploy to Hosting

The `dist/` folder can be deployed to:

- **Vercel**: `npm i -g vercel && vercel`
- **Netlify**: Drag and drop `dist/` folder to netlify.com
- **GitHub Pages**: Push `dist/` folder to gh-pages branch
- **Any static host**: Upload `dist/` folder contents

---

## 🔧 Troubleshooting

### Issue: "npm: command not found"

**Solution**: Install Node.js from https://nodejs.org/

### Issue: Port 3000 is already in use

**Solution**: 
```bash
# Stop other apps using port 3000, or change the port
npm run dev -- --port 3001
```

### Issue: Dependencies installation fails

**Solution**: 
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors in IDE

**Solution**: 
- Restart VS Code
- Run: `npm install`
- Ensure TypeScript extension is installed

### Issue: Data not persisting

**Solution**: 
- Check browser console for errors
- Ensure cookies/LocalStorage are enabled
- Try a different browser
- Consider setting up Neon DB

### Issue: Build fails

**Solution**: 
```bash
# Check Node version (must be 18+)
node --version

# Update dependencies
npm update

# Try build again
npm run build
```

---

## 📱 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Full Support |
| Firefox | 88+     | ✅ Full Support |
| Safari  | 14+     | ✅ Full Support |
| Edge    | 90+     | ✅ Full Support |
| Mobile Safari | 14+ | ✅ Full Support |
| Mobile Chrome | 90+ | ✅ Full Support |

---

## 🎯 First Steps After Installation

1. **Configure Settings**:
   - Go to Settings page
   - Update business name, contact info
   - Set default rate (₹/hour)

2. **Add Your First Farmer**:
   - Go to Farmer Management
   - Click "+ Add Farmer"
   - Fill in details and save

3. **Record a Supply**:
   - Go to "New Supply Entry"
   - Select farmer
   - Choose billing method
   - Enter readings/times

4. **Record a Payment**:
   - Go to farmer profile
   - Click "Record Payment"
   - Enter payment details

5. **View Reports**:
   - Go to Reports
   - Select date range
   - Export as needed

---

## 📞 Support

- **Issues**: Create an issue in the repository
- **Documentation**: See README.md
- **Database Schema**: See database-schema.sql
- **Type Definitions**: See src/types/index.ts

---

## 🔐 Security Notes

- LocalStorage data is unencrypted (browser-level security)
- For production with sensitive data, use Neon DB with SSL
- Always use HTTPS in production
- Regularly backup data (export CSV reports)
- Keep dependencies updated: `npm update`

---

## 📊 Performance Tips

- **LocalStorage**: Handles 1000s of records smoothly
- **Neon DB**: Handles millions of records
- Clear old data periodically
- Export and archive historical data
- Use date filters in reports for large datasets

---

**Installation complete! Enjoy using the Water Supply Management System! 💧**
