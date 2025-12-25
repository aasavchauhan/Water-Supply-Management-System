package com.watersupply.ui.payments;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;
import com.watersupply.data.models.Farmer;
import com.watersupply.data.repository.AuthRepository;
import com.watersupply.data.repository.FarmerRepository;
import java.util.List;
import javax.inject.Inject;
import dagger.hilt.android.lifecycle.HiltViewModel;

@HiltViewModel
public class SelectFarmerForPaymentViewModel extends ViewModel {
    private final FarmerRepository farmerRepository;
    private final AuthRepository authRepository;
    private final LiveData<List<Farmer>> farmers;
    
    @Inject
    public SelectFarmerForPaymentViewModel(FarmerRepository farmerRepository, AuthRepository authRepository) {
        this.farmerRepository = farmerRepository;
        this.authRepository = authRepository;
        
        String userId = authRepository.getCurrentUserId();
        if (userId != null) {
            this.farmers = farmerRepository.getAllFarmers(userId);
        } else {
            this.farmers = new MutableLiveData<>();
        }
    }
    
    public LiveData<List<Farmer>> getFarmers() {
        return farmers;
    }
}
