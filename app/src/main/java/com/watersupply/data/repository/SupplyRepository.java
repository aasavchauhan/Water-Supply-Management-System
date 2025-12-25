package com.watersupply.data.repository;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.google.firebase.firestore.Filter;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.watersupply.data.firebase.FirebaseManager;
import com.watersupply.data.firebase.FirestoreQueryLiveData;
import com.watersupply.data.models.SupplyEntry;

import java.util.List;

import javax.inject.Inject;
import javax.inject.Singleton;

/**
 * Repository for SupplyEntry data operations with Firebase Firestore
 */
@Singleton
public class SupplyRepository {
    private final FirebaseFirestore firestore;
    
    @Inject
    public SupplyRepository(FirebaseManager firebaseManager) {
        this.firestore = firebaseManager.getFirestore();
    }
    
    public LiveData<List<SupplyEntry>> getAllSupplyEntries(String familyId) {
        // Revert to simple query to avoid index errors. Migration will fix data.
        Query query = firestore.collection("supply_entries")
            .whereEqualTo("familyId", familyId);
            
        return new FirestoreQueryLiveData<>(query, SupplyEntry.class);
    }
    
    public LiveData<List<SupplyEntry>> getSupplyEntriesByFarmer(String familyId, String farmerId) {
        Query query = firestore.collection("supply_entries")
            .whereEqualTo("familyId", familyId)
            .whereEqualTo("farmerId", farmerId);
            
        return new FirestoreQueryLiveData<>(query, SupplyEntry.class);
    }

    public LiveData<List<SupplyEntry>> getDraftSupplyEntries(String familyId) {
        Query query = firestore.collection("supply_entries")
            .whereEqualTo("familyId", familyId)
            .whereEqualTo("status", "draft");
            
        return new FirestoreQueryLiveData<>(query, SupplyEntry.class);
    }
    
    public LiveData<Integer> getSupplyEntryCount(String familyId) {
        MutableLiveData<Integer> countLiveData = new MutableLiveData<>();
        
        firestore.collection("supply_entries")
            .whereEqualTo("familyId", familyId)
            .addSnapshotListener((querySnapshot, error) -> {
                if (error != null || querySnapshot == null) {
                    countLiveData.setValue(0);
                    return;
                }
                countLiveData.setValue(querySnapshot.size());
            });
            
        return countLiveData;
    }
    
    public LiveData<Double> getTotalTimeUsed(String familyId, String startDate) {
        MutableLiveData<Double> totalTimeLiveData = new MutableLiveData<>();
        
        // Note: Firestore doesn't support aggregation queries in real-time listeners easily
        // We'll fetch and calculate client-side for now
        firestore.collection("supply_entries")
            .whereEqualTo("familyId", familyId)
            .whereGreaterThanOrEqualTo("date", startDate)
            .addSnapshotListener((querySnapshot, error) -> {
                if (error != null || querySnapshot == null) {
                    totalTimeLiveData.setValue(0.0);
                    return;
                }
                
                double total = 0.0;
                for (SupplyEntry entry : querySnapshot.toObjects(SupplyEntry.class)) {
                    if (entry.getTotalTimeUsed() != null) {
                        total += entry.getTotalTimeUsed();
                    }
                }
                totalTimeLiveData.setValue(total);
            });
            
        return totalTimeLiveData;
    }
    
    public LiveData<Double> getTotalRevenue(String familyId) {
        MutableLiveData<Double> revenueLiveData = new MutableLiveData<>();
        
        firestore.collection("supply_entries")
            .whereEqualTo("familyId", familyId)
            .addSnapshotListener((querySnapshot, error) -> {
                if (error != null || querySnapshot == null) {
                    revenueLiveData.setValue(0.0);
                    return;
                }
                
                double total = 0.0;
                for (SupplyEntry entry : querySnapshot.toObjects(SupplyEntry.class)) {
                    total += entry.getAmount();
                }
                revenueLiveData.setValue(total);
            });
            
        return revenueLiveData;
    }
    
    public void addSupplyEntry(SupplyEntry entry) {
        if (entry.getId() == null || entry.getId().isEmpty()) {
            entry.setId(firestore.collection("supply_entries").document().getId());
        }
        
        // Ensure familyId is set
        if (entry.getFamilyId() == null && entry.getUserId() != null) {
            entry.setFamilyId(entry.getUserId());
        }
        
        // ServerTimestamp will handle creation time on server, but we set it locally for immediate UI updates if needed
        if (entry.getCreatedAt() == null) {
            entry.setCreatedAt(new java.util.Date());
        }
        entry.setUpdatedAt(new java.util.Date());
        
        firestore.collection("supply_entries").document(entry.getId())
            .set(entry)
            .addOnSuccessListener(aVoid -> {
                // Update farmer balance: Add the supply amount (increase debt)
                updateFarmerBalance(entry.getFarmerId(), entry.getAmount());
            });
    }
    
    public void updateSupplyEntry(SupplyEntry entry, double oldAmount, String oldFarmerId) {
        entry.setUpdatedAt(new java.util.Date());
        
        firestore.collection("supply_entries").document(entry.getId())
            .set(entry)
            .addOnSuccessListener(aVoid -> {
                // Adjust farmer balance
                if (oldFarmerId != null && !oldFarmerId.equals(entry.getFarmerId())) {
                    // Farmer changed
                    // 1. Remove old amount from old farmer (decrease debt)
                    updateFarmerBalance(oldFarmerId, -oldAmount);
                    // 2. Add new amount to new farmer (increase debt)
                    updateFarmerBalance(entry.getFarmerId(), entry.getAmount());
                } else {
                    // Farmer same
                    // Change = newAmount - oldAmount
                    double balanceChange = entry.getAmount() - oldAmount;
                    if (balanceChange != 0) {
                        updateFarmerBalance(entry.getFarmerId(), balanceChange);
                    }
                }
            });
    }
    
    public void deleteSupplyEntry(SupplyEntry entry) {
        if (entry.getId() != null) {
            firestore.collection("supply_entries").document(entry.getId())
                .delete()
                .addOnSuccessListener(aVoid -> {
                    // Revert farmer balance: subtract the deleted supply amount
                    // Supply entry increases balance (debt), so deleting it should decrease it.
                    updateFarmerBalance(entry.getFarmerId(), -entry.getAmount());
                });
        }
    }

    private void updateFarmerBalance(String farmerId, double amountChange) {
        // We need to access FarmerRepository to update balance.
        // Since we can't easily inject it due to circular dependency risk if not careful,
        // we'll use a direct Firestore update here or we need to refactor.
        // Given the current architecture in PaymentRepository, it seems FarmerRepository is injected there.
        // Let's check imports.
        // We need to add FarmerRepository to constructor.
        
        firestore.collection("farmers").document(farmerId)
            .update("balance", com.google.firebase.firestore.FieldValue.increment(amountChange));
    }
    
    public void deleteAllSupplyEntries(String familyId) {
        // Warning: This is a heavy operation in Firestore as it requires deleting documents one by one
        // For now, we'll just query and delete in a batch
        firestore.collection("supply_entries")
            .whereEqualTo("familyId", familyId)
            .get()
            .addOnSuccessListener(querySnapshot -> {
                for (com.google.firebase.firestore.DocumentSnapshot doc : querySnapshot.getDocuments()) {
                    doc.getReference().delete();
                }
            });
    }
}
