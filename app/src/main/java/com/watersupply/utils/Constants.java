package com.watersupply.utils;

/**
 * Constants used throughout the application
 */
public class Constants {
    
    // Shared Preferences
    public static final String PREF_USER_SESSION = "user_session";
    public static final String PREF_USER_ID = "user_id";
    
    // Billing Methods
    public static final String BILLING_METHOD_TIME = "time";
    public static final String BILLING_METHOD_METER = "meter";
    
    // Payment Methods
    public static final String PAYMENT_METHOD_CASH = "Cash";
    public static final String PAYMENT_METHOD_UPI = "UPI";
    public static final String PAYMENT_METHOD_BANK = "Bank Transfer";
    
    // Database
    public static final String DATABASE_NAME = "water_supply_database";
    
    // Date Formats
    public static final String DATE_FORMAT_DISPLAY = "dd MMM yyyy";
    public static final String DATE_FORMAT_STORAGE = "yyyy-MM-dd";
    
    // Default Values
    public static final double DEFAULT_HOURLY_RATE = 100.0;
    public static final String DEFAULT_CURRENCY = "INR";
    public static final String DEFAULT_CURRENCY_SYMBOL = "₹";
}
