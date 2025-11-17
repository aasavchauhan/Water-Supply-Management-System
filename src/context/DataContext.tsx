import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Farmer, SupplyEntry, Payment, Settings } from '@/types';
import { calculateFarmerBalance, getTodayDate } from '@/utils/calculations';

interface DataContextType {
  farmers: Farmer[];
  supplyEntries: SupplyEntry[];
  payments: Payment[];
  settings: Settings;
  addFarmer: (farmer: Omit<Farmer, 'id' | 'createdAt' | 'updatedAt' | 'balance'>) => void;
  updateFarmer: (id: string, farmer: Partial<Farmer>) => void;
  deleteFarmer: (id: string) => void;
  addSupplyEntry: (entry: Omit<SupplyEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSupplyEntry: (id: string, entry: Partial<SupplyEntry>) => void;
  deleteSupplyEntry: (id: string) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  refreshBalances: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  FARMERS: 'farmers',
  SUPPLY_ENTRIES: 'supplyEntries',
  PAYMENTS: 'payments',
  SETTINGS: 'settings',
};

const defaultSettings: Settings = {
  businessName: 'Kumar Water Supply Services',
  contactNumber: '',
  email: '',
  address: '',
  defaultRate: 100.00,
  currency: 'INR',
  dateFormat: 'dd/MM/yyyy',
  waterFlowRate: 1000,
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [supplyEntries, setSupplyEntries] = useState<SupplyEntry[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedFarmers = localStorage.getItem(STORAGE_KEYS.FARMERS);
    const loadedEntries = localStorage.getItem(STORAGE_KEYS.SUPPLY_ENTRIES);
    const loadedPayments = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    const loadedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);

    if (loadedFarmers) setFarmers(JSON.parse(loadedFarmers));
    if (loadedEntries) setSupplyEntries(JSON.parse(loadedEntries));
    if (loadedPayments) setPayments(JSON.parse(loadedPayments));
    if (loadedSettings) setSettings(JSON.parse(loadedSettings));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify(farmers));
  }, [farmers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPLY_ENTRIES, JSON.stringify(supplyEntries));
  }, [supplyEntries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Refresh farmer balances
  const refreshBalances = () => {
    setFarmers(prev => prev.map(farmer => {
      const farmerSupplies = supplyEntries.filter(e => e.farmerId === farmer.id);
      const farmerPayments = payments.filter(p => p.farmerId === farmer.id);
      const balance = calculateFarmerBalance(farmerSupplies, farmerPayments);
      
      return {
        ...farmer,
        balance,
        totalSupplies: farmerSupplies.length,
        totalWaterUsed: farmerSupplies.reduce((sum, e) => sum + (e.waterUsed || 0), 0),
        totalHours: farmerSupplies.reduce((sum, e) => sum + e.totalTimeUsed, 0),
        lastSupplyDate: farmerSupplies.length > 0 
          ? farmerSupplies.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date 
          : undefined,
      };
    }));
  };

  // Farmer operations
  const addFarmer = (farmer: Omit<Farmer, 'id' | 'createdAt' | 'updatedAt' | 'balance'>) => {
    const now = new Date().toISOString();
    const newFarmer: Farmer = {
      ...farmer,
      id: uuidv4(),
      balance: 0,
      totalSupplies: 0,
      totalWaterUsed: 0,
      totalHours: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    setFarmers(prev => [...prev, newFarmer]);
  };

  const updateFarmer = (id: string, updates: Partial<Farmer>) => {
    setFarmers(prev => prev.map(farmer => 
      farmer.id === id 
        ? { ...farmer, ...updates, updatedAt: new Date().toISOString() } 
        : farmer
    ));
  };

  const deleteFarmer = (id: string) => {
    setFarmers(prev => prev.filter(farmer => farmer.id !== id));
    setSupplyEntries(prev => prev.filter(entry => entry.farmerId !== id));
    setPayments(prev => prev.filter(payment => payment.farmerId !== id));
  };

  // Supply Entry operations
  const addSupplyEntry = (entry: Omit<SupplyEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const farmer = farmers.find(f => f.id === entry.farmerId);
    const newEntry: SupplyEntry = {
      ...entry,
      id: uuidv4(),
      farmerName: farmer?.name,
      createdAt: now,
      updatedAt: now,
    };
    setSupplyEntries(prev => [...prev, newEntry]);
    setTimeout(refreshBalances, 100);
  };

  const updateSupplyEntry = (id: string, updates: Partial<SupplyEntry>) => {
    setSupplyEntries(prev => prev.map(entry => 
      entry.id === id 
        ? { ...entry, ...updates, updatedAt: new Date().toISOString() } 
        : entry
    ));
    setTimeout(refreshBalances, 100);
  };

  const deleteSupplyEntry = (id: string) => {
    setSupplyEntries(prev => prev.filter(entry => entry.id !== id));
    setTimeout(refreshBalances, 100);
  };

  // Payment operations
  const addPayment = (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const farmer = farmers.find(f => f.id === payment.farmerId);
    const newPayment: Payment = {
      ...payment,
      id: uuidv4(),
      farmerName: farmer?.name,
      createdAt: now,
      updatedAt: now,
    };
    setPayments(prev => [...prev, newPayment]);
    setTimeout(refreshBalances, 100);
  };

  const updatePayment = (id: string, updates: Partial<Payment>) => {
    setPayments(prev => prev.map(payment => 
      payment.id === id 
        ? { ...payment, ...updates, updatedAt: new Date().toISOString() } 
        : payment
    ));
    setTimeout(refreshBalances, 100);
  };

  const deletePayment = (id: string) => {
    setPayments(prev => prev.filter(payment => payment.id !== id));
    setTimeout(refreshBalances, 100);
  };

  // Settings operations
  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const value: DataContextType = {
    farmers,
    supplyEntries,
    payments,
    settings,
    addFarmer,
    updateFarmer,
    deleteFarmer,
    addSupplyEntry,
    updateSupplyEntry,
    deleteSupplyEntry,
    addPayment,
    updatePayment,
    deletePayment,
    updateSettings,
    refreshBalances,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
