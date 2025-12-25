package com.watersupply.ui.farmers;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;
import com.watersupply.data.models.Farmer;
import com.watersupply.data.repository.FarmerRepository;
import javax.inject.Inject;
import dagger.hilt.android.lifecycle.HiltViewModel;

/**
 * ViewModel for EditFarmerActivity
 */
@HiltViewModel
public class EditFarmerViewModel extends ViewModel {
    
    private final FarmerRepository farmerRepository;
    
    @Inject
    public EditFarmerViewModel(FarmerRepository farmerRepository) {
        this.farmerRepository = farmerRepository;
    }
    
    public LiveData<Farmer> getFarmerById(String farmerId) {
        return farmerRepository.getFarmerByIdLiveData(farmerId);
    }
    
    public void updateFarmer(String farmerId, String name, String mobile, 
                            String location, double defaultRate) {
        farmerRepository.updateFarmerDetails(farmerId, name, mobile, location, defaultRate, new FarmerRepository.OnCompleteListener() {
            @Override
            public void onSuccess(String id) {
                // Success
            }

            @Override
            public void onFailure(String error) {
                // Error
            }
        });
    }
}
