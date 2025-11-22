import React, { createContext, useContext, useState, useEffect } from 'react';
import { Farmer, SupplyEntry, Payment, Settings } from '../types';
import { apiService } from '../services/api.service';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface DataContextType {
  farmers: Farmer[];
  supplyEntries: SupplyEntry[];
  payments: Payment[];
  settings: Settings | null;
  isLoading: boolean;
  addFarmer: (farmer: Omit<Farmer, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'balance' | 'isActive'>) => Promise<void>;
  updateFarmer: (id: string, farmer: Partial<Farmer>) => Promise<void>;
  deleteFarmer: (id: string) => Promise<void>;
  addSupplyEntry: (entry: Omit<SupplyEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  getFarmerById: (id: string) => Farmer | undefined;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_SETTINGS: Partial<Settings> = {
  defaultHourlyRate: 100,
  businessName: 'Water Irrigation Supply',
  currency: 'INR',
  currencySymbol: '₹',
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [supplyEntries, setSupplyEntries] = useState<SupplyEntry[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [settings, setSettings] = useState<Settings | null>({
    id: 'temp',
    userId: '',
    defaultHourlyRate: 100,
    businessName: 'Water Irrigation Supply',
    currency: 'INR',
    currencySymbol: '₹',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    if (!isAuthenticated || !user) return;
    
    setIsLoading(true);
    try {
      const [fetchedFarmers, fetchedEntries, fetchedPayments, fetchedSettings] = await Promise.all([
        apiService.getFarmers(),
        apiService.getSupplyEntries(),
        apiService.getPayments(),
        apiService.getSettings(),
      ]);

      setFarmers(fetchedFarmers);
      setSupplyEntries(fetchedEntries);
      setPayments(fetchedPayments);
      setSettings(fetchedSettings || {
        id: 'temp',
        userId: user.id,
        defaultHourlyRate: 100,
        businessName: 'Water Irrigation Supply',
        currency: 'INR',
        currencySymbol: '₹',
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data from database');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    } else {
      setFarmers([]);
      setSupplyEntries([]);
      setPayments([]);
      setSettings(null);
    }
  }, [isAuthenticated]);

  const addFarmer = async (farmer: Omit<Farmer, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'balance' | 'isActive'>) => {
    try {
      const newFarmer = await apiService.createFarmer(farmer);
      setFarmers([...farmers, newFarmer]);
      toast.success('Farmer added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add farmer');
      throw error;
    }
  };

  const updateFarmer = async (id: string, updates: Partial<Farmer>) => {
    try {
      const updatedFarmer = await apiService.updateFarmer(id, updates);
      setFarmers(farmers.map(f => f.id === id ? updatedFarmer : f));
      toast.success('Farmer updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update farmer');
      throw error;
    }
  };

  const deleteFarmer = async (id: string) => {
    try {
      await apiService.deleteFarmer(id);
      setFarmers(farmers.filter(f => f.id !== id));
      toast.success('Farmer deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete farmer');
      throw error;
    }
  };

  const addSupplyEntry = async (entry: Omit<SupplyEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    try {
      const newEntry = await apiService.createSupplyEntry(entry);
      setSupplyEntries([...supplyEntries, newEntry]);
      
      // Refresh farmers to get updated balance
      await refreshData();
      toast.success('Supply entry added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add supply entry');
      throw error;
    }
  };

  const addPayment = async (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    try {
      const newPayment = await apiService.createPayment(payment);
      setPayments([...payments, newPayment]);
      
      // Refresh farmers to get updated balance
      await refreshData();
      toast.success('Payment added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add payment');
      throw error;
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updated = await apiService.updateSettings(newSettings);
      setSettings(updated);
      toast.success('Settings updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update settings');
      throw error;
    }
  };

  const getFarmerById = (id: string) => {
    return farmers.find(f => f.id === id);
  };

  return (
    <DataContext.Provider
      value={{
        farmers,
        supplyEntries,
        payments,
        settings,
        isLoading,
        addFarmer,
        updateFarmer,
        deleteFarmer,
        addSupplyEntry,
        addPayment,
        updateSettings,
        getFarmerById,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}