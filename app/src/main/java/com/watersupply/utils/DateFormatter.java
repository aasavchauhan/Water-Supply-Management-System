package com.watersupply.utils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Utility class for date formatting
 */
public class DateFormatter {
    
    private static final SimpleDateFormat ISO_FORMAT = 
        new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault());
    
    private static final SimpleDateFormat DISPLAY_FORMAT = 
        new SimpleDateFormat("dd MMM yyyy", Locale.getDefault());
    
    private static final SimpleDateFormat DATE_ONLY = 
        new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
    
    public static String getCurrentDate() {
        return DATE_ONLY.format(new Date());
    }
    
    public static String getCurrentDateTime() {
        return ISO_FORMAT.format(new Date());
    }
    
    public static String format(String date) {
        try {
            Date d = DATE_ONLY.parse(date);
            return DISPLAY_FORMAT.format(d);
        } catch (Exception e) {
            return date;
        }
    }
    
    public static String format(String date, String pattern) {
        try {
            SimpleDateFormat customFormat = new SimpleDateFormat(pattern, Locale.getDefault());
            Date d = DATE_ONLY.parse(date);
            return customFormat.format(d);
        } catch (Exception e) {
            return date;
        }
    }
    
    public static String formatDate(String date) {
        return format(date);
    }
    
    public static String format(long timestamp, String pattern) {
        try {
            SimpleDateFormat customFormat = new SimpleDateFormat(pattern, Locale.getDefault());
            return customFormat.format(new Date(timestamp));
        } catch (Exception e) {
            return String.valueOf(timestamp);
        }
    }
}
