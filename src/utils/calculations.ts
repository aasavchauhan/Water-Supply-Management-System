// Utility functions for Water Supply Management System

import { SupplyEntry, Payment, Farmer } from '@/types';

/**
 * Converts meter reading in h.mm format to decimal hours
 * Example: 5.30 (5h 30m) => 5.5 hours
 */
export function convertMeterToHours(reading: number): number {
  const hours = Math.floor(reading);
  const minutes = Math.round((reading - hours) * 100);
  return hours + minutes / 60;
}

/**
 * Validates meter reading format (minutes should be 00-59)
 */
export function validateMeterReading(reading: number): boolean {
  if (reading < 0) return false;
  const minutes = Math.round((reading - Math.floor(reading)) * 100);
  return minutes >= 0 && minutes < 60;
}

/**
 * Calculates duration from start/stop time with pause
 */
export function calculateTimeDuration(
  startTime: string,
  stopTime: string,
  pauseDuration: number = 0
): number {
  const start = new Date(`1970-01-01T${startTime}:00`);
  const stop = new Date(`1970-01-01T${stopTime}:00`);
  
  let diffMs = stop.getTime() - start.getTime();
  
  // Handle crossing midnight
  if (diffMs < 0) {
    diffMs += 24 * 60 * 60 * 1000;
  }
  
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.max(0, diffHours - pauseDuration);
}

/**
 * Format currency value
 */
export function formatCurrency(amount: number, currency: string = '₹'): string {
  return `${currency}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format date to display format
 */
export function formatDate(dateString: string, format: string = 'dd/MM/yyyy'): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', String(year));
}

/**
 * Format time to 12-hour format
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

/**
 * Calculate farmer balance
 */
export function calculateFarmerBalance(
  supplyEntries: SupplyEntry[],
  payments: Payment[]
): number {
  const totalCharges = supplyEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
  return totalCharges - totalPayments;
}

/**
 * Get farmer statistics
 */
export function getFarmerStats(
  supplyEntries: SupplyEntry[],
  payments: Payment[]
) {
  const totalSupplies = supplyEntries.length;
  const totalWaterUsed = supplyEntries.reduce((sum, entry) => sum + (entry.waterUsed || 0), 0);
  const totalHours = supplyEntries.reduce((sum, entry) => sum + entry.totalTimeUsed, 0);
  const totalCharges = supplyEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const currentBalance = totalCharges - totalPayments;
  
  return {
    totalSupplies,
    totalWaterUsed,
    totalHours,
    totalCharges,
    totalPayments,
    currentBalance,
  };
}

/**
 * Filter data by date range
 */
export function filterByDateRange<T extends { date: string } | { paymentDate: string }>(
  data: T[],
  fromDate: string,
  toDate: string
): T[] {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  
  return data.filter(item => {
    const itemDate = new Date('date' in item ? item.date : item.paymentDate);
    return itemDate >= from && itemDate <= to;
  });
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Export data to CSV
 */
export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get first day of current month
 */
export function getFirstDayOfMonth(): string {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
}

/**
 * Search/filter farmers
 */
export function searchFarmers(farmers: Farmer[], searchTerm: string): Farmer[] {
  if (!searchTerm.trim()) return farmers;
  
  const term = searchTerm.toLowerCase();
  return farmers.filter(farmer => 
    farmer.name.toLowerCase().includes(term) ||
    farmer.mobile.includes(term) ||
    farmer.farmLocation.toLowerCase().includes(term)
  );
}
