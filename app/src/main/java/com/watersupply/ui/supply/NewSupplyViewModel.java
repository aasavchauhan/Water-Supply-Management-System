package com.watersupply.ui.supply;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.watersupply.data.models.SupplyEntry;
import com.watersupply.data.repository.FarmerRepository;
import com.watersupply.data.repository.SupplyRepository;

import javax.inject.Inject;

import dagger.hilt.android.lifecycle.HiltViewModel;

/**
 * ViewModel for creating new supply entries
 */
@HiltViewModel
public class NewSupplyViewModel extends ViewModel {
    private final SupplyRepository supplyRepository;
    private final FarmerRepository farmerRepository;
    
    private final MutableLiveData<Boolean> saveSuccess = new MutableLiveData<>();
    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();
    
    private final com.watersupply.data.repository.AuthRepository authRepository;
    private final com.watersupply.data.repository.AppSettingsRepository appSettingsRepository;

    @Inject
    public NewSupplyViewModel(SupplyRepository supplyRepository, FarmerRepository farmerRepository, 
                              com.watersupply.data.repository.AuthRepository authRepository,
                              com.watersupply.data.repository.AppSettingsRepository appSettingsRepository) {
        this.supplyRepository = supplyRepository;
        this.farmerRepository = farmerRepository;
        this.authRepository = authRepository;
        this.appSettingsRepository = appSettingsRepository;
    }
    
    public LiveData<java.util.List<com.watersupply.data.models.Farmer>> getAllFarmers() {
        String familyId = authRepository.getCurrentFamilyId();
        return farmerRepository.getAllFarmers(familyId);
    }

    public LiveData<com.watersupply.data.models.Farmer> getFarmer(String farmerId) {
        return farmerRepository.getFarmer(farmerId);
    }

    public LiveData<com.watersupply.data.models.AppSettings> getAppSettings() {
        String userId = authRepository.getCurrentUserId();
        if (userId != null) {
            return appSettingsRepository.getSettings(userId);
        }
        return new MutableLiveData<>();
    }
    
    public LiveData<Boolean> getSaveSuccess() {
        return saveSuccess;
    }
    
    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }
    
    public void saveSupplyEntry(SupplyEntry entry) {
        if (!validateEntry(entry)) {
            return;
        }
        
        supplyRepository.addSupplyEntry(entry);
        

        saveSuccess.postValue(true);
    }

    public void updateSupplyEntry(SupplyEntry entry, double oldAmount, String oldFarmerId) {
        if (!validateEntry(entry)) {
            return;
        }

        // Repository now handles the balance update internally
        supplyRepository.updateSupplyEntry(entry, oldAmount, oldFarmerId);
        saveSuccess.postValue(true);
    }
    
    private boolean validateEntry(SupplyEntry entry) {
        if (entry.getFarmerId() == null || entry.getFarmerId().isEmpty()) {
            errorMessage.postValue("Farmer ID is required");
            return false;
        }
        
        if (entry.getBillingMethod() == null || entry.getBillingMethod().isEmpty()) {
            errorMessage.postValue("Billing method is required");
            return false;
        }
        
        // Skip strict validation for drafts
        if ("draft".equals(entry.getStatus())) {
            return true;
        }
        
        if ("time".equals(entry.getBillingMethod())) {
            if (entry.getStartTime() == null || entry.getStopTime() == null) {
                errorMessage.postValue("Start and stop times are required for time-based billing");
                return false;
            }
        } else if ("meter".equals(entry.getBillingMethod())) {
            if (entry.getMeterReadingStart() == null || entry.getMeterReadingEnd() == null) {
                errorMessage.postValue("Meter readings are required for meter-based billing");
                return false;
            }
            
            if (entry.getMeterReadingEnd() <= entry.getMeterReadingStart()) {
                errorMessage.postValue("End meter reading must be greater than start reading");
                return false;
            }
        }
        
        if (entry.getRate() <= 0) {
            errorMessage.postValue("Rate must be greater than zero");
            return false;
        }
        
        return true;
    }
}
