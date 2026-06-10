package com.watersupply.ui.dashboard;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MediatorLiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.watersupply.data.models.SupplyEntry;
import com.watersupply.data.repository.AuthRepository;
import com.watersupply.data.repository.FarmerRepository;
import com.watersupply.data.repository.SupplyRepository;
import com.watersupply.data.repository.PaymentRepository;
import com.watersupply.utils.DateFormatter;
import com.watersupply.utils.BillingCalculator;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.inject.Inject;

import dagger.hilt.android.lifecycle.HiltViewModel;

/**
 * ViewModel for Dashboard
 */
@HiltViewModel
public class DashboardViewModel extends ViewModel {
    private final FarmerRepository farmerRepository;
    private final SupplyRepository supplyRepository;
    private final PaymentRepository paymentRepository;
    private final AuthRepository authRepository;
    private final String userId;
    private final String familyId;
    
    // Chart data LiveData
    private final MediatorLiveData<Map<String, Double>> revenueTrendData = new MediatorLiveData<>();
    private final MutableLiveData<String> chartPeriod = new MutableLiveData<>("week");
    
    // Period comparison LiveData
    private final MediatorLiveData<Double> currentMonthRevenue = new MediatorLiveData<>();
    private final MediatorLiveData<Double> lastMonthRevenue = new MediatorLiveData<>();
    private final MediatorLiveData<Double> revenueChange = new MediatorLiveData<>();
    
    @Inject
    public DashboardViewModel(
        FarmerRepository farmerRepository, 
        SupplyRepository supplyRepository,
        PaymentRepository paymentRepository,
        AuthRepository authRepository,
        com.watersupply.data.migration.DataMigrationManager migrationManager
    ) {
        this.farmerRepository = farmerRepository;
        this.supplyRepository = supplyRepository;
        this.paymentRepository = paymentRepository;
        this.authRepository = authRepository;
        this.userId = authRepository.getCurrentUserId();
        this.familyId = authRepository.getCurrentFamilyId();
        
        // Trigger migration for legacy data
        if (userId != null) {
            migrationManager.checkAndMigrate(userId);
        }
        
        // Setup reactive data binding
        if (familyId != null) {
            LiveData<List<SupplyEntry>> allSupplyEntries = supplyRepository.getAllSupplyEntries(familyId);
            
            revenueTrendData.addSource(allSupplyEntries, entries -> updateChartData(entries, chartPeriod.getValue()));
            revenueTrendData.addSource(chartPeriod, period -> updateChartData(allSupplyEntries.getValue(), period));
            
            currentMonthRevenue.addSource(allSupplyEntries, entries -> {
                if (entries != null) calculatePeriodComparison(entries);
            });
        }
    }
    
    public LiveData<Integer> getFarmerCount() {
        if (familyId != null) {
            return farmerRepository.getFarmerCount(familyId);
        }
        return new MutableLiveData<>(0);
    }
    
    public LiveData<Integer> getSupplyEntryCount() {
        if (familyId != null) {
            return supplyRepository.getSupplyEntryCount(familyId);
        }
        return new MutableLiveData<>(0);
    }
    
    public LiveData<Double> getTotalRevenue() {
        if (familyId != null) {
            return supplyRepository.getTotalRevenue(familyId);
        }
        return new MutableLiveData<>(0.0);
    }
    
    public LiveData<Double> getTotalWaterSupplied() {
        if (familyId != null) {
            return supplyRepository.getTotalTimeUsed(familyId, "1900-01-01"); // All time
        }
        return new MutableLiveData<>(0.0);
    }
    
    public LiveData<Double> getTotalIncomeCollected() {
        if (familyId != null) {
            return paymentRepository.getTotalPayments(familyId);
        }
        return new MutableLiveData<>(0.0);
    }
    
    public LiveData<Double> getPendingDues() {
        if (familyId != null) {
            return farmerRepository.getTotalBalance(familyId);
        }
        return new MutableLiveData<>(0.0);
    }
    
    public LiveData<Integer> getPaymentCount() {
        if (familyId != null) {
            return paymentRepository.getPaymentCount(familyId);
        }
        return new MutableLiveData<>(0);
    }
    
    public LiveData<Integer> getFarmersWithPendingDues() {
        if (familyId != null) {
            return farmerRepository.getFarmersWithBalanceCount(familyId);
        }
        return new MutableLiveData<>(0);
    }
    
    // Period comparison methods
    public LiveData<Double> getCurrentMonthRevenue() {
        return currentMonthRevenue;
    }
    
    public LiveData<Double> getLastMonthRevenue() {
        return lastMonthRevenue;
    }
    
    public LiveData<Double> getRevenueChange() {
        return revenueChange;
    }
    
    public LiveData<List<SupplyEntry>> getDraftSupplyEntries() {
        androidx.lifecycle.MediatorLiveData<List<SupplyEntry>> result = new androidx.lifecycle.MediatorLiveData<>();
        
        if (familyId == null) return result;
        
        LiveData<List<SupplyEntry>> draftsSource = supplyRepository.getDraftSupplyEntries(familyId);
        LiveData<List<com.watersupply.data.models.Farmer>> farmersSource = farmerRepository.getAllFarmers(familyId);
        
        result.addSource(draftsSource, drafts -> {
            result.setValue(combineDraftsAndFarmers(drafts, farmersSource.getValue()));
        });
        
        result.addSource(farmersSource, farmers -> {
            result.setValue(combineDraftsAndFarmers(draftsSource.getValue(), farmers));
        });
        
        return result;
    }
    
    private List<SupplyEntry> combineDraftsAndFarmers(List<SupplyEntry> drafts, List<com.watersupply.data.models.Farmer> farmers) {
        if (drafts == null) return null;
        if (farmers == null) return drafts; // Can't map yet
        
        Map<String, String> farmerMap = new HashMap<>();
        for (com.watersupply.data.models.Farmer f : farmers) {
            farmerMap.put(f.getId(), f.getName());
        }
        
        for (SupplyEntry entry : drafts) {
            if (entry.getFarmerId() != null && farmerMap.containsKey(entry.getFarmerId())) {
                entry.setFarmerName(farmerMap.get(entry.getFarmerId()));
            }
        }
        
        return drafts;
    }
    
    // Chart data methods
    public LiveData<Map<String, Double>> getRevenueTrendData() {
        return revenueTrendData;
    }
    
    /**
     * Load revenue trend chart data
     */
    public void loadChartData(String period) {
        chartPeriod.setValue(period);
    }
    
    private void updateChartData(List<SupplyEntry> entries, String period) {
        if (entries == null || period == null) return;
        
        Map<String, Double> trendData = new LinkedHashMap<>();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
        SimpleDateFormat labelFormat;
        Calendar calendar = Calendar.getInstance();
        
        if ("week".equals(period)) {
            labelFormat = new SimpleDateFormat("EEE", Locale.getDefault());
            // Last 7 days
            for (int i = 6; i >= 0; i--) {
                calendar.setTimeInMillis(System.currentTimeMillis());
                calendar.add(Calendar.DAY_OF_YEAR, -i);
                String date = dateFormat.format(calendar.getTime());
                String label = labelFormat.format(calendar.getTime());
                
                double revenue = 0.0;
                for (SupplyEntry entry : entries) {
                    if (entry.getDate() != null && entry.getDate().startsWith(date)) {
                        revenue = BillingCalculator.addAmounts(revenue, entry.getAmount());
                    }
                }
                trendData.put(label, revenue);
            }
        } else { // month
            labelFormat = new SimpleDateFormat("dd", Locale.getDefault());
            // Last 30 days
            for (int i = 29; i >= 0; i -= 3) {
                calendar.setTimeInMillis(System.currentTimeMillis());
                calendar.add(Calendar.DAY_OF_YEAR, -i);
                String date = dateFormat.format(calendar.getTime());
                String label = labelFormat.format(calendar.getTime());
                
                double revenue = 0.0;
                for (SupplyEntry entry : entries) {
                    if (entry.getDate() != null && entry.getDate().startsWith(date)) {
                        revenue = BillingCalculator.addAmounts(revenue, entry.getAmount());
                    }
                }
                trendData.put(label, revenue);
            }
        }
        
        revenueTrendData.setValue(trendData);
    }
    
    /**
     * Calculate period comparison (this month vs last month)
     */
    private void calculatePeriodComparison(List<SupplyEntry> entries) {
        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat monthFormat = new SimpleDateFormat("yyyy-MM", Locale.getDefault());
        
        String currentMonth = monthFormat.format(calendar.getTime());
        calendar.add(Calendar.MONTH, -1);
        String lastMonth = monthFormat.format(calendar.getTime());
        
        double currentMonthTotal = 0.0;
        double lastMonthTotal = 0.0;
        
        for (SupplyEntry entry : entries) {
            if (entry.getDate() != null) {
                if (entry.getDate().startsWith(currentMonth)) {
                    currentMonthTotal = BillingCalculator.addAmounts(
                        currentMonthTotal, entry.getAmount());
                } else if (entry.getDate().startsWith(lastMonth)) {
                    lastMonthTotal = BillingCalculator.addAmounts(
                        lastMonthTotal, entry.getAmount());
                }
            }
        }
        
        currentMonthRevenue.setValue(currentMonthTotal);
        lastMonthRevenue.setValue(lastMonthTotal);
        
        // Calculate percentage change
        if (lastMonthTotal > 0) {
            double change = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
            revenueChange.setValue(change);
        } else {
            revenueChange.setValue(0.0);
        }
    }
}
