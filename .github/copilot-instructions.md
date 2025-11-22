# Water Supply Management System - AI Agent Guide

## Architecture Overview

**Offline-First Full-Stack Application** with hybrid local + cloud storage for seamless user experience.

- **Frontend**: React 18 + TypeScript + Vite + SWC
- **Backend**: Express.js + TypeScript + PostgreSQL (Neon)
- **Local Storage**: IndexedDB for offline-first operations
- **Sync Strategy**: Optimistic writes to local, background sync to Neon
- **Auth**: JWT tokens with httpOnly cookies
- **State Management**: React Context (`AuthContext` + `DataContext`)
- **UI Library**: Radix UI components + shadcn/ui pattern
- **Database**: PostgreSQL (Neon) as source of truth + IndexedDB for local cache

### Hybrid Storage Architecture

**Write Flow (Optimistic Updates):**
1. User performs action (create/update/delete)
2. Write to **IndexedDB immediately** (instant UI update)
3. Queue operation in sync queue
4. **Background sync** to Neon when online
5. Retry failed syncs automatically (max 5 attempts)

**Read Flow (Cache-First):**
1. Load from **IndexedDB first** (instant display)
2. Display data immediately to user
3. **Sync from Neon in background** (when online)
4. Update UI if remote data differs

**Benefits:**
- ✅ Works completely offline
- ✅ Instant UI updates (no loading spinners for writes)
- ✅ Automatic conflict resolution (last-write-wins)
- ✅ Automatic retry of failed syncs
- ✅ Visual sync status indicator

## Project Structure

```
├── server/                     # Backend API
│   ├── index.ts               # Express server entry
│   ├── db.ts                  # PostgreSQL connection pool
│   ├── services/              # Business logic
│   │   ├── auth.service.ts    # Authentication & user management
│   │   └── database.service.ts # CRUD operations
│   ├── routes/                # API endpoints
│   │   ├── auth.routes.ts     # /api/auth/*
│   │   ├── farmers.routes.ts  # /api/farmers/*
│   │   ├── supplies.routes.ts # /api/supplies/*
│   │   ├── payments.routes.ts # /api/payments/*
│   │   └── settings.routes.ts # /api/settings/*
│   └── middleware/
│       └── auth.middleware.ts # JWT verification
├── src/                       # Frontend
│   ├── components/            # UI components
│   ├── context/               # React Context providers
│   │   ├── AuthContext.tsx    # User authentication state
│   │   └── DataContext.tsx    # Business data state (hybrid storage)
│   ├── services/
│   │   ├── api.service.ts     # API client wrapper (Neon backend)
│   │   ├── indexeddb.service.ts # Local IndexedDB operations
│   │   └── sync.service.ts    # Sync orchestration (local ↔ Neon)
│   └── types/
│       └── index.ts           # TypeScript interfaces
```

## Database Schema (Neon PostgreSQL)

### Core Tables
- **users**: Authentication & user profiles
- **farmers**: Farmer records (user-scoped)
- **supply_entries**: Water delivery records (time/water billing)
- **payments**: Payment transactions
- **settings**: User-specific business settings
- **audit_logs**: Activity tracking (for future use)

All entities include `user_id` for multi-tenancy isolation.

## Data Flow & Storage

### Entity Types
Defined in `src/types/index.ts`:
- **User**: Authentication profile with role and activity status
- **Farmer**: Profile with balance (negative = due, positive = advance), `isActive` flag
- **SupplyEntry**: Water delivery with `billingMethod` ('time' | 'water')
- **Payment**: Payment record with `paymentMethod` and `transactionId`
- **Settings**: User-specific business config (rates, currency, formats)
- **AuditLog**: Activity tracking (currently write-only)

### Hybrid Storage Pattern

**Services Architecture:**
1. **IndexedDB Service** (`indexeddb.service.ts`):
   - Manages local storage with 6 object stores: farmers, supplyEntries, payments, settings, syncQueue, metadata
   - Provides CRUD methods for instant local operations
   - Tracks sync queue for pending operations

2. **Sync Service** (`sync.service.ts`):
   - Monitors online/offline status via `navigator.onLine`
   - Auto-syncs every 30 seconds when online
   - Queues writes when offline, retries on reconnect
   - Provides status updates to UI (`SyncStatus` component)

3. **API Service** (`api.service.ts`):
   - Makes authenticated requests to Neon backend
   - Handles JWT token management
   - Used by sync service for remote operations

**DataContext Flow:**
```typescript
// Write operation (e.g., addFarmer)
1. Create entity with client-side ID (Date.now())
2. Call syncService.optimisticWrite()
   - Saves to IndexedDB immediately
   - Updates React state (instant UI)
   - Adds to sync queue
   - Triggers background sync if online
3. Sync service processes queue
   - POSTs to Neon backend
   - Marks item as synced
   - Retries on failure (max 5 times)

// Read operation (e.g., refreshData)
1. Load from IndexedDB first (fast)
2. Update UI with local data
3. Sync from Neon in background (if online)
4. Update UI if remote data differs
```

## Critical Workflows

### Development Setup
```bash
# 1. Install dependencies
npm i

# 2. Configure environment (.env file)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=your-secret-key
PORT=3001
NODE_ENV=development

# 3. Start backend server (terminal 1)
npm run server

# 4. Start frontend dev server (terminal 2)
npm run dev
```

### Production Build
```bash
npm run build              # Build frontend → build/
npm run server:prod        # Run backend in production mode
```

### Authentication Flow
1. User visits app → `AuthContext` checks for existing token
2. If no token → show `LoginPage` component
3. On login/register → `authService` validates credentials
4. On success → JWT token set in httpOnly cookie + `Authorization` header
5. All API requests include token via `authMiddleware`
6. Token expires in 7 days (configurable in `auth.service.ts`)

### Database Operations
- **Service**: `server/services/database.service.ts` provides type-safe CRUD methods
- **Connection**: PostgreSQL connection pool in `server/db.ts`
- **Queries**: Parameterized SQL with `$1, $2` placeholders (prevents SQL injection)
- **User Scoping**: All queries filtered by `user_id` from JWT token

## Project-Specific Conventions

### Component Organization
- **Pages**: Top-level views like `Dashboard`, `FarmerManagement`, `Reports` in `src/components/`
- **UI primitives**: `src/components/ui/` follows shadcn/ui pattern (isolated, composable)
- **Figma assets**: `src/components/figma/ImageWithFallback.tsx` for design handoff compatibility

### Navigation Pattern
`App.tsx` uses a `Page` type and `navigateTo()` helper instead of routing libraries:
```typescript
type Page = 'dashboard' | 'new-supply' | 'farmers' | 'farmer-profile' | 'reports' | 'settings';
const navigateTo = (page: Page, farmerId?: string) => { ... }
```

### State Access
Always consume data via `useData()` hook (from `DataContext`):
```typescript
import { useData } from '../context/DataContext';
const { farmers, addFarmer, updateFarmer } = useData();
```

**Important**: All mutations are optimistic (instant UI update), then sync to Neon in background.

### Sync Status Monitoring
Use `SyncStatus` component to show:
- **Online/Offline** status
- **Pending sync count** (items waiting to upload)
- **Sync progress** (syncing, error, idle)
- **Manual sync trigger** (force sync button)

Already integrated in `App.tsx` header (mobile + desktop).

### ID Generation
All entities use timestamp-based IDs:
```typescript
id: Date.now().toString()
```

### Balance Calculation
Farmer balance updates are **embedded in transaction mutations**:
- `addSupplyEntry()` → decreases balance by `entry.amount`
- `addPayment()` → increases balance by `payment.amount`

No separate reconciliation step. Balance is always derived from mutation history.

## Path Aliases

Vite config defines `@` alias for cleaner imports:
```typescript
import { Button } from '@/components/ui/button';
// Resolves to: src/components/ui/button
```

## API Service Methods

The `ApiService` class in `src/services/api.service.ts`:

**Authentication:**
```typescript
await apiService.login(email, password)
await apiService.register(email, password, fullName)
await apiService.logout()
await apiService.getCurrentUser()
```

**Farmers:**
```typescript
await apiService.getFarmers()
await apiService.getFarmerById(id)
await apiService.createFarmer(farmer)
await apiService.updateFarmer(id, updates)
await apiService.deleteFarmer(id)
```

**Supply Entries:**
```typescript
await apiService.getSupplyEntries()
await apiService.createSupplyEntry(entry)
```

**Payments:**
```typescript
await apiService.getPayments()
await apiService.createPayment(payment)
```

**Settings:**
```typescript
await apiService.getSettings()
await apiService.updateSettings(updates)
```

## UI Patterns

### Responsive Sidebar
`App.tsx` implements mobile/desktop sidebar:
- Desktop: sticky sidebar (`lg:sticky lg:translate-x-0`)
- Mobile: overlay drawer with `isSidebarOpen` state

### Toast Notifications
Global `Toaster` component (from `sonner`) mounted in `App.tsx`. Import `toast` from `sonner` to trigger:
```typescript
import { toast } from 'sonner';
toast.success('Farmer added successfully');
```

### Form Handling
`SupplyEntryForm.tsx` demonstrates the app's form pattern:
- Uses `react-hook-form` for validation
- Radix UI components for inputs
- `onSuccess` callback to navigate after mutation

## Common Modifications

**Adding a new page**:
1. Add page component to `src/components/`
2. Add page key to `Page` type in `App.tsx`
3. Add menu item to `menuItems` array
4. Add route in `main` content switch statement

**Adding a new data type**:
1. Define interface in `src/types/index.ts`
2. Add state + mutations to `DataContext.tsx`
3. Add API methods to `src/services/api.service.ts`
4. Add backend routes in `server/routes/`
5. Add database methods in `server/services/database.service.ts`
6. Create database table with migration script
