# 💧 Water Supply Management System

A modern, full-stack web application for managing water supply operations, billing, and farmer accounts. Built with React, TypeScript, Express, and PostgreSQL.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/water-supply-management)

## ✨ Features

- **👨‍🌾 Farmer Management**: Add, edit, and manage farmer profiles with contact details
- **💰 Dual Billing System**: 
  - Time-based billing (start/stop times with pause duration)
  - Meter-based billing (h.mm format for precise readings)
- **💵 Payment Tracking**: Record payments with multiple methods and transaction IDs
- **📊 Real-time Dashboard**: View balances, recent entries, and payment summaries
- **📈 Reports & Analytics**: Generate detailed reports with receipt printing
- **🔐 Authentication**: Secure login with Stack Auth integration
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **🎨 Modern UI**: Built with Radix UI components and Tailwind CSS

## 🚀 Tech Stack

### Frontend
- **React 18.3** - UI framework
- **TypeScript** - Type safety
- **Vite 6.3** - Build tool and dev server
- **React Router 7** - Client-side routing
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Backend
- **Express 5** - Node.js web framework
- **TypeScript** - Type safety
- **PostgreSQL (Neon)** - Cloud database
- **Stack Auth** - Authentication provider
- **JWT** - Token-based auth
- **bcrypt** - Password hashing
- **pg** - PostgreSQL client

## 📋 Prerequisites

- **Node.js** 20+ and npm
- **PostgreSQL** database (Neon recommended)
- **Stack Auth** account (for authentication)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/water-supply-management.git
cd water-supply-management
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Stack Auth (get from stackframe.co)
VITE_STACK_PROJECT_ID=your_stack_project_id
VITE_STACK_PUBLISHABLE_CLIENT_KEY=your_stack_publishable_key
STACK_SECRET_SERVER_KEY=your_stack_secret_key

# JWT Secret (generate a random string)
JWT_SECRET=your_random_jwt_secret

# Server Config
PORT=3001
NODE_ENV=development
```

### 4. Initialize the database
```bash
npm run db:init
```

This creates all required tables:
- `users` - User accounts
- `farmers` - Farmer profiles
- `supply_entries` - Water supply records
- `payments` - Payment transactions
- `settings` - User preferences
- `audit_logs` - Activity tracking

### 5. Run database migrations
```bash
npm run db:migrate
```

## 🏃 Running the Application

### Development Mode

**Option 1: Run both servers**
```bash
# Terminal 1 - Backend server
npm run server:dev

# Terminal 2 - Frontend dev server
npm run dev
```

**Option 2: Run concurrently**
```bash
npm run dev:all
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health check: http://localhost:3001/health

### Production Mode

```bash
# Build frontend
npm run build

# Start backend
npm run server:prod

# Serve built files (use a static server like serve)
npx serve -s dist
```

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (frontend) |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build locally |
| `npm run server:dev` | Start Express server in dev mode |
| `npm run server:prod` | Start Express server in production |
| `npm run dev:all` | Run both frontend and backend concurrently |
| `npm run db:init` | Initialize database tables |
| `npm run db:migrate` | Run database migrations |

## 🌐 Deployment

### Deploy to Vercel (Frontend) + Render (Backend)

#### 1. Deploy Backend to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server:prod`
5. Add environment variables (DATABASE_URL, STACK_SECRET_SERVER_KEY, JWT_SECRET, NODE_ENV=production)
6. Deploy and copy the backend URL

#### 2. Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Import Project**
2. Connect your GitHub repo
3. Configure:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variables:
   ```
   VITE_STACK_PROJECT_ID=your_project_id
   VITE_STACK_PUBLISHABLE_CLIENT_KEY=your_key
   VITE_API_URL=https://your-backend.onrender.com
   ```
5. Deploy!

**Note**: Update CORS settings in `server/index.ts` to allow your Vercel domain.

## 📱 Usage

### Creating a Supply Entry

1. Navigate to **"New Supply Entry"** from the dashboard
2. Select a farmer from the dropdown
3. Choose billing method:
   - **Meter Reading**: Enter start/end readings in h.mm format (e.g., 5.30 = 5h 30m)
   - **Time-Based**: Enter start/stop times with optional pause duration
4. Review the auto-calculated amount
5. Add optional remarks
6. Save the entry

### Managing Payments

1. Go to farmer's profile
2. Click **"Record Payment"**
3. Enter amount and payment details
4. Submit to update farmer's balance

### Generating Reports

1. Navigate to **"Reports"** section
2. Filter by date range or farmer
3. View summaries and detailed transactions
4. Print receipts directly from the app

## 🗂️ Project Structure

```
├── src/                      # Frontend source
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── FarmerManagement.tsx
│   │   ├── SupplyEntryForm.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   ├── context/             # React Context providers
│   │   ├── AuthContext.tsx  # Authentication state
│   │   └── DataContext.tsx  # Business data state
│   ├── services/            # API and utilities
│   │   └── api.service.ts   # Backend API client
│   ├── types/               # TypeScript interfaces
│   └── App.tsx              # Root component
├── server/                   # Backend source
│   ├── routes/              # Express routes
│   ├── services/            # Business logic
│   ├── middleware/          # Auth middleware
│   ├── db.ts               # Database connection
│   └── index.ts            # Server entry point
├── build/                    # Production build output
├── package.json
└── vite.config.ts
```

## 🔐 Authentication

The app uses [Stack Auth](https://stackframe.co) for authentication:
- Email/password login
- Secure JWT tokens
- Development bypass mode for testing
- User session management

## 🗄️ Database Schema

See [`SUPPLY_ENTRY_FORM_GUIDE.md`](SUPPLY_ENTRY_FORM_GUIDE.md) for detailed schema documentation.

### Key Tables:
- **users**: User accounts and profiles
- **farmers**: Farmer records with balances
- **supply_entries**: Water delivery logs (time/meter billing)
- **payments**: Payment transactions
- **settings**: User-specific configurations

## 📖 Documentation

- **[SUPPLY_ENTRY_FORM_GUIDE.md](SUPPLY_ENTRY_FORM_GUIDE.md)** - Complete guide to the supply entry form
- **[PROJECT_SPECIFICATION.md](PROJECT_SPECIFICATION.md)** - Detailed project specifications
- **[HYBRID_STORAGE_GUIDE.md](HYBRID_STORAGE_GUIDE.md)** - Previous offline-first architecture notes

## 🐛 Troubleshooting

### Database Connection Failed
- Verify `DATABASE_URL` in `.env`
- Ensure Neon database is accessible
- Check SSL settings (`?sslmode=require`)

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (20+ required)
- Clear `node_modules` and reinstall if needed

### CORS Errors
- Verify backend URL in `VITE_API_URL`
- Check CORS settings in `server/index.ts`
- Ensure credentials are enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Original design: [Figma Design](https://www.figma.com/design/nBhwKEBjGpbbcsLJrioy8q/Water-Supply-Management-System)
- UI Components: [Radix UI](https://radix-ui.com) & [shadcn/ui](https://ui.shadcn.com)
- Icons: [Lucide Icons](https://lucide.dev)

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ for efficient water supply management**