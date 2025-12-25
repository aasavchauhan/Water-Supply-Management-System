package com.watersupply.ui.supply;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MediatorLiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.watersupply.data.models.SupplyEntry;
import com.watersupply.data.repository.AuthRepository;
import com.watersupply.data.repository.FarmerRepository;
import com.watersupply.data.repository.SupplyRepository;

import java.util.Collections;
import java.util.Comparator;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.inject.Inject;

import dagger.hilt.android.lifecycle.HiltViewModel;

/**
 * ViewModel for Supply list with filtering and statistics
 */
@HiltViewModel
public class SupplyListViewModel extends ViewModel {
    private final SupplyRepository supplyRepository;
    private final String userId;
    private final String familyId;
    
    // Filtered supply entries
    private final MediatorLiveData<List<SupplyEntry>> filteredSupplyEntries = new MediatorLiveData<>();
    
    // Statistics LiveData
    private final MutableLiveData<Integer> totalEntries = new MutableLiveData<>(0);
    private final MutableLiveData<Double> totalHours = new MutableLiveData<>(0.0);
    private final MutableLiveData<Double> totalRevenue = new MutableLiveData<>(0.0);
    
    // Cached data for filtering
    private List<SupplyEntry> cachedSupplyEntries = new ArrayList<>();
    private String startDateFilter = null;
    private String endDateFilter = null;
    
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
    
    private final FarmerRepository farmerRepository;
    
    @Inject
    public SupplyListViewModel(SupplyRepository supplyRepository, AuthRepository authRepository, FarmerRepository farmerRepository) {
        this.supplyRepository = supplyRepository;
        this.farmerRepository = farmerRepository;
        this.userId = authRepository.getCurrentUserId();
        this.familyId = authRepository.getCurrentFamilyId();
        
        // Initialize filtered entries
        if (familyId != null) {
            LiveData<List<SupplyEntry>> allEntries = supplyRepository.getAllSupplyEntries(familyId);
            filteredSupplyEntries.addSource(allEntries, entries -> {
                cachedSupplyEntries = entries != null ? entries : new ArrayList<>();
                applyFilter();
            });
        }
    }
    
    public LiveData<List<com.watersupply.data.models.Farmer>> getAllFarmers() {
        if (familyId == null) return new MutableLiveData<>(new ArrayList<>());
        return farmerRepository.getAllFarmers(familyId);
    }
    
    public LiveData<List<SupplyEntry>> getSupplyEntries() {
        return filteredSupplyEntries;
    }
    
    /**
     * Filter supply entries by date range
     */
    public void filterByDateRange(String startDate, String endDate) {
        this.startDateFilter = startDate;
        this.endDateFilter = endDate;
        applyFilter();
    }
    
    /**
     * Clear all filters
     */
    public void clearFilter() {
        this.startDateFilter = null;
        this.endDateFilter = null;
        applyFilter();
    }
    
    /**
     * Refresh data (triggers re-observation)
     */
    public void refreshData() {
        applyFilter();
    }
    
    /**
     * Get total number of entries (filtered)
     */
    public LiveData<Integer> getTotalEntries() {
        return totalEntries;
    }
    
    /**
     * Get total hours used (filtered)
     */
    public LiveData<Double> getTotalHours() {
        return totalHours;
    }
    
    /**
     * Get total revenue (filtered)
     */
    public LiveData<Double> getTotalRevenue() {
        return totalRevenue;
    }
    
    /**
     * Delete a supply entry
     */
    public void deleteSupplyEntry(SupplyEntry entry) {
        supplyRepository.deleteSupplyEntry(entry);
    }
    
    /**
     * Apply current filters to cached entries
     */
    private void applyFilter() {
        List<SupplyEntry> filtered = new ArrayList<>();
        
        // Apply date range filter
        for (SupplyEntry entry : cachedSupplyEntries) {
            if (matchesDateFilter(entry)) {
                filtered.add(entry);
            }
        }
        
        // Update filtered entries
        
        // Sort by date descending (default)
        Collections.sort(filtered, new Comparator<SupplyEntry>() {
            @Override
            public int compare(SupplyEntry e1, SupplyEntry e2) {
                // Handle nulls
                if (e1.getDate() == null) return 1;
                if (e2.getDate() == null) return -1;
                
                // Compare dates (descending)
                int dateComparison = e2.getDate().compareTo(e1.getDate());
                if (dateComparison != 0) return dateComparison;
                
                // Secondary sort by createdAt if available
                if (e1.getCreatedAt() != null && e2.getCreatedAt() != null) {
                    return e2.getCreatedAt().compareTo(e1.getCreatedAt());
                }
                return 0;
            }
        });

        filteredSupplyEntries.setValue(filtered);
        
        // Calculate statistics
        calculateStatistics(filtered);
    }
    
    /**
     * Check if entry matches date filter
     */
    private boolean matchesDateFilter(SupplyEntry entry) {
        if (startDateFilter == null && endDateFilter == null) {
            return true; // No filter
        }
        
        try {
            Date entryDate = dateFormat.parse(entry.getDate());
            if (entryDate == null) {
                return false;
            }
            
            if (startDateFilter != null) {
                Date startDate = dateFormat.parse(startDateFilter);
                if (startDate != null && entryDate.before(startDate)) {
                    return false;
                }
            }
            
            if (endDateFilter != null) {
                Date endDate = dateFormat.parse(endDateFilter);
                if (endDate != null && entryDate.after(endDate)) {
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
     * Calculate statistics from filtered entries
     */
    private void calculateStatistics(List<SupplyEntry> entries) {
        int count = entries.size();
        double hours = 0.0;
        double revenue = 0.0;
        
        for (SupplyEntry entry : entries) {
            if (entry.getTotalTimeUsed() != null) {
                hours += entry.getTotalTimeUsed();
            }
            revenue += entry.getAmount();
        }
        
        totalEntries.setValue(count);
        totalHours.setValue(hours);
        totalRevenue.setValue(revenue);
    }
}
