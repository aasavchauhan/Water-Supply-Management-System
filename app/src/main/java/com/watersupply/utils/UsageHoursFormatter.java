package com.watersupply.utils;

import java.util.Locale;

/**
 * Keeps displayed supply usage and displayed totals on the same precision.
 */
public final class UsageHoursFormatter {
    private UsageHoursFormatter() {
    }

    public static double normalize(double hours) {
        return BillingCalculator.normalizeHours(hours);
    }

    public static String format(double hours) {
        return String.format(Locale.US, "%.2f", normalize(hours));
    }
}
