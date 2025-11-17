// Core types for Water Supply Management System

export interface Farmer {
  id: string;
  name: string;
  mobile: string;
  farmLocation: string;
  defaultRate: number;
  balance: number;
  totalSupplies?: number;
  totalWaterUsed?: number;
  totalHours?: number;
  lastSupplyDate?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplyEntry {
  id: string;
  farmerId: string;
  farmerName?: string;
  date: string;
  billingMethod: 'meter' | 'time';
  
  // Meter-based fields
  meterReadingStart?: number;
  meterReadingEnd?: number;
  
  // Time-based fields
  startTime?: string;
  stopTime?: string;
  pauseDuration?: number;
  
  // Common fields
  totalTimeUsed: number;
  waterUsed?: number;
  rate: number;
  amount: number;
  remarks?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  farmerId: string;
  farmerName?: string;
  paymentDate: string;
  amount: number;
  paymentMethod: 'cash' | 'upi' | 'bank_transfer' | 'cheque' | 'other';
  transactionId?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  businessName: string;
  contactNumber: string;
  email: string;
  address: string;
  defaultRate: number;
  currency: string;
  dateFormat: string;
  waterFlowRate?: number;
}

export interface DashboardStats {
  totalFarmers: number;
  totalWaterSupplied: number;
  totalHours: number;
  totalCharges: number;
  totalPayments: number;
  pendingDues: number;
  todayRevenue: number;
  todaySupplies: number;
}

export interface FarmerStats {
  totalSupplies: number;
  totalWaterUsed: number;
  totalHours: number;
  totalCharges: number;
  totalPayments: number;
  currentBalance: number;
}

export interface ReportFilter {
  fromDate: string;
  toDate: string;
  farmerId?: string;
}

export interface FarmerReport {
  farmerId: string;
  farmerName: string;
  mobile: string;
  totalSupplies: number;
  waterUsed: number;
  totalCharges: number;
  paymentsReceived: number;
  balance: number;
}

// Form data types
export interface SupplyFormData {
  farmerId: string;
  date: string;
  billingMethod: 'meter' | 'time';
  meterReadingStart: string;
  meterReadingEnd: string;
  startTime: string;
  stopTime: string;
  pauseDuration: string;
  rate: string;
  remarks: string;
}

export interface FarmerFormData {
  name: string;
  mobile: string;
  farmLocation: string;
  defaultRate: string;
}

export interface PaymentFormData {
  farmerId: string;
  paymentDate: string;
  amount: string;
  paymentMethod: 'cash' | 'upi' | 'bank_transfer' | 'cheque' | 'other';
  transactionId: string;
  remarks: string;
}
