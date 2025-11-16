# Water Supply Management System - Complete Project Specification

## Project Overview
A comprehensive water irrigation supply management system designed for managing farmer accounts, tracking water supply sessions, recording payments, and generating reports. The application is optimized for mobile-first usage with a responsive design that scales to desktop.

---

## Technology Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS v4.1.3
- **UI Components**: Radix UI (headless components)
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)
- **State Management**: React Context API

### Backend (Version 2 - External Database)
- **Database**: Neon DB (PostgreSQL) or similar serverless PostgreSQL
- **ORM**: Prisma or Drizzle ORM (recommended)
- **API**: REST API or tRPC
- **Authentication**: JWT-based authentication (future implementation)

---

## File Structure & Component Organization

```
water-supply-management-system/
├── public/
│   └── vite.svg                    # Favicon
├── src/
│   ├── components/
│   │   ├── ui/                     # Radix UI components (shadcn/ui)
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── ... (other UI components)
│   │   ├── Dashboard.tsx           # Main dashboard screen
│   │   ├── SupplyEntryForm.tsx     # Supply entry form
│   │   ├── FarmerManagement.tsx    # Farmer list & CRUD
│   │   ├── FarmerProfile.tsx       # Individual farmer detail view
│   │   ├── FarmerReceipt.tsx       # Receipt generator/printer
│   │   ├── Reports.tsx             # Reports & analytics
│   │   ├── Settings.tsx            # Settings page
│   │   ├── SupplyEditDialog.tsx    # Edit supply entry dialog
│   │   ├── PaymentEditDialog.tsx   # Edit payment dialog
│   │   └── PaymentDialog.tsx       # Record new payment
│   ├── context/
│   │   └── DataContext.tsx         # Global state management
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   ├── utils/
│   │   └── calculations.ts         # Helper functions (optional)
│   ├── styles/
│   │   └── globals.css             # Global styles
│   ├── App.tsx                     # Main app component with routing
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Tailwind imports
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

### Component Dependencies
```
App.tsx
├── Dashboard.tsx
│   ├── SupplyEditDialog.tsx
│   └── PaymentEditDialog.tsx (future)
├── SupplyEntryForm.tsx
├── FarmerManagement.tsx
│   └── FarmerReceipt.tsx
├── FarmerProfile.tsx
│   ├── SupplyEditDialog.tsx
│   ├── PaymentEditDialog.tsx
│   └── FarmerReceipt.tsx
├── Reports.tsx
│   └── FarmerReceipt.tsx
└── Settings.tsx

All components use:
├── DataContext (useData hook)
└── UI components from ./ui/
```

## Application Architecture

### Current Version (V1) - LocalStorage
```
┌─────────────────────────────────────────┐
│          React Application              │
│  ┌───────────────────────────────────┐  │
│  │      Context API (State)          │  │
│  │  - DataContext.tsx                │  │
│  │  - Farmers, Supplies, Payments    │  │
│  └───────────────────────────────────┘  │
│                 ↓                        │
│  ┌───────────────────────────────────┐  │
│  │    LocalStorage (Persistence)     │  │
│  │  - farmers                        │  │
│  │  - supplyEntries                  │  │
│  │  - payments                       │  │
│  │  - settings                       │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

#### LocalStorage Data Structure (V1)

**Key: `farmers`**
```typescript
interface Farmer {
  id: string;              // UUID v4 format
  name: string;            // Full name
  mobile: string;          // 10 digits
  farmLocation: string;    // Address/location
  defaultRate: number;     // ₹ per hour (e.g., 60.00)
  balance: number;         // Current balance (calculated)
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}

// Example:
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Rajesh Kumar",
    "mobile": "9876543210",
    "farmLocation": "Village Rampur, Plot 45",
    "defaultRate": 60,
    "balance": -2500.00,
    "createdAt": "2025-11-01T10:30:00.000Z",
    "updatedAt": "2025-11-15T14:20:00.000Z"
  }
]
```

**Key: `supplyEntries`**
```typescript
interface SupplyEntry {
  id: string;                  // UUID v4
  farmerId: string;            // References farmer.id
  date: string;                // YYYY-MM-DD format
  billingMethod: 'meter' | 'time';
  
  // Time-based fields (used when billingMethod === 'time')
  startTime?: string;          // HH:MM format (e.g., "08:00")
  stopTime?: string;           // HH:MM format (e.g., "13:30")
  pauseDuration: number;       // Hours (e.g., 0.5)
  
  // Meter-based fields (used when billingMethod === 'meter')
  meterReadingStart: number;   // h.mm format (e.g., 5.30)
  meterReadingEnd: number;     // h.mm format (e.g., 10.45)
  
  // Calculated fields
  totalTimeUsed: number;       // Hours (decimal)
  totalWaterUsed: number;      // Liters (optional, default 0)
  
  // Billing
  rate: number;                // ₹ per hour
  amount: number;              // Total charge (₹)
  
  remarks: string;             // Optional notes
  createdAt: string;           // ISO timestamp
  updatedAt: string;           // ISO timestamp
}

// Example (Meter-based):
{
  "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "farmerId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "date": "2025-11-16",
  "billingMethod": "meter",
  "startTime": "",
  "stopTime": "",
  "pauseDuration": 0,
  "meterReadingStart": 5.30,
  "meterReadingEnd": 10.45,
  "totalTimeUsed": 5.25,
  "totalWaterUsed": 5250,
  "rate": 60,
  "amount": 315,
  "remarks": "Regular irrigation session",
  "createdAt": "2025-11-16T08:00:00.000Z",
  "updatedAt": "2025-11-16T08:00:00.000Z"
}

// Example (Time-based):
{
  "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "farmerId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "date": "2025-11-15",
  "billingMethod": "time",
  "startTime": "08:00",
  "stopTime": "13:30",
  "pauseDuration": 0.5,
  "meterReadingStart": 0,
  "meterReadingEnd": 0,
  "totalTimeUsed": 5.0,
  "totalWaterUsed": 5000,
  "rate": 60,
  "amount": 300,
  "remarks": "Morning shift with lunch break",
  "createdAt": "2025-11-15T08:00:00.000Z",
  "updatedAt": "2025-11-15T08:00:00.000Z"
}
```

**Key: `payments`**
```typescript
interface Payment {
  id: string;              // UUID v4
  farmerId: string;        // References farmer.id
  amount: number;          // Payment amount (₹)
  paymentMethod?: string;  // 'cash', 'upi', 'bank_transfer', etc.
  transactionId?: string;  // For digital payments
  remarks: string;         // Optional notes
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}

// Example:
{
  "id": "d4e5f6a7-b8c9-0123-def1-234567890123",
  "farmerId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "amount": 1500,
  "paymentMethod": "upi",
  "transactionId": "UPI123456789",
  "remarks": "Partial payment via PhonePe",
  "createdAt": "2025-11-15T16:30:00.000Z",
  "updatedAt": "2025-11-15T16:30:00.000Z"
}
```

**Key: `settings`**
```typescript
interface Settings {
  businessName: string;
  businessAddress: string;
  businessPhone?: string;
  businessEmail?: string;
  defaultHourlyRate: number;    // ₹ per hour
  currency: string;             // 'INR', 'USD', etc.
  currencySymbol: string;       // '₹', '$', etc.
  waterFlowRate?: number;       // Liters per hour (optional)
}

// Example:
{
  "businessName": "Kumar Water Supply Services",
  "businessAddress": "Main Road, Village Rampur, District Meerut, UP - 250001",
  "businessPhone": "9876543210",
  "businessEmail": "kumar.water@example.com",
  "defaultHourlyRate": 60,
  "currency": "INR",
  "currencySymbol": "₹",
  "waterFlowRate": 1000
}
```

### Version 2 Architecture (With External Database)
```
┌──────────────────────────────────────────────────┐
│            Mobile/Web Client                     │
│  ┌────────────────────────────────────────────┐  │
│  │         React Application                  │  │
│  │  - Mobile-optimized UI                     │  │
│  │  - Responsive Design                       │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
                      ↓ HTTPS
┌──────────────────────────────────────────────────┐
│              API Server (Node.js)                │
│  ┌────────────────────────────────────────────┐  │
│  │  REST API / tRPC Endpoints                 │  │
│  │  - Authentication & Authorization          │  │
│  │  - Input Validation & Sanitization         │  │
│  │  - Business Logic                          │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│         Neon DB (PostgreSQL Database)            │
│  - Farmers Table                                 │
│  - Supply Entries Table                          │
│  - Payments Table                                │
│  - Settings Table                                │
│  - Users Table (Auth)                            │
└──────────────────────────────────────────────────┘
```

---

## Database Schema (PostgreSQL)

### 1. Users Table (For Authentication - Future)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin', -- admin, operator, viewer
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### 2. Farmers Table
```sql
CREATE TABLE farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Owner of the data
  
  -- Farmer Details
  name VARCHAR(255) NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  farm_location TEXT,
  default_rate DECIMAL(10, 2) NOT NULL DEFAULT 60.00, -- ₹ per hour
  
  -- Account Balance
  balance DECIMAL(12, 2) DEFAULT 0.00, -- Negative = owes money, Positive = credit
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Constraints
  CONSTRAINT farmers_mobile_check CHECK (LENGTH(mobile) >= 10)
);

-- Indexes
CREATE INDEX idx_farmers_user_id ON farmers(user_id);
CREATE INDEX idx_farmers_mobile ON farmers(mobile);
CREATE INDEX idx_farmers_name ON farmers(name);
CREATE INDEX idx_farmers_balance ON farmers(balance);
CREATE INDEX idx_farmers_created_at ON farmers(created_at);

-- Full-text search index
CREATE INDEX idx_farmers_search ON farmers USING gin(to_tsvector('english', name || ' ' || mobile || ' ' || farm_location));
```

### 3. Supply Entries Table
```sql
CREATE TABLE supply_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
  
  -- Supply Session Details
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Billing Method: 'meter' or 'time'
  billing_method VARCHAR(10) NOT NULL DEFAULT 'meter',
  
  -- Time-based fields (optional)
  start_time TIME,
  stop_time TIME,
  pause_duration DECIMAL(5, 2) DEFAULT 0.00, -- in hours
  
  -- Meter-based fields (optional)
  meter_reading_start DECIMAL(10, 2) DEFAULT 0.00, -- hours.minutes format (5.30 = 5h 30m)
  meter_reading_end DECIMAL(10, 2) DEFAULT 0.00,
  
  -- Calculated fields
  total_time_used DECIMAL(10, 2) NOT NULL, -- in hours
  total_water_used DECIMAL(12, 2) DEFAULT 0.00, -- in liters (auto-calculated if needed)
  
  -- Billing
  rate DECIMAL(10, 2) NOT NULL, -- ₹ per hour
  amount DECIMAL(12, 2) NOT NULL, -- Total charge
  
  -- Additional info
  remarks TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT supply_billing_method_check CHECK (billing_method IN ('meter', 'time')),
  CONSTRAINT supply_time_used_positive CHECK (total_time_used > 0),
  CONSTRAINT supply_amount_positive CHECK (amount >= 0)
);

-- Indexes
CREATE INDEX idx_supply_user_id ON supply_entries(user_id);
CREATE INDEX idx_supply_farmer_id ON supply_entries(farmer_id);
CREATE INDEX idx_supply_date ON supply_entries(date);
CREATE INDEX idx_supply_created_at ON supply_entries(created_at);
CREATE INDEX idx_supply_billing_method ON supply_entries(billing_method);

-- Composite indexes for common queries
CREATE INDEX idx_supply_farmer_date ON supply_entries(farmer_id, date DESC);
CREATE INDEX idx_supply_user_date ON supply_entries(user_id, date DESC);
```

### 4. Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
  
  -- Payment Details
  amount DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'cash', -- cash, bank_transfer, upi, cheque
  transaction_id VARCHAR(255), -- For digital payments
  
  -- Additional info
  remarks TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Constraints
  CONSTRAINT payment_amount_positive CHECK (amount > 0)
);

-- Indexes
CREATE INDEX idx_payment_user_id ON payments(user_id);
CREATE INDEX idx_payment_farmer_id ON payments(farmer_id);
CREATE INDEX idx_payment_date ON payments(payment_date);
CREATE INDEX idx_payment_created_at ON payments(created_at);
CREATE INDEX idx_payment_method ON payments(payment_method);

-- Composite indexes
CREATE INDEX idx_payment_farmer_date ON payments(farmer_id, payment_date DESC);
```

### 5. Settings Table
```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  
  -- Business Information
  business_name VARCHAR(255) NOT NULL DEFAULT 'Water Supply Management',
  business_address TEXT,
  business_phone VARCHAR(15),
  business_email VARCHAR(255),
  
  -- Default Values
  default_hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 60.00,
  currency VARCHAR(10) DEFAULT 'INR',
  currency_symbol VARCHAR(5) DEFAULT '₹',
  
  -- Regional Settings
  timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
  date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
  time_format VARCHAR(20) DEFAULT '12h', -- 12h or 24h
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX idx_settings_user_id ON settings(user_id);
```

### 6. Audit Log Table (Optional - For tracking changes)
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  
  -- Action Details
  action VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE
  entity_type VARCHAR(50) NOT NULL, -- farmers, supply_entries, payments
  entity_id UUID NOT NULL,
  
  -- Change Details
  old_values JSONB,
  new_values JSONB,
  
  -- Metadata
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at);
```

---

## Application Sections & Features

### 1. Dashboard (Home Screen)
**Purpose**: Overview of the entire system with quick stats and recent activities

#### Components & Elements
- **Header Section**
  - Title: "Dashboard"
  - Subtitle: "Welcome to Water Irrigation Supply Management"
  - Action Button: "New Supply" (redirects to supply entry form)

- **Statistics Cards** (4 cards in responsive grid)
  1. **Total Farmers Card**
     - Display: Total number of registered farmers
     - Sub-info: Count of farmers with pending dues
     - Icon: Users icon
     
  2. **Water Supplied Card**
     - Display: Total water supplied in liters
     - Sub-info: Total hours of supply
     - Icon: Droplets icon
     
  3. **Total Income Card**
     - Display: Total payments received (₹)
     - Sub-info: Total charges generated
     - Icon: Indian Rupee icon
     
  4. **Pending Dues Card**
     - Display: Outstanding amount (₹) - shown in orange/warning color
     - Sub-info: Percentage of total charges collected
     - Icon: Alert Circle icon

- **Recent Supply Sessions Card**
  - List of last 10 supply entries
  - Each entry shows:
    - Farmer name
    - Date, total hours, total water
    - Amount charged (₹)
    - Action buttons: Edit, Delete
  - Responsive: Stacked on mobile, row layout on desktop
  - Hover effects on each item
  
- **Recent Payments Card**
  - List of last 10 payment records
  - Each entry shows:
    - Farmer name
    - Date, amount (₹)
    - Payment status indicator
    - Action button: Delete
  - Responsive layout
  - Hover effects

#### Data Requirements
- Fetch all farmers count
- Calculate total water supplied (sum of all supply entries)
- Calculate total hours (sum of all supply entries)
- Calculate total charges (sum of all supply amounts)
- Calculate total payments (sum of all payment amounts)
- Calculate pending dues (charges - payments)
- Fetch recent 10 supply entries (sorted by created_at DESC)
- Fetch recent 10 payments (sorted by created_at DESC)

#### Automatic Calculations
- Total statistics update in real-time when new entries added
- Balance calculations auto-update
- Percentage calculations for collection rate

#### Mobile Optimizations
- Stats cards: 1 column on mobile, 2 on tablet, 4 on desktop
- Font sizes: text-xl on mobile → text-2xl/3xl on desktop
- Touch-friendly buttons (min 44px height)
- Horizontal scroll for tables if needed

---

### 2. New Supply Entry Form
**Purpose**: Record a new water supply session for a farmer

#### Form Fields & Sections

##### A. Farmer Selection
- **Field**: Dropdown select (searchable)
- **Required**: Yes (*)
- **Options**: List of all active farmers (name + mobile)
- **Behavior**: On selection, auto-fills default rate from farmer profile
- **Validation**: Must select a farmer before submission

##### B. Date Selection
- **Field**: Date picker
- **Required**: Yes (*)
- **Default**: Current date
- **Format**: YYYY-MM-DD (ISO format for database)
- **Display**: Localized format based on settings

##### C. Billing Method Toggle
- **Type**: Toggle buttons (Meter / Time)
- **Default**: Meter
- **Visual**: Active button highlighted with primary color
- **Behavior**: Dynamically shows/hides relevant fields based on selection

##### D. Meter-Based Billing Fields (Shown when billing_method = 'meter')
1. **Meter Reading Start**
   - Input type: Number (decimal)
   - Format: hours.minutes (e.g., 5.30 = 5 hours 30 minutes)
   - Required: Yes when meter billing selected
   - Placeholder: "e.g., 5.30 (5h 30m)"
   
2. **Meter Reading End**
   - Input type: Number (decimal)
   - Format: hours.minutes
   - Required: Yes when meter billing selected
   - Validation: Must be greater than start reading

##### E. Time-Based Billing Fields (Shown when billing_method = 'time')
1. **Start Time**
   - Input type: Time picker
   - Format: HH:MM (24-hour or 12-hour based on settings)
   - Required: Yes when time billing selected
   
2. **Stop Time**
   - Input type: Time picker
   - Validation: Must be after start time
   - Required: Yes when time billing selected
   
3. **Pause Duration**
   - Input type: Number (decimal)
   - Unit: Hours
   - Default: 0.00
   - Optional: Yes
   - Description: Time when supply was paused/stopped

##### F. Billing Details
1. **Rate (₹/hour)**
   - Input type: Number (decimal)
   - Auto-filled: From selected farmer's default rate
   - Editable: Yes (can override)
   - Required: Yes
   - Min value: 0
   
2. **Amount (₹)**
   - Input type: Display only (calculated)
   - Calculation: `total_time_used × rate`
   - Format: Currency with 2 decimal places
   - Background: Muted/disabled (read-only)

##### G. Additional Information
1. **Remarks/Notes**
   - Input type: Textarea
   - Optional: Yes
   - Placeholder: "Optional notes about this supply session"
   - Max length: 500 characters (recommended)

##### H. Session Summary Panel
- **Background**: Gradient muted background with border
- **Display**:
  - Billing method selected
  - Meter reading range (if meter) OR Time range (if time-based)
  - Total time calculated
  - Rate per hour
  - **Total Amount** (bold, larger font, primary color)

#### Automatic Calculations

##### Meter Reading Calculation
```javascript
/**
 * Converts meter reading in h.mm format to decimal hours
 * @param {number} reading - Meter reading (e.g., 5.30 for 5 hours 30 minutes)
 * @returns {number} - Hours in decimal format (e.g., 5.5)
 * 
 * Format: h.mm where:
 * - h = hours (integer part)
 * - mm = minutes (decimal part interpreted as 0-59)
 * 
 * Examples:
 * - 5.30 → 5 hours 30 minutes → 5.5 hours
 * - 10.45 → 10 hours 45 minutes → 10.75 hours
 * - 3.15 → 3 hours 15 minutes → 3.25 hours
 * - 0.05 → 0 hours 5 minutes → 0.0833 hours
 */
function convertMeterToHours(reading) {
  const hours = Math.floor(reading);              // Extract hour part
  const minutes = Math.round((reading - hours) * 100);  // Extract minute part
  return hours + (minutes / 60);                  // Convert to decimal hours
}

// Usage in supply entry:
const meterStart = 5.30;  // 5 hours 30 minutes
const meterEnd = 10.45;   // 10 hours 45 minutes

const startHours = convertMeterToHours(meterStart);  // 5.5
const endHours = convertMeterToHours(meterEnd);      // 10.75
const totalTimeUsed = endHours - startHours;         // 5.25 hours

// Real implementation from SupplyEntryForm.tsx:
const calculated = useMemo(() => {
  let totalTimeUsed = 0;
  let totalWaterUsed = 0;

  if (formData.billingMethod === 'meter') {
    // Convert meter readings to hours
    const startHours = convertMeterToHours(formData.meterReadingStart);
    const endHours = convertMeterToHours(formData.meterReadingEnd);
    totalTimeUsed = Math.max(0, endHours - startHours);
  } else {
    // Time-based calculation (see below)
    // ...
  }
  
  // Calculate water based on time (if flow rate known)
  totalWaterUsed = totalTimeUsed * 1000; // Assuming 1000 L/hour
  
  return {
    totalTimeUsed: parseFloat(totalTimeUsed.toFixed(2)),
    totalWaterUsed: parseFloat(totalWaterUsed.toFixed(2)),
    amount: parseFloat((totalTimeUsed * formData.rate).toFixed(2))
  };
}, [formData]);
```

**Edge Cases to Handle:**
```javascript
// Invalid inputs
convertMeterToHours(5.99);   // Minutes > 59, should validate
convertMeterToHours(-5.30);  // Negative reading, should reject
convertMeterToHours(0);      // Zero reading, valid (0 hours)

// Validation function:
function validateMeterReading(reading) {
  if (reading < 0) return false;
  const minutes = Math.round((reading - Math.floor(reading)) * 100);
  if (minutes > 59) return false;  // Minutes must be 0-59
  return true;
}

// Example validation in form:
if (meterReadingEnd <= meterReadingStart) {
  toast.error('End reading must be greater than start reading');
  return;
}

if (!validateMeterReading(meterReadingStart) || !validateMeterReading(meterReadingEnd)) {
  toast.error('Invalid meter reading format. Minutes must be 00-59');
  return;
}
```

##### Time-Based Calculation
```javascript
/**
 * Calculates duration from start/stop time with pause
 * @param {string} startTime - Start time in HH:MM format (e.g., "08:00")
 * @param {string} stopTime - Stop time in HH:MM format (e.g., "13:30")
 * @param {number} pauseDuration - Pause time in hours (e.g., 0.5)
 * @returns {number} - Total hours worked
 */
function calculateTimeDuration(startTime, stopTime, pauseDuration = 0) {
  // Create date objects (date doesn't matter, only time)
  const start = new Date(`1970-01-01T${startTime}:00`);
  const stop = new Date(`1970-01-01T${stopTime}:00`);
  
  // Calculate difference in milliseconds
  const diffMs = stop - start;
  
  // Convert to hours
  const diffHours = diffMs / (1000 * 60 * 60);
  
  // Subtract pause duration
  const totalHours = Math.max(0, diffHours - pauseDuration);
  
  return totalHours;
}

// Real-world examples:

// Example 1: Morning shift
const time1 = calculateTimeDuration("08:00", "13:00", 0);
// Result: 5.0 hours

// Example 2: Full day with lunch break
const time2 = calculateTimeDuration("08:00", "17:00", 1.0);
// Result: 8.0 hours (9 hours - 1 hour lunch)

// Example 3: Afternoon shift with small pause
const time3 = calculateTimeDuration("14:00", "19:30", 0.5);
// Result: 5.0 hours (5.5 hours - 0.5 hour break)

// Example 4: Night shift (crossing midnight - needs special handling)
function calculateDurationWithMidnight(startTime, stopTime, pauseDuration = 0) {
  let start = new Date(`1970-01-01T${startTime}:00`);
  let stop = new Date(`1970-01-01T${stopTime}:00`);
  
  // If stop is before start, assume next day
  if (stop < start) {
    stop = new Date(`1970-01-02T${stopTime}:00`);
  }
  
  const diffMs = stop - start;
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.max(0, diffHours - pauseDuration);
}

const time4 = calculateDurationWithMidnight("22:00", "06:00", 0);
// Result: 8.0 hours

// Implementation in React component (useMemo):
const calculated = useMemo(() => {
  let totalTimeUsed = 0;

  if (formData.billingMethod === 'time') {
    if (formData.startTime && formData.stopTime) {
      const start = new Date(`1970-01-01T${formData.startTime}:00`);
      const stop = new Date(`1970-01-01T${formData.stopTime}:00`);
      
      // Handle overnight shifts
      if (stop < start) {
        stop.setDate(stop.getDate() + 1);
      }
      
      const diffMs = stop - start;
      const diffHours = diffMs / (1000 * 60 * 60);
      totalTimeUsed = Math.max(0, diffHours - formData.pauseDuration);
    }
  }
  
  return {
    totalTimeUsed: parseFloat(totalTimeUsed.toFixed(2)),
    totalWaterUsed: parseFloat((totalTimeUsed * 1000).toFixed(2)),
    amount: parseFloat((totalTimeUsed * formData.rate).toFixed(2))
  };
}, [formData.billingMethod, formData.startTime, formData.stopTime, formData.pauseDuration, formData.rate]);

// Validation:
if (formData.billingMethod === 'time') {
  if (!formData.startTime || !formData.stopTime) {
    toast.error('Please enter start and stop times');
    return;
  }
  
  const start = new Date(`1970-01-01T${formData.startTime}:00`);
  const stop = new Date(`1970-01-01T${formData.stopTime}:00`);
  
  if (stop <= start) {
    toast.error('Stop time must be after start time');
    return;
  }
}
```

##### Water Calculation (Optional/Future)
```javascript
// If water flow rate is known (e.g., 100 L/hour)
total_water_used = total_time_used × water_flow_rate;
```

##### Amount Calculation
```javascript
amount = total_time_used × rate;
```

#### Form Validation Rules
1. Farmer must be selected
2. Date cannot be in future (optional restriction)
3. For meter billing: end reading > start reading
4. For time billing: stop time > start time
5. Total time used must be > 0
6. Rate must be > 0
7. Amount must be >= 0

#### Form Submission
1. Validate all required fields
2. Calculate total_time_used
3. Calculate amount
4. Create supply_entry record in database
5. Update farmer's balance (balance -= amount)
6. Show success toast notification
7. Redirect to dashboard OR clear form for new entry

#### Mobile Optimizations
- Form grid: 1 column on mobile, 2 columns on desktop
- Input heights: h-10 (40px) on mobile, h-11 (44px) on desktop
- Toggle buttons: Touch-friendly with clear active states
- Summary panel: Compact on mobile with smaller text
- Submit buttons: Full width on mobile, auto width on desktop

---

### 3. Farmer Management
**Purpose**: Manage farmer accounts - add, edit, view, delete farmers

#### Main Components

##### A. Header Section
- Title: "Farmer Management"
- Subtitle: "Manage farmer accounts and profiles"
- Action Button: "+ Add Farmer" (opens dialog)

##### B. Farmers List Card
- **Header**:
  - Title: "All Farmers (count)"
  - Search bar: "Search by name, mobile, or location..."
  
- **Table View** (Desktop)
  - Columns:
    1. Name
    2. Mobile
    3. Contact (hidden on mobile)
    4. Location (hidden on mobile/tablet)
    5. Default Rate (₹/hour)
    6. Balance (₹) - Color coded: Red (negative), Green (positive), Gray (zero)
    7. Actions (Edit, Delete, View Profile, Receipt icons)

- **Card View** (Mobile)
  - Each farmer as a card showing:
    - Name + mobile in single line
    - Location
    - Rate and Balance
    - Action buttons (icon-only)

##### C. Add/Edit Farmer Dialog
**Form Fields**:

1. **Name**
   - Input type: Text
   - Required: Yes (*)
   - Validation: Min 2 characters, max 255 characters
   - Placeholder: "Enter farmer's full name"

2. **Mobile**
   - Input type: Tel
   - Required: Yes (*)
   - Validation: Exactly 10 digits (or country-specific format)
   - Format: Auto-format with spaces (e.g., "98765 43210")
   - Placeholder: "Enter mobile number"

3. **Farm Location**
   - Input type: Text
   - Required: No
   - Placeholder: "Enter farm location or address"
   - Max length: 500 characters

4. **Default Rate (₹/hour)**
   - Input type: Number (decimal)
   - Required: Yes (*)
   - Default: From global settings (₹60)
   - Min value: 0
   - Step: 0.01
   - Description: "This rate will be used by default for new supply entries"

**Action Buttons**:
- Submit: "Add Farmer" (create mode) or "Update Farmer" (edit mode)
- Cancel: Close dialog without saving

#### Farmer Operations

##### Add Farmer
1. Click "+ Add Farmer" button
2. Fill form fields
3. On submit:
   - Validate all fields
   - Create farmer record with balance = 0
   - Show success toast
   - Close dialog
   - Refresh farmers list

##### Edit Farmer
1. Click edit icon on farmer row
2. Dialog opens with pre-filled data
3. Modify fields
4. On submit:
   - Validate changes
   - Update farmer record
   - Show success toast
   - Refresh list

##### Delete Farmer
1. Click delete icon
2. Show confirmation dialog: "Are you sure? This will also delete all supply entries and payments for this farmer."
3. On confirm:
   - Delete farmer record (CASCADE deletes related entries)
   - Show success toast
   - Refresh list

##### View Profile
1. Click eye icon or farmer name
2. Navigate to Farmer Profile page
3. Show detailed view with transaction history

##### Generate Receipt
1. Click receipt icon
2. Open receipt dialog/modal
3. Show printable receipt with:
   - Business details
   - Farmer details
   - Account summary
   - Recent transactions

#### Search & Filter
- **Search**: Real-time filtering as user types
- **Search fields**: Name, mobile, location
- **Algorithm**: Case-insensitive substring matching
- **Empty state**: "No farmers found matching your search"

#### Data Requirements
- Fetch all farmers with calculated balance
- Balance calculation: `SUM(supply_entries.amount) - SUM(payments.amount)` per farmer
- Sort options: Name (A-Z), Balance (High to Low), Created date

#### Mobile Optimizations
- Search bar: Full width on mobile
- Action buttons: Icon-only on mobile (h-8 w-8), with text on desktop
- Hidden columns on smaller screens
- Touch-friendly spacing between rows

---

### 4. Farmer Profile (Detail View)
**Purpose**: Detailed view of a single farmer with complete transaction history

#### Page Sections

##### A. Header Section
- Back button: "← Back to Farmers"
- Farmer name (large, bold)
- Mobile number
- Farm location

##### B. Statistics Cards (4-card grid)
1. **Total Supplies**
   - Count of supply entries
   - Icon: Droplets
   
2. **Total Water Used**
   - Sum of all water in liters
   - Sub-info: Total hours
   - Icon: Clock
   
3. **Total Charges**
   - Sum of all supply amounts (₹)
   - Icon: IndianRupee
   
4. **Account Balance**
   - Current balance (₹)
   - Color: Red if negative, Green if positive
   - Icon: Wallet

##### C. Date Range Filters
- **From Date**: Date picker
- **To Date**: Date picker
- **Apply Button**: Filter transactions by date range
- **Clear Button**: Reset to all-time view

##### D. Supply Entries Table
**Columns** (Desktop):
1. Date
2. Time (hidden on mobile)
3. Billing Method (Meter/Time)
4. Total Time (hours)
5. Water Used (liters) - hidden on mobile
6. Rate (₹/hour)
7. Amount (₹)
8. Remarks - hidden on tablet and below
9. Actions (Edit, Delete)

**Mobile View**:
- Compact card layout
- Essential info: Date, Time, Amount
- Expand button for full details

**Features**:
- Sortable columns
- Pagination (10/20/50 per page)
- Total row at bottom showing sum of amounts
- Horizontal scroll on mobile

##### E. Payment History Table
**Columns**:
1. Date
2. Amount (₹)
3. Payment Method
4. Transaction ID
5. Remarks (hidden on mobile)
6. Actions (Delete)

**Mobile View**:
- Card layout
- Show date, amount, method

##### F. Quick Actions Panel
- **Add Supply Entry**: Button to quickly add new supply for this farmer
- **Record Payment**: Button to record new payment
- **Edit Farmer Details**: Edit farmer information
- **Print Statement**: Generate account statement

#### Supply Entry Edit/Delete
1. **Edit**:
   - Click edit icon
   - Open dialog with pre-filled supply data
   - Allow modifications
   - On save: Update entry, recalculate farmer balance
   
2. **Delete**:
   - Click delete icon
   - Confirm: "Delete this supply entry?"
   - On confirm: Delete entry, adjust farmer balance

#### Payment Operations
1. **Record Payment Dialog**:
   - Amount (₹) - required
   - Payment method dropdown: Cash, Bank Transfer, UPI, Cheque
   - Transaction ID (optional, for digital payments)
   - Date (default: today)
   - Remarks (optional)
   
2. **On Submit**:
   - Create payment record
   - Update farmer balance (balance += amount)
   - Show success toast

#### Data Requirements
- Fetch farmer details by ID
- Fetch all supply entries for this farmer (with date filter)
- Fetch all payments for this farmer (with date filter)
- Calculate statistics:
  - Total supplies count
  - Total water used
  - Total time used
  - Total charges
  - Total payments
  - Current balance

#### Mobile Optimizations
- Stats grid: 1 column → 2 columns → 4 columns
- Tables: Horizontal scroll with sticky first column
- Action buttons: Icon-only on mobile
- Date filters: Stacked vertically on mobile

---

### 5. Reports & Analytics
**Purpose**: Generate comprehensive reports, view summaries, export data

#### Report Sections

##### A. Report Filters Card
**Filter Options**:

1. **From Date**
   - Date picker
   - Default: First day of current month
   
2. **To Date**
   - Date picker
   - Default: Today
   
3. **Farmer Filter**
   - Dropdown: "All Farmers" or specific farmer
   - Default: All Farmers
   
4. **Action Buttons**:
   - "Generate Report": Apply filters
   - "Clear Filters": Reset to defaults
   - "Export to CSV": Download filtered data
   - "Print": Print-friendly view

##### B. Summary Statistics Cards (4-card grid)
1. **Total Entries**
   - Count of supply entries in date range
   
2. **Total Water Supplied**
   - Sum of water (liters) + hours
   
3. **Total Charges**
   - Sum of all supply amounts (₹)
   
4. **Total Collections**
   - Sum of all payments (₹)

##### C. Farmer-wise Summary Table
**Purpose**: Show summary for each farmer in the selected period

**Columns**:
1. Farmer Name
2. Contact (mobile) - hidden on mobile
3. Total Supplies (count)
4. Water Used (L) - hidden on tablet
5. Total Charges (₹)
6. Payments Received (₹) - hidden on mobile
7. Balance (₹) - color coded
8. Actions (View Profile, Receipt)

**Footer Row**:
- **Totals**: Grand total of all columns
- Bold formatting
- Sticky on scroll

**Features**:
- Sortable columns (click header to sort)
- Search/filter within results
- Export to CSV/Excel
- Print view

##### D. Charts & Visualizations (Future Enhancement)
1. **Supply Trend Line Chart**
   - X-axis: Dates
   - Y-axis: Total water supplied
   
2. **Revenue Pie Chart**
   - Breakdown by farmer
   
3. **Payment Collection Bar Chart**
   - Monthly collection trends

#### Export Functionality

##### CSV Export
**File Structure**:
```csv
Report Type,Water Supply Report
Generated On,2025-11-16 19:30:45
Period,2025-11-01 to 2025-11-16

Farmer Summary
Farmer Name,Mobile,Total Supplies,Water Used (L),Total Charges,Payments,Balance
John Doe,9876543210,15,15000,9000,7000,-2000
Jane Smith,9876543211,12,12000,7200,7200,0
...

Supply Entries
Date,Farmer,Time Used,Water Used,Rate,Amount,Remarks
2025-11-16,John Doe,5.50,5500,60,330,"Regular supply"
...

Payments
Date,Farmer,Amount,Method,Transaction ID,Remarks
2025-11-15,John Doe,1000,UPI,UPI123456,"Partial payment"
...
```

##### Print View
- Clean, printer-friendly layout
- No navigation/sidebar
- Business header with logo (if configured)
- Report title and date range
- Summary tables
- Footer with generation timestamp

#### Data Requirements
- Fetch supply entries filtered by:
  - Date range (from_date to to_date)
  - Farmer ID (if specific farmer selected)
- Fetch payments filtered by same criteria
- Group by farmer and calculate:
  - Count of supplies
  - Sum of water used
  - Sum of charges
  - Sum of payments
  - Balance per farmer
- Calculate grand totals

#### Mobile Optimizations
- Filters: Grid 1 column → 2 columns → 3 columns
- Summary cards: 1 column → 2 columns → 4 columns
- Table: Horizontal scroll, hide less important columns
- Export/Print buttons: Icon + text on desktop, icon-only on mobile

---

### 6. Settings
**Purpose**: Configure system settings, business information, data management

#### Settings Sections

##### A. Business Information Card
**Purpose**: Configure business/company details for receipts and reports

**Fields**:

1. **Business Name**
   - Input type: Text
   - Required: Yes (*)
   - Default: "Water Supply Management"
   - Used in: Receipts, reports, headers
   
2. **Business Address**
   - Input type: Textarea
   - Optional
   - Placeholder: "Enter your business address"
   - Rows: 3
   - Used in: Receipts, invoices
   
3. **Business Phone**
   - Input type: Tel
   - Optional
   - Format: 10 digits
   
4. **Business Email**
   - Input type: Email
   - Optional
   - Validation: Valid email format

**Action**: "Save Business Information" button

##### B. Default Settings Card
**Purpose**: Set default values used across the application

**Fields**:

1. **Default Hourly Rate (₹)**
   - Input type: Number (decimal)
   - Required: Yes (*)
   - Default: 60.00
   - Min: 0
   - Description: "This rate will be used as default for new farmers"
   
2. **Currency**
   - Input type: Select dropdown
   - Options: INR, USD, EUR, GBP, etc.
   - Default: INR
   
3. **Currency Symbol**
   - Input type: Text (1-5 characters)
   - Default: ₹
   - Auto-set based on currency selection

**Action**: "Save Default Settings" button

##### C. Regional Settings Card (Future)
**Fields**:

1. **Timezone**
   - Dropdown: List of timezones
   - Default: Asia/Kolkata (IST)
   
2. **Date Format**
   - Radio buttons: DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD
   
3. **Time Format**
   - Radio buttons: 12-hour, 24-hour

##### D. Data Management Card
**Purpose**: Backup, restore, and manage application data

**Features**:

1. **Backup Data**
   - Button: "Download Backup"
   - Action: Export all data as JSON file
   - Filename: `water-supply-backup-YYYY-MM-DD.json`
   - Includes: Farmers, supply entries, payments, settings
   
2. **Restore Data**
   - Button: "Restore from Backup"
   - Action: Open file picker
   - Validation: Verify JSON structure before restoring
   - Confirmation: "This will replace all existing data. Continue?"
   
3. **Data Summary**
   - Display (read-only):
     - Total Farmers: X
     - Total Supply Entries: Y
     - Total Payments: Z
     - Last Backup: Date/Time or "Never"

##### E. Danger Zone Card
**Purpose**: Destructive actions with confirmations

**Actions** (All with confirmation dialogs):

1. **Delete All Farmers**
   - Button: Red/destructive style
   - Confirmation: "This will delete all farmers and their related data. This action cannot be undone."
   - Also deletes: All supply entries and payments for those farmers
   
2. **Delete All Supply Entries**
   - Button: Red/destructive style
   - Confirmation: "Delete all supply entries? Farmer balances will be recalculated."
   
3. **Delete All Payments**
   - Button: Red/destructive style
   - Confirmation: "Delete all payment records? Farmer balances will be affected."
   
4. **Reset All Data**
   - Button: Red/destructive style (most dangerous)
   - Confirmation: "This will delete EVERYTHING and reset to factory defaults. Are you absolutely sure?"
   - Deletes: All farmers, supplies, payments
   - Resets: Settings to defaults

**Safety Features**:
- Double confirmation for destructive actions
- Require typing "DELETE" or "RESET" to confirm
- Auto-backup before major deletions

#### Data Management Flow

##### Backup Process
1. User clicks "Download Backup"
2. System gathers all data:
   ```javascript
   const backupData = {
     version: "1.0",
     exportedAt: new Date().toISOString(),
     farmers: [...],
     supplyEntries: [...],
     payments: [...],
     settings: {...}
   };
   ```
3. Convert to JSON with formatting
4. Create blob and trigger download
5. Show success toast with filename

##### Restore Process
1. User selects backup file
2. Read file content
3. Validate JSON structure
4. Confirm with user: "This will replace all data. Continue?"
5. On confirm:
   - Clear existing data
   - Import new data
   - Validate relationships (farmer IDs, etc.)
   - Recalculate balances
   - Reload application state
6. Show success or error message

#### Mobile Optimizations
- Cards: Full width on mobile
- Form inputs: h-10 on mobile, h-11 on desktop
- Buttons: Full width on mobile, auto width on desktop
- Danger zone: Stacked vertically on mobile
- Descriptions: Smaller text on mobile

---

## User Interface Design Guidelines

### Mobile-First Approach
1. **Design for mobile first** (320px width minimum)
2. **Progressive enhancement** for larger screens
3. **Touch targets**: Minimum 44px × 44px (iOS guideline)
4. **Responsive breakpoints**:
   - Mobile: < 640px (sm)
   - Tablet: 640px - 1024px (md - lg)
   - Desktop: > 1024px (xl)

### Typography Scale
```
Mobile → Desktop
- H1: text-2xl → text-3xl/4xl (24px → 36px/48px)
- H2: text-xl → text-2xl (20px → 24px)
- H3: text-lg → text-xl (18px → 20px)
- Body: text-sm → text-base (14px → 16px)
- Caption: text-xs → text-sm (12px → 14px)
```

### Spacing System
```
Mobile → Desktop
- Section spacing: space-y-4 → space-y-6/8 (16px → 24px/32px)
- Card padding: p-4 → p-6 (16px → 24px)
- Grid gaps: gap-3 → gap-4/6 (12px → 16px/24px)
- Margins: tight on mobile, generous on desktop
```

### Component States
1. **Default**: Normal appearance
2. **Hover**: Scale transform (desktop), shadow increase
3. **Active/Pressed**: Scale down slightly, shadow reduce
4. **Focus**: Visible focus ring (accessibility)
5. **Disabled**: Reduced opacity, no interactions
6. **Loading**: Spinner or skeleton states

### Color System
```
Primary: Default theme primary color
Secondary: Muted/gray tones
Success: Green (#22c55e)
Warning: Orange (#f97316)
Error/Destructive: Red (#ef4444)
Muted: Gray (#6b7280)
Background: White/light gray gradient
```

### Animations & Transitions
```css
/* Smooth transitions */
transition-all duration-200 ease-in-out

/* Hover scale */
hover:scale-[1.01] active:scale-[0.98]

/* Shadow transitions */
shadow-sm hover:shadow-md transition-shadow

/* Slide animations */
translate-x-0 / -translate-x-full (sidebar)
```

---

## Data Flow & State Management

### Current Implementation (V1 - Context API)
```
┌─────────────────────────────────────┐
│       Component (e.g., Dashboard)   │
│  - Reads data via useData() hook   │
│  - Calls action functions          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         DataContext Provider        │
│  - Manages state (useState)         │
│  - Provides data & actions          │
│  - Syncs with localStorage          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│          LocalStorage               │
│  - Persists data                    │
│  - Keys: farmers, supplyEntries,    │
│           payments, settings        │
└─────────────────────────────────────┘
```

### Future Implementation (V2 - External DB)
```
┌─────────────────────────────────────┐
│       Component                     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│    React Query / SWR                │
│  - Data fetching & caching          │
│  - Optimistic updates               │
│  - Auto-refetch on focus            │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│        API Client (Axios/Fetch)     │
│  - HTTP requests                    │
│  - Error handling                   │
│  - Token management                 │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│     Backend API (Node.js)           │
│  - Authentication                   │
│  - Business logic                   │
│  - Database queries                 │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│    PostgreSQL (Neon DB)             │
└─────────────────────────────────────┘
```

---

## API Endpoints (Version 2)

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login
POST   /api/auth/logout            - Logout
POST   /api/auth/refresh-token     - Refresh JWT
GET    /api/auth/me                - Get current user
```

### Farmers
```
GET    /api/farmers                - List all farmers (with pagination, search, filters)
GET    /api/farmers/:id            - Get farmer by ID (with balance calculation)
POST   /api/farmers                - Create new farmer
PUT    /api/farmers/:id            - Update farmer
DELETE /api/farmers/:id            - Delete farmer (cascade delete related data)
GET    /api/farmers/:id/summary    - Get farmer summary stats
GET    /api/farmers/:id/statement  - Get account statement (date range)
```

### Supply Entries
```
GET    /api/supply-entries         - List all supply entries (with filters, pagination)
GET    /api/supply-entries/:id     - Get supply entry by ID
POST   /api/supply-entries         - Create new supply entry
PUT    /api/supply-entries/:id     - Update supply entry
DELETE /api/supply-entries/:id     - Delete supply entry
GET    /api/supply-entries/recent  - Get recent entries (dashboard)
```

### Payments
```
GET    /api/payments               - List all payments (with filters, pagination)
GET    /api/payments/:id           - Get payment by ID
POST   /api/payments               - Create new payment
DELETE /api/payments/:id           - Delete payment
GET    /api/payments/recent        - Get recent payments (dashboard)
```

### Reports
```
GET    /api/reports/summary        - Get summary statistics (date range, farmer filter)
GET    /api/reports/farmer-wise    - Get farmer-wise summary
GET    /api/reports/export         - Export data as CSV/Excel
```

### Settings
```
GET    /api/settings               - Get user settings
PUT    /api/settings               - Update settings
```

### Data Management
```
POST   /api/data/backup            - Create backup (returns JSON)
POST   /api/data/restore           - Restore from backup (upload JSON)
DELETE /api/data/reset              - Reset all data (requires confirmation)
```

---

## Mobile Application Specific Requirements

### Progressive Web App (PWA) Features
1. **Installable**: Add to home screen on mobile
2. **Offline Support**: Service worker for offline functionality
3. **App-like Experience**: Full-screen mode, splash screen
4. **Push Notifications**: (Future) Payment reminders, due notifications

### Mobile-Specific Features
1. **Touch Gestures**:
   - Swipe to delete entries
   - Pull to refresh lists
   - Pinch to zoom charts
   
2. **Camera Integration** (Future):
   - Scan meter readings via OCR
   - Take photos of receipts
   
3. **Location Services** (Future):
   - Auto-fill farm location using GPS
   - Map view of farmer locations
   
4. **Native Features**:
   - Share receipts via WhatsApp, Email
   - Call farmer directly from app (tel: link)
   - SMS integration for payment reminders

### Performance Optimization
1. **Lazy Loading**: Load components on demand
2. **Virtual Scrolling**: For large lists (>100 items)
3. **Image Optimization**: Compress, lazy load images
4. **Code Splitting**: Separate chunks for each route
5. **Caching Strategy**: Cache API responses, static assets

### Offline Functionality
1. **Local Database**: IndexedDB for offline data storage
2. **Sync Queue**: Queue actions when offline, sync when online
3. **Conflict Resolution**: Handle conflicts when data synced
4. **Offline Indicator**: Show connection status in UI

---

## Testing Requirements

### Unit Tests
- Test utility functions (meter conversion, date calculations)
- Test form validations
- Test balance calculations

### Integration Tests
- Test complete user flows (add farmer → add supply → view dashboard)
- Test data persistence (localStorage/database)
- Test API endpoints (V2)

### E2E Tests (Playwright/Cypress)
- Test full application workflows
- Test responsive layouts
- Test mobile-specific interactions

### Accessibility Tests
- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios
- ARIA labels

---

## Security Considerations (Version 2)

### Authentication & Authorization
1. **JWT-based auth** with refresh tokens
2. **Role-based access control** (admin, operator, viewer)
3. **Password hashing** with bcrypt (min 12 rounds)
4. **Rate limiting** on API endpoints
5. **CSRF protection** for state-changing operations

### Data Security
1. **Input validation** on both client and server
2. **SQL injection prevention** (use parameterized queries/ORM)
3. **XSS protection** (sanitize user inputs)
4. **HTTPS only** in production
5. **Secure headers** (CSP, X-Frame-Options, etc.)

### Privacy
1. **Data encryption** at rest (database level)
2. **Audit logs** for sensitive operations
3. **GDPR compliance** (if applicable)
4. **Data export** for users
5. **Right to deletion**

---

## Deployment Guidelines

### Frontend Deployment
**Options**:
- Vercel (recommended for React + Vite)
- Netlify
- AWS Amplify
- GitHub Pages (static only)

**Environment Variables**:
```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Water Supply Management
VITE_VERSION=2.0.0
```

### Backend Deployment
**Options**:
- Railway
- Render
- Fly.io
- AWS (ECS, Lambda)
- DigitalOcean App Platform

**Environment Variables**:
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-secret-key
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://yourfrontend.com
```

### Database (Neon DB)
1. Create Neon project
2. Copy connection string
3. Run migrations (Prisma/Drizzle)
4. Set up automatic backups
5. Monitor query performance

---

## Future Enhancements

### Phase 1 (Core Features)
- ✅ Farmer management
- ✅ Supply entry tracking
- ✅ Payment recording
- ✅ Basic reports
- ✅ Mobile-responsive UI

### Phase 2 (Database Integration)
- 🔄 PostgreSQL database (Neon DB)
- 🔄 REST API backend
- 🔄 User authentication
- 🔄 Multi-user support
- 🔄 Cloud data sync

### Phase 3 (Advanced Features)
- ⏳ SMS notifications for payment reminders
- ⏳ WhatsApp integration for receipts
- ⏳ Advanced analytics & charts
- ⏳ Automated recurring billing
- ⏳ Bulk import/export (Excel, CSV)

### Phase 4 (Mobile Native)
- ⏳ React Native mobile app
- ⏳ Offline-first architecture
- ⏳ Biometric authentication
- ⏳ OCR for meter reading
- ⏳ GPS-based location tracking

### Phase 5 (Enterprise)
- ⏳ Multi-tenant architecture
- ⏳ Advanced role management
- ⏳ Custom branding per tenant
- ⏳ API for third-party integrations
- ⏳ Advanced reporting & BI

---

## Implementation Checklist for V2

### Setup
- [ ] Initialize new project with Vite + React + TypeScript
- [ ] Set up Tailwind CSS v4.1.3
- [ ] Install Radix UI components
- [ ] Configure ESLint + Prettier
- [ ] Set up Git repository

### Database
- [ ] Create Neon DB project
- [ ] Set up Prisma/Drizzle ORM
- [ ] Create database schema (tables above)
- [ ] Write database migrations
- [ ] Seed initial data (settings, admin user)

### Backend API
- [ ] Initialize Node.js + Express/Fastify
- [ ] Set up JWT authentication
- [ ] Implement all API endpoints
- [ ] Add input validation (Zod/Yup)
- [ ] Implement error handling
- [ ] Add rate limiting
- [ ] Write API documentation (Swagger)

### Frontend
- [ ] Create component structure
- [ ] Implement routing (React Router)
- [ ] Build Dashboard page
- [ ] Build Supply Entry Form
- [ ] Build Farmer Management
- [ ] Build Farmer Profile
- [ ] Build Reports page
- [ ] Build Settings page
- [ ] Implement authentication UI
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Implement toast notifications

### Mobile Optimization
- [ ] Test on various screen sizes
- [ ] Add touch gestures
- [ ] Optimize for performance
- [ ] Add PWA manifest
- [ ] Implement service worker
- [ ] Test offline functionality

### Testing
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Set up E2E testing
- [ ] Test accessibility
- [ ] Performance testing

### Deployment
- [ ] Deploy backend to Railway/Render
- [ ] Deploy frontend to Vercel
- [ ] Set up CI/CD pipeline
- [ ] Configure domain & SSL
- [ ] Set up monitoring (Sentry)
- [ ] Set up analytics

---

## Key Formulas & Calculations

### Meter Reading to Hours
```javascript
function convertMeterToHours(reading) {
  const hours = Math.floor(reading);
  const minutes = Math.round((reading - hours) * 100);
  return hours + (minutes / 60);
}

// Example: 
// Input: 5.30 (5 hours 30 minutes)
// Output: 5.5 hours
```

### Time-based Duration
```javascript
function calculateTimeDuration(startTime, stopTime, pauseDuration = 0) {
  const start = new Date(`1970-01-01T${startTime}`);
  const stop = new Date(`1970-01-01T${stopTime}`);
  const diffMs = stop - start;
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.max(0, diffHours - pauseDuration);
}

// Example:
// Start: 08:00, Stop: 13:30, Pause: 0.5
// Duration: 5.5 - 0.5 = 5.0 hours
```

### Amount Calculation
```javascript
const amount = totalTimeUsed * ratePerHour;

// Example:
// Time: 5.5 hours, Rate: ₹60/hour
// Amount: 5.5 × 60 = ₹330
```

### Farmer Balance Calculation
```javascript
/**
 * Calculate farmer's current account balance
 * 
 * Balance Logic:
 * - Balance = Total Payments - Total Charges
 * - Negative balance = Farmer owes money (shown in red)
 * - Positive balance = Farmer has credit/advance (shown in green)
 * - Zero balance = Account settled (shown in gray)
 * 
 * This is calculated dynamically whenever:
 * 1. New supply entry is added (balance decreases)
 * 2. Supply entry is deleted (balance increases)
 * 3. Payment is recorded (balance increases)
 * 4. Payment is deleted (balance decreases)
 */

// Method 1: Calculate from scratch (used in DataContext)
function calculateFarmerBalance(farmerId, supplyEntries, payments) {
  // Sum all charges for this farmer
  const totalCharges = supplyEntries
    .filter(entry => entry.farmerId === farmerId)
    .reduce((sum, entry) => sum + entry.amount, 0);
  
  // Sum all payments from this farmer
  const totalPayments = payments
    .filter(payment => payment.farmerId === farmerId)
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  // Calculate balance
  const balance = totalPayments - totalCharges;
  
  return parseFloat(balance.toFixed(2));
}

// Method 2: Update balance incrementally (optimized)
function updateFarmerBalance(farmer, action, amount) {
  switch(action) {
    case 'ADD_SUPPLY':
      return farmer.balance - amount;  // Charge reduces balance
    case 'DELETE_SUPPLY':
      return farmer.balance + amount;  // Removing charge increases balance
    case 'ADD_PAYMENT':
      return farmer.balance + amount;  // Payment increases balance
    case 'DELETE_PAYMENT':
      return farmer.balance - amount;  // Removing payment decreases balance
    default:
      return farmer.balance;
  }
}

// Real implementation from DataContext.tsx:
const addSupplyEntry = (entry: Omit<SupplyEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newEntry = {
    id: crypto.randomUUID(),
    ...entry,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  setSupplyEntries(prev => [...prev, newEntry]);
  
  // Update farmer balance
  setFarmers(prev => prev.map(f => 
    f.id === entry.farmerId 
      ? { ...f, balance: f.balance - entry.amount }  // Charge reduces balance
      : f
  ));
  
  toast.success('Supply entry added successfully');
};

const addPayment = (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newPayment = {
    id: crypto.randomUUID(),
    ...payment,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  setPayments(prev => [...prev, newPayment]);
  
  // Update farmer balance
  setFarmers(prev => prev.map(f => 
    f.id === payment.farmerId 
      ? { ...f, balance: f.balance + payment.amount }  // Payment increases balance
      : f
  ));
  
  toast.success('Payment recorded successfully');
};

// Display logic:
function getBalanceColor(balance) {
  if (balance < 0) return 'text-red-600';      // Owes money
  if (balance > 0) return 'text-green-600';    // Has credit
  return 'text-muted-foreground';              // Settled
}

function getBalanceStatus(balance) {
  if (balance < 0) return 'Due';
  if (balance > 0) return 'Credit';
  return 'Settled';
}

// Usage in component:
<span className={getBalanceColor(farmer.balance)}>
  ₹{Math.abs(farmer.balance).toLocaleString()}
</span>
<Badge variant={balance < 0 ? 'destructive' : 'success'}>
  {getBalanceStatus(farmer.balance)}
</Badge>

// Examples:
// Farmer A: Charges ₹10,000, Payments ₹7,500 → Balance: -₹2,500 (Owes)
// Farmer B: Charges ₹5,000, Payments ₹6,000 → Balance: +₹1,000 (Credit)
// Farmer C: Charges ₹3,000, Payments ₹3,000 → Balance: ₹0 (Settled)
```

**Balance Validation & Recalculation:**
```javascript
// Periodic balance validation (to ensure data integrity)
function validateAndRecalculateBalances(farmers, supplyEntries, payments) {
  return farmers.map(farmer => {
    const calculatedBalance = calculateFarmerBalance(
      farmer.id,
      supplyEntries,
      payments
    );
    
    if (Math.abs(farmer.balance - calculatedBalance) > 0.01) {
      console.warn(`Balance mismatch for ${farmer.name}. Recalculating...`);
      return { ...farmer, balance: calculatedBalance };
    }
    
    return farmer;
  });
}

// Run on app startup or periodically
useEffect(() => {
  const validated = validateAndRecalculateBalances(farmers, supplyEntries, payments);
  if (JSON.stringify(validated) !== JSON.stringify(farmers)) {
    setFarmers(validated);
    toast.info('Balances have been recalculated');
  }
}, []);  // Run once on mount
```

### Collection Percentage
```javascript
const collectionRate = (totalPayments / totalCharges) * 100;

// Example:
// Charges: ₹10,000, Payments: ₹7,500
// Collection: 75%
```

---

## Conclusion

This document provides a comprehensive specification for rebuilding the Water Supply Management System from scratch with a mobile-first approach and database integration. Use this as a complete reference for development, ensuring all features, validations, calculations, and UI/UX guidelines are implemented exactly as specified.

**Key Highlights**:
- ✅ Complete database schema for PostgreSQL
- ✅ Detailed breakdown of all 6 sections
- ✅ Mobile-first responsive design guidelines
- ✅ Automatic calculations and validations
- ✅ API endpoints structure
- ✅ Security and deployment guidelines
- ✅ Future enhancement roadmap

**Ready for**: Vibe Coding, Cursor, or any AI-assisted development tool to build the complete application.
