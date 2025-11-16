export interface Farmer {
  id: string;
  name: string;
  mobile: string;
  farmLocation: string;
  defaultRate: number;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface SupplyEntry {
  id: string;
  farmerId: string;
  date: string;
  billingMethod: 'meter' | 'time';
  startTime?: string;
  stopTime?: string;
  pauseDuration: number;
  meterReadingStart: number;
  meterReadingEnd: number;
  totalTimeUsed: number;
  totalWaterUsed: number;
  rate: number;
  amount: number;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  farmerId: string;
  amount: number;
  paymentMethod?: string;
  transactionId?: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  businessName: string;
  businessAddress: string;
  businessPhone?: string;
  businessEmail?: string;
  defaultHourlyRate: number;
  currency: string;
  currencySymbol: string;
  waterFlowRate?: number;
}

export interface DashboardStats {
  totalFarmers: number;
  farmersWithDues: number;
  totalWaterSupplied: number;
  totalHours: number;
  totalIncome: number;
  totalCharges: number;
  pendingDues: number;
  collectionRate: number;
}

export interface FarmerSummary {
  farmerId: string;
  farmerName: string;
  mobile: string;
  totalSupplies: number;
  totalWaterUsed: number;
  totalCharges: number;
  totalPayments: number;
  balance: number;
}
