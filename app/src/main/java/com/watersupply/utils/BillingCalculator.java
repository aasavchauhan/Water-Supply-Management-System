package com.watersupply.utils;

/**
 * Utility class for billing calculations
 */
public class BillingCalculator {
    
    /**
     * Convert meter reading to hours.
     * The meter shows reading in XXXXXXX format where the last two digits are decimal hours (0-100 scale).
     * Example: 0546897 -> 5468.97 hours.
     */
    public static double convertMeterToHours(double meterReading) {
        return meterReading / 100.0;
    }
    
    /**
     * Calculate amount based on time and rate
     */
    public static double calculateAmount(double hours, double hourlyRate) {
        return hours * hourlyRate;
    }
    
    /**
     * Calculate time difference in hours
     */
    public static double calculateTimeDifference(String startTime, String stopTime) {
        // Simple implementation - can be enhanced with actual time parsing
        try {
            String[] start = startTime.split(":");
            String[] stop = stopTime.split(":");
            
            double startHour = Double.parseDouble(start[0]) + Double.parseDouble(start[1]) / 60.0;
            double stopHour = Double.parseDouble(stop[0]) + Double.parseDouble(stop[1]) / 60.0;
            
            return stopHour - startHour;
        } catch (Exception e) {
            return 0.0;
        }
    }
    
    /**
     * Calculate hours from time strings (HH:mm format)
     */
    public static double calculateHoursFromTime(String startTime, String stopTime) {
        return calculateTimeDifference(startTime, stopTime);
    }
}
