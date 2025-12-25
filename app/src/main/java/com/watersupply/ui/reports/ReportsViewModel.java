package com.watersupply.ui.reports;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.watersupply.data.models.Farmer;
import com.watersupply.data.repository.AuthRepository;
import com.watersupply.data.repository.FarmerRepository;
import com.watersupply.data.repository.PaymentRepository;
import com.watersupply.data.repository.SupplyRepository;

import java.util.List;

import javax.inject.Inject;

import dagger.hilt.android.lifecycle.HiltViewModel;

@HiltViewModel
public class ReportsViewModel extends ViewModel {

    private final FarmerRepository farmerRepository;
    private final SupplyRepository supplyRepository;
    private final PaymentRepository paymentRepository;
    private final AuthRepository authRepository;

    @Inject
    public ReportsViewModel(FarmerRepository farmerRepository, 
                          SupplyRepository supplyRepository,
                          PaymentRepository paymentRepository,
                          AuthRepository authRepository) {
        this.farmerRepository = farmerRepository;
        this.supplyRepository = supplyRepository;
        this.paymentRepository = paymentRepository;
        this.authRepository = authRepository;
    }

    public LiveData<List<Farmer>> getAllFarmers() {
        return farmerRepository.getAllFarmers(authRepository.getCurrentFamilyId());
    }

    public LiveData<List<com.watersupply.data.models.SupplyEntry>> getSupplyEntries(String farmerId) {
        if (farmerId == null || farmerId.isEmpty()) {
            return supplyRepository.getAllSupplyEntries(authRepository.getCurrentFamilyId());
        }
        return supplyRepository.getSupplyEntriesByFarmer(authRepository.getCurrentFamilyId(), farmerId);
    }

    public LiveData<List<com.watersupply.data.models.Payment>> getPayments(String farmerId) {
        if (farmerId == null || farmerId.isEmpty()) {
            return paymentRepository.getAllPayments(authRepository.getCurrentFamilyId());
        }
        return paymentRepository.getPaymentsByFarmer(authRepository.getCurrentFamilyId(), farmerId);
    }
}
