package com.watersupply.utils;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class UsageHoursFormatterTest {
    @Test
    public void format_keepsTwoDecimalPlaces() {
        assertEquals("4.30", UsageHoursFormatter.format(4.3));
        assertEquals("4.33", UsageHoursFormatter.format(4.3333333333));
    }

    @Test
    public void displayedTotalMatchesDisplayedEntrySum() {
        double total = BillingCalculator.addHours(
            UsageHoursFormatter.normalize(1.1666666667),
            UsageHoursFormatter.normalize(2.1666666667));

        assertEquals("3.34", UsageHoursFormatter.format(total));
    }
}
