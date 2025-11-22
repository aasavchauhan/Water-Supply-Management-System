export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  isActive: boolean;
  password?: string; // Only used for auth, never exposed to frontend
}

export interface Farmer {
  id: string;
  userId: string | null;
  name: string;
  mobile: string;
  farmLocation: string | null;
  defaultRate: number;
  balance: number; // negative = due, positive = advance
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface SupplyEntry {
  id: string;
  userId: string | null;
  farmerId: string;
  date: string;
  billingMethod: 'time' | 'meter';
  startTime: string | null;
  stopTime: string | null;
  pauseDuration: number; // in hours (for time-based billing)
  meterReadingStart: number; // in h.mm format (e.g., 5.30 = 5h 30m)
  meterReadingEnd: number; // in h.mm format
  totalWaterUsed: number; // liters (calculated)
  totalTimeUsed: number; // in hours (calculated)
  rate: number; // ₹/hour
  amount: number; // calculated: totalTimeUsed × rate
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  userId: string | null;
  farmerId: string;
  paymentDate: string;
  amount: number;
  paymentMethod: string | null;
  transactionId: string | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id: string;
  userId: string;
  businessName: string;
  businessAddress: string | null;
  businessPhone: string | null;
  businessEmail: string | null;
  defaultHourlyRate: number;
  currency: string;
  currencySymbol: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  oldValues: Record<string, any> | null;
  newValues: Record<string, any> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}
