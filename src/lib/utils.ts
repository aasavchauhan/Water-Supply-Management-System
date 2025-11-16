import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts meter reading in h.mm format to decimal hours
 * @param reading - Meter reading (e.g., 5.30 for 5 hours 30 minutes)
 * @returns Hours in decimal format (e.g., 5.5)
 */
export function convertMeterToHours(reading: number): number {
  const hours = Math.floor(reading)
  const minutes = Math.round((reading - hours) * 100)
  return hours + (minutes / 60)
}

/**
 * Validates meter reading format
 * @param reading - Meter reading to validate
 * @returns true if valid, false otherwise
 */
export function validateMeterReading(reading: number): boolean {
  if (reading < 0) return false
  const minutes = Math.round((reading - Math.floor(reading)) * 100)
  if (minutes > 59) return false
  return true
}

/**
 * Calculates duration from start/stop time with pause
 * @param startTime - Start time in HH:MM format
 * @param stopTime - Stop time in HH:MM format
 * @param pauseDuration - Pause time in hours
 * @returns Total hours worked
 */
export function calculateTimeDuration(
  startTime: string,
  stopTime: string,
  pauseDuration: number = 0
): number {
  const start = new Date(`1970-01-01T${startTime}:00`)
  let stop = new Date(`1970-01-01T${stopTime}:00`)
  
  // Handle overnight shifts
  if (stop < start) {
    stop = new Date(`1970-01-02T${stopTime}:00`)
  }
  
  const diffMs = stop.getTime() - start.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  
  return Math.max(0, diffHours - pauseDuration)
}

/**
 * Format currency amount
 * @param amount - Amount to format
 * @param symbol - Currency symbol (default: ₹)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, symbol: string = '₹'): string {
  return `${symbol}${Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

/**
 * Format date to display format
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * Get color class based on balance
 * @param balance - Balance amount
 * @returns Tailwind color class
 */
export function getBalanceColor(balance: number): string {
  if (balance < 0) return 'text-red-600'
  if (balance > 0) return 'text-green-600'
  return 'text-muted-foreground'
}

/**
 * Get balance status text
 * @param balance - Balance amount
 * @returns Status text
 */
export function getBalanceStatus(balance: number): string {
  if (balance < 0) return 'Due'
  if (balance > 0) return 'Credit'
  return 'Settled'
}

/**
 * Export data to CSV
 * @param data - Array of objects to export
 * @param filename - Name of the CSV file
 */
export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
