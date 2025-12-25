package com.watersupply.ui.farmers;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MediatorLiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.Transformations;
import androidx.lifecycle.ViewModel;

import com.watersupply.data.models.Farmer;
import com.watersupply.data.repository.AuthRepository;
import com.watersupply.data.repository.FarmerRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.inject.Inject;

import dagger.hilt.android.lifecycle.HiltViewModel;

/**
 * ViewModel for Farmer list with search and sort functionality
 */
@HiltViewModel
public class FarmerListViewModel extends ViewModel {
    private final FarmerRepository farmerRepository;
    private final String userId;
    private final String familyId;
    private final MediatorLiveData<List<Farmer>> filteredFarmers = new MediatorLiveData<>();
    private LiveData<List<Farmer>> allFarmersLiveData;
    private List<Farmer> cachedFarmers = new ArrayList<>();
    private String currentSearchQuery = "";
    private String currentSortMode = "name"; // "name" or "balance"
    
    @Inject
    public FarmerListViewModel(FarmerRepository farmerRepository, AuthRepository authRepository) {
        this.farmerRepository = farmerRepository;
        this.userId = authRepository.getCurrentUserId();
        this.familyId = authRepository.getCurrentFamilyId();
        
        if (familyId != null) {
            allFarmersLiveData = farmerRepository.getAllFarmers(familyId);
            filteredFarmers.addSource(allFarmersLiveData, farmers -> {
                cachedFarmers = farmers != null ? new ArrayList<>(farmers) : new ArrayList<>();
                applyFiltersAndSort();
            });
        }
    }
    
    public String getFamilyId() {
        return familyId;
    }
    
    public LiveData<List<Farmer>> getFarmers() {
        return filteredFarmers;
    }
    
    public void addFarmer(Farmer farmer) {
        farmer.setUserId(userId);
        farmer.setFamilyId(familyId);
        farmerRepository.addFarmer(farmer, new FarmerRepository.OnCompleteListener() {
            @Override
            public void onSuccess(String id) {
                // Added
            }
            
            @Override
            public void onFailure(String error) {
                // Failed
            }
        });
    }
    
    public void searchFarmers(String query) {
        currentSearchQuery = query.toLowerCase().trim();
        applyFiltersAndSort();
    }
    
    public void sortByName() {
        currentSortMode = "name";
        applyFiltersAndSort();
    }
    
    public void sortByBalance() {
        currentSortMode = "balance";
        applyFiltersAndSort();
    }
    
    public void refreshFarmers() {
        // Trigger re-observation
        if (allFarmersLiveData != null && allFarmersLiveData.getValue() != null) {
            cachedFarmers = new ArrayList<>(allFarmersLiveData.getValue());
            applyFiltersAndSort();
        }
    }
    
    /**
     * Delete a farmer (will cascade delete supply entries and payments)
     */
    public void deleteFarmer(Farmer farmer) {
        farmerRepository.deleteFarmer(farmer.getId(), new FarmerRepository.OnCompleteListener() {
            @Override
            public void onSuccess(String id) {
                // Deleted
            }
            
            @Override
            public void onFailure(String error) {
                // Failed
            }
        });
    }
    
    private void applyFiltersAndSort() {
        List<Farmer> result = new ArrayList<>(cachedFarmers);
        
        // Default sort if none selected (though "name" is default)
        if (currentSortMode == null) currentSortMode = "name";
        
        // Apply search filter
        if (!currentSearchQuery.isEmpty()) {
            List<Farmer> searchResults = new ArrayList<>();
            for (Farmer farmer : result) {
                if (farmer.getName().toLowerCase().contains(currentSearchQuery) ||
                    farmer.getMobile().contains(currentSearchQuery) ||
                    (farmer.getFarmLocation() != null && farmer.getFarmLocation().toLowerCase().contains(currentSearchQuery))) {
                    searchResults.add(farmer);
                }
            }
            result = searchResults;
        }
        
        // Apply sorting
        if ("name".equals(currentSortMode)) {
            Collections.sort(result, new Comparator<Farmer>() {
                @Override
                public int compare(Farmer f1, Farmer f2) {
                    return f1.getName().compareToIgnoreCase(f2.getName());
                }
            });
        } else if ("balance".equals(currentSortMode)) {
            Collections.sort(result, new Comparator<Farmer>() {
                @Override
                public int compare(Farmer f1, Farmer f2) {
                    return Double.compare(f2.getBalance(), f1.getBalance()); // Descending order
                }
            });
        }
        
        filteredFarmers.setValue(result);
    }
}
