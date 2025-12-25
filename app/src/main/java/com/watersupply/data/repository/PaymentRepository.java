package com.watersupply.data.repository;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.google.firebase.firestore.Filter;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.watersupply.data.firebase.FirebaseManager;
import com.watersupply.data.firebase.FirestoreDocumentLiveData;
import com.watersupply.data.firebase.FirestoreQueryLiveData;
import com.watersupply.data.models.Payment;

import java.util.List;

import javax.inject.Inject;
import javax.inject.Singleton;

/**
 * Repository for Payment data operations with Firebase Firestore
 */
@Singleton
public class PaymentRepository {
    private final FirebaseFirestore firestore;
    private final FarmerRepository farmerRepository;
    
    @Inject
    public PaymentRepository(FirebaseManager firebaseManager, FarmerRepository farmerRepository) {
        this.firestore = firebaseManager.getFirestore();
        this.farmerRepository = farmerRepository;
    }
    
    public LiveData<List<Payment>> getAllPayments(String familyId) {
        // Revert to simple query to avoid index errors. Migration will fix data.
        Query query = firestore.collection("payments")
            .whereEqualTo("familyId", familyId);
            
        return new FirestoreQueryLiveData<>(query, Payment.class);
    }
    
    public LiveData<Payment> getPaymentById(String paymentId) {
        return new FirestoreDocumentLiveData<>(
            firestore.collection("payments").document(paymentId),
            Payment.class
        );
    }
    
    public LiveData<List<Payment>> getPaymentsByFarmer(String familyId, String farmerId) {
        Query query = firestore.collection("payments")
            .whereEqualTo("familyId", familyId)
            .whereEqualTo("farmerId", farmerId);
            
        return new FirestoreQueryLiveData<>(query, Payment.class);
    }
    
    public LiveData<Integer> getPaymentCount(String familyId) {
        MutableLiveData<Integer> countLiveData = new MutableLiveData<>();
        
        firestore.collection("payments")
            .whereEqualTo("familyId", familyId)
            .addSnapshotListener((querySnapshot, error) -> {
                if (error != null) {
                    android.util.Log.e("PaymentRepository", "getPaymentCount failed: " + error.getMessage());
                    return;
                }
                
                if (querySnapshot == null) {
                    countLiveData.setValue(0);
                    return;
                }
                countLiveData.setValue(querySnapshot.size());
            });
            
        return countLiveData;
    }
    
    public LiveData<Double> getTotalPaymentsReceived(String familyId, String startDate) {
        MutableLiveData<Double> totalLiveData = new MutableLiveData<>();
        
        firestore.collection("payments")
            .whereEqualTo("familyId", familyId)
            .whereGreaterThanOrEqualTo("paymentDate", startDate)
            .addSnapshotListener((querySnapshot, error) -> {
                if (error != null || querySnapshot == null) {
                    totalLiveData.setValue(0.0);
                    return;
                }
                
                double total = 0.0;
                for (Payment payment : querySnapshot.toObjects(Payment.class)) {
                    total += payment.getAmount();
                }
                totalLiveData.setValue(total);
            });
            
        return totalLiveData;
    }
    
    public LiveData<Double> getTotalPayments(String familyId) {
        MutableLiveData<Double> totalLiveData = new MutableLiveData<>();
        
        firestore.collection("payments")
            .whereEqualTo("familyId", familyId)
            .addSnapshotListener((querySnapshot, error) -> {
                if (error != null || querySnapshot == null) {
                    totalLiveData.setValue(0.0);
                    return;
                }
                
                double total = 0.0;
                for (Payment payment : querySnapshot.toObjects(Payment.class)) {
                    total += payment.getAmount();
                }
                totalLiveData.setValue(total);
            });
            
        return totalLiveData;
    }
    
    public void addPayment(Payment payment) {
        if (payment.getId() == null || payment.getId().isEmpty()) {
            payment.setId(String.valueOf(System.currentTimeMillis()));
        }
        
        // Ensure familyId is set
        if (payment.getFamilyId() == null && payment.getUserId() != null) {
            payment.setFamilyId(payment.getUserId());
        }
        
        if (payment.getCreatedAt() == null) {
            payment.setCreatedAt(new java.util.Date());
        }
        payment.setUpdatedAt(new java.util.Date());
        
        firestore.collection("payments").document(payment.getId())
            .set(payment);
    }
    
    public void savePayment(Payment payment) {
        if (payment.getId() == null) {
            payment.setId(firestore.collection("payments").document().getId());
        }
        
        firestore.collection("payments").document(payment.getId())
            .set(payment)
            .addOnSuccessListener(aVoid -> {
                // Update farmer balance
                updateFarmerBalance(payment.getFarmerId(), payment.getAmount());
            })
            .addOnFailureListener(e -> {
                // Handle error
            });
    }

    public void updatePayment(Payment payment, double oldAmount) {
        firestore.collection("payments").document(payment.getId())
            .set(payment)
            .addOnSuccessListener(aVoid -> {
                // Adjust farmer balance
                // If payment increases (e.g. 100 -> 200), balance should decrease by 100 (more debt paid).
                // We pass the "extra payment amount" to updateFarmerBalance, which negates it.
                // Change = newAmount - oldAmount
                // Example: 200 - 100 = 100. updateFarmerBalance(100) -> adds -100 to balance. Correct.
                double balanceChange = payment.getAmount() - oldAmount;
                updateFarmerBalance(payment.getFarmerId(), balanceChange);
            });
    }

    public void deletePayment(Payment payment) {
        firestore.collection("payments").document(payment.getId())
            .delete()
            .addOnSuccessListener(aVoid -> {
                // Revert farmer balance: Add back the payment amount
                // Payment reduced the balance, so deleting it should increase the balance (restore debt).
                // updateFarmerBalance negates the input, so we pass negative to get positive increment.
                updateFarmerBalance(payment.getFarmerId(), -payment.getAmount());
            });
    }

    private void updateFarmerBalance(String farmerId, double amountReceived) {
        // Amount received reduces the balance (credit)
        // So we subtract the amount from the balance
        farmerRepository.updateFarmerBalance(farmerId, -amountReceived, new FarmerRepository.OnCompleteListener() {
            @Override
            public void onSuccess(String documentId) {
                // Balance updated successfully
            }

            @Override
            public void onFailure(String error) {
                // Failed to update balance
                // In a real app, we might want to retry or log this
            }
        });
    }
    
    public void deleteAllPayments(String familyId) {
        firestore.collection("payments")
            .whereEqualTo("familyId", familyId)
            .get()
            .addOnSuccessListener(querySnapshot -> {
                for (com.google.firebase.firestore.DocumentSnapshot doc : querySnapshot.getDocuments()) {
                    doc.getReference().delete();
                }
            });
    }
}
