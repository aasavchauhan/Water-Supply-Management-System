# Water Supply Management System

A comprehensive water irrigation supply management system for managing farmer accounts, tracking water supply sessions, recording payments, and generating reports.

## Features

- 📊 **Dashboard** - Real-time overview of operations, revenue, and statistics
- 💧 **Supply Entry** - Record water supply with meter or time-based billing
- 👥 **Farmer Management** - Complete farmer profile management
- 💰 **Payment Tracking** - Record and track all payments
- 📈 **Reports & Analytics** - Generate comprehensive reports with export options
- 📱 **Mobile-First Design** - Fully responsive, works on all devices
- 🎨 **Modern UI** - Built with Radix UI and Tailwind CSS

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State**: React Context API
- **Storage**: LocalStorage (v1) / Neon DB (v2)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### 🚀 Quick Start (Ready to Use!)

The app works **out of the box** with LocalStorage - no database setup needed!

1. **Install dependencies:**
```bash
npm install
```

2. **Start the app:**
```bash
npm run dev
```

3. **Open your browser:**
   
   Navigate to `http://localhost:3000` and start using the app immediately!

That's it! 🎉 Your data will be stored in your browser's LocalStorage.

### Build for Production

```bash
npm run build
npm run preview
```

The production build will be in the `dist/` folder, ready to deploy to Vercel, Netlify, or any static hosting.

## Database Setup (Optional - for Neon DB)

1. Create a Neon DB account at https://neon.tech
2. Create a new database
3. Run the schema from `database-schema.sql`
4. Update `.env` with your DATABASE_URL

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── SupplyEntryForm.tsx
│   ├── FarmerManagement.tsx
│   ├── FarmerProfile.tsx
│   └── Reports.tsx
├── context/            # Context providers
├── types/              # TypeScript types
├── utils/              # Helper functions
├── styles/             # Global styles
├── App.tsx             # Main app
└── main.tsx           # Entry point
```

## Usage

### Adding a Farmer
1. Go to "Farmer Management"
2. Click "+ Add Farmer"
3. Fill in farmer details
4. Save

### Recording Supply
1. Go to "New Supply Entry"
2. Select farmer
3. Choose billing method (Meter/Time)
4. Enter readings/times
5. Submit

### Recording Payment
1. Go to farmer profile or use "Record Payment"
2. Enter payment details
3. Save

### Generating Reports
1. Go to "Reports"
2. Select date range and filters
3. View summary and export if needed

## Features Breakdown

### Meter-Based Billing
- Enter meter readings in h.mm format (e.g., 5.30 = 5 hours 30 minutes)
- Automatic conversion to decimal hours
- Calculates total time and amount

### Time-Based Billing
- Select start and stop times
- Enter pause duration
- Auto-calculates total hours and charges

### Balance Tracking
- Real-time balance updates
- Color-coded indicators (green = credit, red = dues)
- Automatic calculations on supply/payment entries

## Keyboard Shortcuts

- `Alt + N` - New supply entry
- `Alt + F` - Go to farmers
- `Alt + R` - View reports
- `Esc` - Close dialogs

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please create an issue in the repository.

## Roadmap

- [ ] User authentication
- [ ] Multi-user support with roles
- [ ] SMS/Email notifications
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] API integration
- [ ] Cloud sync

---

**Built with ❤️ for efficient water supply management**
