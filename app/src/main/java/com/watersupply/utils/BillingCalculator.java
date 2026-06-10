package com.watersupply.utils;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Utility class for billing calculations
 */
public class BillingCalculator {
    private static final int HOURS_SCALE = 2;
    private static final int MONEY_SCALE = 2;
    
    /**
     * Convert meter reading to hours.
     * The meter shows reading in XXXXXXX format where the last two digits are decimal hours (0-100 scale).
     * Example: 0546897 -> 5468.97 hours.
     */
    public static double convertMeterToHours(double meterReading) {
        return BigDecimal.valueOf(meterReading)
            .movePointLeft(2)
            .setScale(HOURS_SCALE, RoundingMode.HALF_UP)
            .doubleValue();
    }

    /**
     * Calculate canonical usage directly from raw meter readings.
     */
    public static double calculateMeterUsage(double startReading, double endReading) {
        return BigDecimal.valueOf(endReading)
            .subtract(BigDecimal.valueOf(startReading))
            .movePointLeft(2)
            .setScale(HOURS_SCALE, RoundingMode.HALF_UP)
            .doubleValue();
    }
    
    /**
     * Calculate amount based on time and rate
     */
    public static double calculateAmount(double hours, double hourlyRate) {
        return BigDecimal.valueOf(normalizeHours(hours))
            .multiply(BigDecimal.valueOf(normalizeAmount(hourlyRate)))
            .setScale(MONEY_SCALE, RoundingMode.HALF_UP)
            .doubleValue();
    }

    public static double normalizeHours(double hours) {
        return BigDecimal.valueOf(hours)
            .setScale(HOURS_SCALE, RoundingMode.HALF_UP)
            .doubleValue();
    }

    public static double normalizeAmount(double amount) {
        return BigDecimal.valueOf(amount)
            .setScale(MONEY_SCALE, RoundingMode.HALF_UP)
            .doubleValue();
    }

    public static double subtractPause(double hours, double pauseDuration) {
        return BigDecimal.valueOf(hours)
            .subtract(BigDecimal.valueOf(pauseDuration))
            .max(BigDecimal.ZERO)
            .setScale(HOURS_SCALE, RoundingMode.HALF_UP)
            .doubleValue();
    }

    public static double addHours(double total, double hours) {
        return BigDecimal.valueOf(total)
            .add(BigDecimal.valueOf(normalizeHours(hours)))
            .setScale(HOURS_SCALE, RoundingMode.HALF_UP)
            .doubleValue();
    }

    public static double addAmounts(double total, double amount) {
        return BigDecimal.valueOf(total)
            .add(BigDecimal.valueOf(normalizeAmount(amount)))
            .setScale(MONEY_SCALE, RoundingMode.HALF_UP)
            .doubleValue();
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
            
            return normalizeHours(stopHour - startHour);
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
