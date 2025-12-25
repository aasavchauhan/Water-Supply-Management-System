package com.watersupply.utils;

import java.util.Locale;

/**
 * Utility class for currency formatting
 */
public class CurrencyFormatter {
    
    public static String format(double amount, String symbol) {
        return String.format(Locale.getDefault(), "%s%.2f", symbol, amount);
    }
    
    public static String format(double amount) {
        return format(amount, "₹");
    }
    
    public static String formatINR(double amount) {
        return format(amount, "₹");
    }
}
