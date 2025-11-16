# Water Supply Management System

A comprehensive water irrigation supply management system designed for managing farmer accounts, tracking water supply sessions, recording payments, and generating reports. Built with mobile-first approach and fully responsive for desktop use.

## Features

- ✅ **Farmer Management** - Add, edit, delete, and view farmer profiles
- ✅ **Supply Entry** - Record water supply sessions (meter or time-based billing)
- ✅ **Payment Tracking** - Record and manage payments from farmers
- ✅ **Dashboard** - Real-time statistics and recent activities
- ✅ **Reports** - Generate comprehensive reports with export functionality
- ✅ **Mobile-First** - Optimized for mobile devices, fully responsive
- ✅ **PWA Support** - Install as a mobile app
- ✅ **Neon DB Integration** - Cloud PostgreSQL database with Prisma ORM

## Technology Stack

- **Frontend**: React 18.3 + TypeScript + Vite
- **Styling**: Tailwind CSS v4.1
- **UI Components**: Radix UI (shadcn/ui)
- **Database**: Neon DB (PostgreSQL)
- **ORM**: Prisma
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Routing**: React Router v7

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Neon account (free tier available at [neon.tech](https://neon.tech))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Water-Supply-Management-System
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Neon database connection string:
```env
DATABASE_URL="postgresql://username:password@ep-xxxx.region.aws.neon.tech/dbname?sslmode=require"
```

5. Generate Prisma client and push schema to database:
```bash
npm run db:generate
npm run db:push
```

6. Start the development server:
```bash
npm run dev
```

7. Open http://localhost:3000 in your browser

## Database Setup (Neon)

1. Go to [console.neon.tech](https://console.neon.tech) and sign up
2. Create a new project
3. Copy the connection string
4. Paste it in your `.env` file
5. Run `npm run db:push` to create tables

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── Dashboard.tsx
│   ├── SupplyEntryForm.tsx
│   ├── FarmerManagement.tsx
│   ├── FarmerProfile.tsx
│   ├── Reports.tsx
│   └── Settings.tsx
├── context/
│   └── DataContext.tsx  # Global state management
├── types/
│   └── index.ts         # TypeScript interfaces
├── lib/
│   └── utils.ts         # Utility functions
├── styles/
│   └── globals.css      # Global styles
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

## Mobile App Conversion

This application is built with PWA support and can be:
1. Installed as a mobile app directly from the browser
2. Easily converted to React Native for native apps
3. Wrapped with Capacitor or Cordova for app store deployment

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
