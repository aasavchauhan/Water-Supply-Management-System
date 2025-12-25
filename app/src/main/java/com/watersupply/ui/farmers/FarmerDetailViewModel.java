package com.watersupply.ui.farmers;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;
import com.watersupply.data.models.Farmer;
import com.watersupply.data.models.Payment;
import com.watersupply.data.models.SupplyEntry;
import com.watersupply.data.repository.FarmerRepository;
import com.watersupply.data.repository.PaymentRepository;
import com.watersupply.data.repository.SupplyRepository;
import com.watersupply.data.repository.AuthRepository;
import java.util.List;
import javax.inject.Inject;
import dagger.hilt.android.lifecycle.HiltViewModel;

@HiltViewModel
public class FarmerDetailViewModel extends ViewModel {
    private final FarmerRepository farmerRepository;
    private final SupplyRepository supplyRepository;
    private final PaymentRepository paymentRepository;
    private final AuthRepository authRepository;
    private final String familyId;
    
    @Inject
    public FarmerDetailViewModel(
        FarmerRepository farmerRepository,
        SupplyRepository supplyRepository,
        PaymentRepository paymentRepository,
        AuthRepository authRepository
    ) {
        this.farmerRepository = farmerRepository;
        this.supplyRepository = supplyRepository;
        this.paymentRepository = paymentRepository;
        this.authRepository = authRepository;
        this.familyId = authRepository.getCurrentFamilyId();
    }
    
    public LiveData<Farmer> getFarmerById(String farmerId) {
        return farmerRepository.getFarmerByIdLiveData(farmerId);
    }
    
    public LiveData<List<SupplyEntry>> getSupplyEntries(String farmerId) {
        return androidx.lifecycle.Transformations.map(supplyRepository.getSupplyEntriesByFarmer(familyId, farmerId), entries -> {
            if (entries != null) {
                java.util.Collections.sort(entries, (e1, e2) -> {
                    if (e1.getDate() == null) return 1;
                    if (e2.getDate() == null) return -1;
                    int dateComparison = e2.getDate().compareTo(e1.getDate());
                    if (dateComparison != 0) return dateComparison;
                    if (e1.getCreatedAt() != null && e2.getCreatedAt() != null) {
                        return e2.getCreatedAt().compareTo(e1.getCreatedAt());
                    }
                    return 0;
                });
            }
            return entries;
        });
    }
    
    public LiveData<List<Payment>> getPayments(String farmerId) {
        return androidx.lifecycle.Transformations.map(paymentRepository.getPaymentsByFarmer(familyId, farmerId), payments -> {
            if (payments != null) {
                java.util.Collections.sort(payments, (p1, p2) -> {
                    if (p1.getPaymentDate() == null) return 1;
                    if (p2.getPaymentDate() == null) return -1;
                    return p2.getPaymentDate().compareTo(p1.getPaymentDate());
                });
            }
            return payments;
        });
    }
    
    public void deleteFarmer(String farmerId) {
        farmerRepository.deleteFarmer(farmerId, new FarmerRepository.OnCompleteListener() {
            @Override
            public void onSuccess(String id) {
                // Deleted successfully
            }
            
            @Override
            public void onFailure(String error) {
                // Failed to delete
            }
        });
    }
}
