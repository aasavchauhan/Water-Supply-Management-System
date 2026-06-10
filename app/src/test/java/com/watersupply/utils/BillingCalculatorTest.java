package com.watersupply.utils;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class BillingCalculatorTest {
    @Test
    public void meterUsageComesDirectlyFromRawReadings() {
        assertEquals(1.23, BillingCalculator.calculateMeterUsage(546897, 547020), 0.0);
    }

    @Test
    public void amountMatchesDisplayedUsageAndRate() {
        double usage = BillingCalculator.calculateMeterUsage(546897, 547020);
        double amount = BillingCalculator.calculateAmount(usage, 175.50);

        assertEquals(215.87, amount, 0.0);
    }

    @Test
    public void amountUsesSameTwoDecimalRateShownToUser() {
        assertEquals(215.88, BillingCalculator.calculateAmount(1.23, 175.505), 0.0);
    }

    @Test
    public void totalsMatchSumOfCanonicalRows() {
        double totalHours = BillingCalculator.addHours(0.0, 1.23);
        totalHours = BillingCalculator.addHours(totalHours, 2.17);

        double totalAmount = BillingCalculator.addAmounts(0.0, 215.87);
        totalAmount = BillingCalculator.addAmounts(totalAmount, 380.84);

        assertEquals(3.40, totalHours, 0.0);
        assertEquals(596.71, totalAmount, 0.0);
    }
}
