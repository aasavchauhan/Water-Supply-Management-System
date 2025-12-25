package com.watersupply.ui.payments;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;
import com.watersupply.data.models.Farmer;
import com.watersupply.data.models.Payment;
import com.watersupply.data.repository.AuthRepository;
import com.watersupply.data.repository.FarmerRepository;
import com.watersupply.data.repository.PaymentRepository;
import javax.inject.Inject;
import dagger.hilt.android.lifecycle.HiltViewModel;

@HiltViewModel
public class AddPaymentViewModel extends ViewModel {
    private final PaymentRepository paymentRepository;
    private final FarmerRepository farmerRepository;
    private final AuthRepository authRepository;
    
    @Inject
    public AddPaymentViewModel(
        PaymentRepository paymentRepository,
        FarmerRepository farmerRepository,
        AuthRepository authRepository
    ) {
        this.paymentRepository = paymentRepository;
        this.farmerRepository = farmerRepository;
        this.authRepository = authRepository;
    }
    
    public LiveData<Farmer> getFarmerById(String farmerId) {
        return farmerRepository.getFarmerByIdLiveData(farmerId);
    }
    
    public void savePayment(
        String farmerId,
        String paymentDate,
        double amount,
        String paymentMethod,
        String transactionId,
        String remarks
    ) {
        String userId = authRepository.getCurrentUserId();
        String familyId = authRepository.getCurrentFamilyId();
        if (userId == null) return;
        
        Payment payment = new Payment();
        payment.setUserId(userId);
        payment.setFamilyId(familyId);
        payment.setFarmerId(farmerId);
        payment.setPaymentDate(paymentDate);
        payment.setAmount(amount);
        payment.setPaymentMethod(paymentMethod);
        payment.setTransactionId(transactionId);
        payment.setRemarks(remarks);
        payment.setCreatedAt(new java.util.Date());
        payment.setUpdatedAt(new java.util.Date());
        
        // Use the new savePayment method in Repository which handles balance update
        paymentRepository.savePayment(payment);
    }

    public void updatePayment(
        Payment originalPayment,
        String paymentDate,
        double newAmount,
        String paymentMethod,
        String transactionId,
        String remarks
    ) {
        double oldAmount = originalPayment.getAmount();
        
        originalPayment.setPaymentDate(paymentDate);
        originalPayment.setAmount(newAmount);
        originalPayment.setPaymentMethod(paymentMethod);
        originalPayment.setTransactionId(transactionId);
        originalPayment.setRemarks(remarks);
        originalPayment.setUpdatedAt(new java.util.Date());
        
        paymentRepository.updatePayment(originalPayment, oldAmount);
    }
}
