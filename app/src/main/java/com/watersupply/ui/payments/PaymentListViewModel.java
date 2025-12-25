package com.watersupply.ui.payments;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MediatorLiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;
import com.watersupply.data.models.Payment;
import com.watersupply.data.repository.AuthRepository;
import com.watersupply.data.repository.PaymentRepository;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.inject.Inject;
import dagger.hilt.android.lifecycle.HiltViewModel;

@HiltViewModel
public class PaymentListViewModel extends ViewModel {
    private final PaymentRepository paymentRepository;
    private final AuthRepository authRepository;
    private final com.watersupply.data.repository.FarmerRepository farmerRepository;
    
    // Filtered payments
    private final MediatorLiveData<List<Payment>> filteredPayments = new MediatorLiveData<>();
    private final MutableLiveData<java.util.Map<String, String>> farmerNameMap = new MutableLiveData<>();
    
    // Statistics LiveData
    private final MutableLiveData<Integer> totalPayments = new MutableLiveData<>(0);
    private final MutableLiveData<Double> totalAmount = new MutableLiveData<>(0.0);
    private final MutableLiveData<Double> averagePayment = new MutableLiveData<>(0.0);
    
    // Cached data for filtering and sorting
    private List<Payment> cachedPayments = new ArrayList<>();
    private String startDateFilter = null;
    private String endDateFilter = null;
    private String searchQuery = "";
    private String currentSortMode = "date"; // "date" or "amount"
    
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
    
    @Inject
    public PaymentListViewModel(PaymentRepository paymentRepository, 
                              AuthRepository authRepository, 
                              com.watersupply.data.repository.FarmerRepository farmerRepository) {
        this.paymentRepository = paymentRepository;
        this.authRepository = authRepository;
        this.farmerRepository = farmerRepository;
        
        String userId = authRepository.getCurrentUserId();
        String familyId = authRepository.getCurrentFamilyId();
        
        if (userId != null) {
            LiveData<List<Payment>> allPayments = paymentRepository.getAllPayments(familyId);
            filteredPayments.addSource(allPayments, payments -> {
                cachedPayments = payments != null ? payments : new ArrayList<>();
                applyFiltersAndSort();
            });
            
            // Load farmer map
            loadFarmerNames(familyId);
        }
    }
    
    private void loadFarmerNames(String familyId) {
        // We use observeForever here because we want to maintain the map in the ViewModel
        // In a real LifecycleAware component we would observe in fragment, but for filtering logic here it's easier
        // Note: Transformation.map would be better but requires chaining.
        // Let's just expose the LiveData from repository directly transformed to Map
        LiveData<List<com.watersupply.data.models.Farmer>> farmersLiveData = farmerRepository.getAllFarmers(familyId);
        filteredPayments.addSource(farmersLiveData, farmers -> {
             if (farmers != null) {
                java.util.Map<String, String> map = new java.util.HashMap<>();
                for (com.watersupply.data.models.Farmer farmer : farmers) {
                    map.put(farmer.getId(), farmer.getName());
                }
                farmerNameMap.setValue(map);
                // Re-apply filters as names might have updated for search
                applyFiltersAndSort();
            }
        });
    }
    
    public LiveData<java.util.Map<String, String>> getFarmerNameMap() {
        return farmerNameMap;
    }
    
    public LiveData<List<Payment>> getPayments() {
        return filteredPayments;
    }
    
    /**
     * Search payments by farmer ID or payment method
     */
    public void searchPayments(String query) {
        this.searchQuery = query.toLowerCase();
        applyFiltersAndSort();
    }
    
    /**
     * Filter payments by date range
     */
    public void filterByDateRange(String startDate, String endDate) {
        this.startDateFilter = startDate;
        this.endDateFilter = endDate;
        applyFiltersAndSort();
    }
    
    /**
     * Clear all filters
     */
    public void clearFilter() {
        this.startDateFilter = null;
        this.endDateFilter = null;
        this.searchQuery = "";
        applyFiltersAndSort();
    }
    
    /**
     * Sort by date (descending)
     */
    public void sortByDate() {
        this.currentSortMode = "date";
        applyFiltersAndSort();
    }
    
    /**
     * Sort by amount (descending)
     */
    public void sortByAmount() {
        this.currentSortMode = "amount";
        applyFiltersAndSort();
    }
    
    /**
     * Refresh data (triggers re-observation)
     */
    public void refreshData() {
        applyFiltersAndSort();
    }
    
    /**
     * Get total number of payments (filtered)
     */
    public LiveData<Integer> getTotalPayments() {
        return totalPayments;
    }
    
    /**
     * Get total amount (filtered)
     */
    public LiveData<Double> getTotalAmount() {
        return totalAmount;
    }
    
    /**
     * Get average payment amount (filtered)
     */
    public LiveData<Double> getAveragePayment() {
        return averagePayment;
    }
    
    /**
     * Delete a payment
     */
    public void deletePayment(Payment payment) {
        paymentRepository.deletePayment(payment);
    }
    
    /**
     * Apply current filters and sorting to cached payments
     */
    private void applyFiltersAndSort() {
        List<Payment> filtered = new ArrayList<>();
        
        // Apply search and date filters
        for (Payment payment : cachedPayments) {
            if (matchesSearchQuery(payment) && matchesDateFilter(payment)) {
                filtered.add(payment);
            }
        }
        
        // Apply sorting
        if (currentSortMode == null) currentSortMode = "date";
        
        if ("date".equals(currentSortMode)) {
            Collections.sort(filtered, new Comparator<Payment>() {
                @Override
                public int compare(Payment p1, Payment p2) {
                    if (p1.getPaymentDate() == null) return 1;
                    if (p2.getPaymentDate() == null) return -1;
                    return p2.getPaymentDate().compareTo(p1.getPaymentDate()); // Descending
                }
            });
        } else if ("amount".equals(currentSortMode)) {
            Collections.sort(filtered, new Comparator<Payment>() {
                @Override
                public int compare(Payment p1, Payment p2) {
                    return Double.compare(p2.getAmount(), p1.getAmount()); // Descending
                }
            });
        }
        
        // Update filtered payments
        filteredPayments.setValue(filtered);
        
        // Calculate statistics
        calculateStatistics(filtered);
    }
    
    /**
     * Check if payment matches search query
     */
    private boolean matchesSearchQuery(Payment payment) {
        if (searchQuery.isEmpty()) {
            return true;
        }
        
        String farmerName = payment.getFarmerName();
        // Fallback name lookup
        if (farmerName == null || farmerName.isEmpty()) {
            java.util.Map<String, String> map = farmerNameMap.getValue();
            if (map != null && payment.getFarmerId() != null) {
                farmerName = map.get(payment.getFarmerId());
            }
        }
        
        String farmerNameLower = farmerName != null ? farmerName.toLowerCase() : "";
        String methodLower = payment.getPaymentMethod() != null ? payment.getPaymentMethod().toLowerCase() : "";
        
        return farmerNameLower.contains(searchQuery) || methodLower.contains(searchQuery);
    }
    
    /**
     * Check if payment matches date filter
     */
    private boolean matchesDateFilter(Payment payment) {
        if (startDateFilter == null && endDateFilter == null) {
            return true; // No filter
        }
        
        try {
            Date paymentDate = dateFormat.parse(payment.getPaymentDate());
            if (paymentDate == null) {
                return false;
            }
            
            if (startDateFilter != null) {
                Date startDate = dateFormat.parse(startDateFilter);
                if (startDate != null && paymentDate.before(startDate)) {
                    return false;
                }
            }
            
            if (endDateFilter != null) {
                Date endDate = dateFormat.parse(endDateFilter);
                if (endDate != null && paymentDate.after(endDate)) {
                    return false;
                }
            }
            
            return true;
        } catch (ParseException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    /**
     * Calculate statistics from filtered payments
     */
    private void calculateStatistics(List<Payment> payments) {
        int count = payments.size();
        double total = 0.0;
        
        for (Payment payment : payments) {
            total += payment.getAmount();
        }
        
        double average = count > 0 ? total / count : 0.0;
        
        totalPayments.setValue(count);
        totalAmount.setValue(total);
        averagePayment.setValue(average);
    }
}
