import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import type { Farmer, SupplyEntry, Payment, Settings } from '@/types';

interface DataContextType {
  farmers: Farmer[];
  supplyEntries: SupplyEntry[];
  payments: Payment[];
  settings: Settings;
  addFarmer: (farmer: Omit<Farmer, 'id' | 'balance' | 'createdAt' | 'updatedAt'>) => void;
  updateFarmer: (id: string, farmer: Partial<Farmer>) => void;
  deleteFarmer: (id: string) => void;
  addSupplyEntry: (entry: Omit<SupplyEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSupplyEntry: (id: string, entry: Partial<SupplyEntry>) => void;
  deleteSupplyEntry: (id: string) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deletePayment: (id: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  recalculateFarmerBalance: (farmerId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultSettings: Settings = {
  businessName: 'Water Supply Management',
  businessAddress: '',
  businessPhone: '',
  businessEmail: '',
  defaultHourlyRate: 60,
  currency: 'INR',
  currencySymbol: '₹',
  waterFlowRate: 1000,
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [supplyEntries, setSupplyEntries] = useState<SupplyEntry[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedFarmers = localStorage.getItem('farmers');
    const loadedSupplyEntries = localStorage.getItem('supplyEntries');
    const loadedPayments = localStorage.getItem('payments');
    const loadedSettings = localStorage.getItem('settings');

    if (loadedFarmers) setFarmers(JSON.parse(loadedFarmers));
    if (loadedSupplyEntries) setSupplyEntries(JSON.parse(loadedSupplyEntries));
    if (loadedPayments) setPayments(JSON.parse(loadedPayments));
    if (loadedSettings) setSettings(JSON.parse(loadedSettings));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('farmers', JSON.stringify(farmers));
  }, [farmers]);

  useEffect(() => {
    localStorage.setItem('supplyEntries', JSON.stringify(supplyEntries));
  }, [supplyEntries]);

  useEffect(() => {
    localStorage.setItem('payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  // Farmer operations
  const addFarmer = (farmer: Omit<Farmer, 'id' | 'balance' | 'createdAt' | 'updatedAt'>) => {
    const newFarmer: Farmer = {
      id: crypto.randomUUID(),
      ...farmer,
      balance: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFarmers(prev => [...prev, newFarmer]);
    toast.success('Farmer added successfully');
  };

  const updateFarmer = (id: string, updates: Partial<Farmer>) => {
    setFarmers(prev =>
      prev.map(f =>
        f.id === id
          ? { ...f, ...updates, updatedAt: new Date().toISOString() }
          : f
      )
    );
    toast.success('Farmer updated successfully');
  };

  const deleteFarmer = (id: string) => {
    setFarmers(prev => prev.filter(f => f.id !== id));
    setSupplyEntries(prev => prev.filter(s => s.farmerId !== id));
    setPayments(prev => prev.filter(p => p.farmerId !== id));
    toast.success('Farmer deleted successfully');
  };

  // Supply entry operations
  const addSupplyEntry = (entry: Omit<SupplyEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: SupplyEntry = {
      id: crypto.randomUUID(),
      ...entry,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSupplyEntries(prev => [...prev, newEntry]);
    
    // Update farmer balance
    setFarmers(prev =>
      prev.map(f =>
        f.id === entry.farmerId
          ? { ...f, balance: f.balance - entry.amount, updatedAt: new Date().toISOString() }
          : f
      )
    );
    toast.success('Supply entry added successfully');
  };

  const updateSupplyEntry = (id: string, updates: Partial<SupplyEntry>) => {
    const oldEntry = supplyEntries.find(s => s.id === id);
    if (!oldEntry) return;

    const newEntry = { ...oldEntry, ...updates, updatedAt: new Date().toISOString() };
    setSupplyEntries(prev => prev.map(s => (s.id === id ? newEntry : s)));

    // Recalculate farmer balance
    if (oldEntry.amount !== newEntry.amount) {
      setFarmers(prev =>
        prev.map(f =>
          f.id === oldEntry.farmerId
            ? {
                ...f,
                balance: f.balance + oldEntry.amount - newEntry.amount,
                updatedAt: new Date().toISOString(),
              }
            : f
        )
      );
    }
    toast.success('Supply entry updated successfully');
  };

  const deleteSupplyEntry = (id: string) => {
    const entry = supplyEntries.find(s => s.id === id);
    if (!entry) return;

    setSupplyEntries(prev => prev.filter(s => s.id !== id));
    
    // Update farmer balance
    setFarmers(prev =>
      prev.map(f =>
        f.id === entry.farmerId
          ? { ...f, balance: f.balance + entry.amount, updatedAt: new Date().toISOString() }
          : f
      )
    );
    toast.success('Supply entry deleted successfully');
  };

  // Payment operations
  const addPayment = (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPayment: Payment = {
      id: crypto.randomUUID(),
      ...payment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPayments(prev => [...prev, newPayment]);
    
    // Update farmer balance
    setFarmers(prev =>
      prev.map(f =>
        f.id === payment.farmerId
          ? { ...f, balance: f.balance + payment.amount, updatedAt: new Date().toISOString() }
          : f
      )
    );
    toast.success('Payment recorded successfully');
  };

  const deletePayment = (id: string) => {
    const payment = payments.find(p => p.id === id);
    if (!payment) return;

    setPayments(prev => prev.filter(p => p.id !== id));
    
    // Update farmer balance
    setFarmers(prev =>
      prev.map(f =>
        f.id === payment.farmerId
          ? { ...f, balance: f.balance - payment.amount, updatedAt: new Date().toISOString() }
          : f
      )
    );
    toast.success('Payment deleted successfully');
  };

  // Settings operations
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    toast.success('Settings updated successfully');
  };

  // Recalculate farmer balance from scratch
  const recalculateFarmerBalance = (farmerId: string) => {
    const farmerSupplies = supplyEntries.filter(s => s.farmerId === farmerId);
    const farmerPayments = payments.filter(p => p.farmerId === farmerId);
    
    const totalCharges = farmerSupplies.reduce((sum, s) => sum + s.amount, 0);
    const totalPayments = farmerPayments.reduce((sum, p) => sum + p.amount, 0);
    const balance = totalPayments - totalCharges;

    setFarmers(prev =>
      prev.map(f =>
        f.id === farmerId
          ? { ...f, balance, updatedAt: new Date().toISOString() }
          : f
      )
    );
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
    deletePayment,
    updateSettings,
    recalculateFarmerBalance,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
