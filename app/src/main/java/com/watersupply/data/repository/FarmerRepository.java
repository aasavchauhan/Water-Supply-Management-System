package com.watersupply.data.repository;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.google.firebase.firestore.Filter;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.watersupply.data.firebase.FirebaseManager;
import com.watersupply.data.firebase.FirestoreDocumentLiveData;
import com.watersupply.data.firebase.FirestoreQueryLiveData;
import com.watersupply.data.models.Farmer;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.inject.Singleton;

/**
 * Repository for Farmer data operations with Firebase Firestore
 */
@Singleton
public class FarmerRepository {
    private final FirebaseFirestore firestore;
    
    @Inject
    public FarmerRepository(FirebaseManager firebaseManager) {
        this.firestore = firebaseManager.getFirestore();
    }
    
    /**
     * Get all farmers for a specific family (with real-time updates)
     */
    public LiveData<List<Farmer>> getAllFarmers(String familyId) {
        Query query = firestore.collection("farmers")
            .whereEqualTo("familyId", familyId)
            .whereEqualTo("isActive", true);
            
        return new FirestoreQueryLiveData<>(query, Farmer.class);
    }
    
    /**
     * Add new farmer to Firestore
     */
    public void addFarmer(Farmer farmer, OnCompleteListener listener) {
        if (farmer.getId() == null) {
            farmer.setId(firestore.collection("farmers").document().getId());
        }
        
        // Ensure familyId is set (should be set by caller, but safety check)
        if (farmer.getFamilyId() == null && farmer.getUserId() != null) {
            farmer.setFamilyId(farmer.getUserId());
        }

        firestore.collection("farmers").document(farmer.getId())
            .set(farmer)
            .addOnSuccessListener(aVoid -> listener.onSuccess(farmer.getId()))
            .addOnFailureListener(e -> listener.onFailure(e.getMessage()));
    }
    
    /**
     * Update farmer document
     */
    public void updateFarmer(String farmerId, Farmer farmer, OnCompleteListener listener) {
        firestore.collection("farmers").document(farmerId)
            .update(farmerToMap(farmer))
            .addOnSuccessListener(aVoid -> listener.onSuccess(farmerId))
            .addOnFailureListener(e -> listener.onFailure(e.getMessage()));
    }
    
    /**
     * Update farmer balance
     */
    public void updateFarmerBalance(String farmerId, double amount, OnCompleteListener listener) {
        firestore.collection("farmers").document(farmerId)
            .get()
            .addOnSuccessListener(documentSnapshot -> {
                if (documentSnapshot.exists()) {
                    Farmer farmer = documentSnapshot.toObject(Farmer.class);
                    if (farmer != null) {
                        farmer.setBalance(farmer.getBalance() + amount);
                        farmer.setUpdatedAt(new java.util.Date());
                        
                        firestore.collection("farmers").document(farmerId)
                            .update("balance", farmer.getBalance(), "updatedAt", farmer.getUpdatedAt())
                            .addOnSuccessListener(aVoid -> listener.onSuccess(farmerId))
                            .addOnFailureListener(e -> listener.onFailure(e.getMessage()));
                    }
                } else {
                    listener.onFailure("Farmer not found");
                }
            })
            .addOnFailureListener(e -> listener.onFailure(e.getMessage()));
    }

    /**
     * Update farmer details (name, mobile, location, rate)
     */
    public void updateFarmerDetails(String farmerId, String name, String mobile, String location, double defaultRate, OnCompleteListener listener) {
        firestore.collection("farmers").document(farmerId)
            .get()
            .addOnSuccessListener(documentSnapshot -> {
                if (documentSnapshot.exists()) {
                    Farmer farmer = documentSnapshot.toObject(Farmer.class);
                    if (farmer != null) {
                        farmer.setName(name);
                        farmer.setMobile(mobile);
                        farmer.setFarmLocation(location);
                        farmer.setDefaultRate(defaultRate);
                        farmer.setUpdatedAt(new java.util.Date());
                        
                        updateFarmer(farmerId, farmer, listener);
                    }
                } else {
                    listener.onFailure("Farmer not found");
                }
            })
            .addOnFailureListener(e -> listener.onFailure(e.getMessage()));
    }
    
    /**
     * Delete farmer (soft delete - set isActive to false)
     */
    public void deleteFarmer(String farmerId, OnCompleteListener listener) {
        firestore.collection("farmers").document(farmerId)
            .update("isActive", false, "updatedAt", new java.util.Date())
            .addOnSuccessListener(aVoid -> listener.onSuccess(farmerId))
            .addOnFailureListener(e -> listener.onFailure(e.getMessage()));
    }
    
    public void deleteAllFarmers(String familyId) {
        firestore.collection("farmers")
            .whereEqualTo("familyId", familyId)
            .get()
            .addOnSuccessListener(querySnapshot -> {
                for (com.google.firebase.firestore.DocumentSnapshot doc : querySnapshot.getDocuments()) {
                    doc.getReference().delete();
                }
            });
    }
    
    /**
     * Get farmer by ID (LiveData for real-time updates)
     */
    public LiveData<Farmer> getFarmerByIdLiveData(String farmerId) {
        return new FirestoreDocumentLiveData<>(
            firestore.collection("farmers").document(farmerId), 
            Farmer.class
        );
    }

    public LiveData<Farmer> getFarmer(String farmerId) {
        return getFarmerByIdLiveData(farmerId);
    }
    
    /**
     * Get farmer count for dashboard
     */
    public LiveData<Integer> getFarmerCount(String familyId) {
        MutableLiveData<Integer> countLiveData = new MutableLiveData<>();
        
        firestore.collection("farmers")
            .whereEqualTo("familyId", familyId)
            .whereEqualTo("isActive", true)
            .addSnapshotListener((querySnapshot, error) -> {
                if (error != null || querySnapshot == null) {
                    countLiveData.setValue(0);
                    return;
                }
                countLiveData.setValue(querySnapshot.size());
            });
        
        return countLiveData;
    }

    /**
     * Get count of farmers with outstanding balance
     */
    public LiveData<Integer> getFarmersWithBalanceCount(String familyId) {
        MutableLiveData<Integer> countLiveData = new MutableLiveData<>();
        
        firestore.collection("farmers")
            .whereEqualTo("familyId", familyId)
            .whereEqualTo("isActive", true)
            .whereGreaterThan("balance", 0)
            .addSnapshotListener((querySnapshot, error) -> {
                if (error != null || querySnapshot == null) {
                    countLiveData.setValue(0);
                    return;
                }
                countLiveData.setValue(querySnapshot.size());
            });
        
        return countLiveData;
    }
    
    /**
     * Get total balance across all farmers
     */
    public LiveData<Double> getTotalBalance(String familyId) {
        MutableLiveData<Double> totalBalanceLiveData = new MutableLiveData<>();
        
        firestore.collection("farmers")
            .whereEqualTo("familyId", familyId)
            .whereEqualTo("isActive", true)
            .addSnapshotListener((querySnapshot, error) -> {
                if (error != null || querySnapshot == null) {
                    totalBalanceLiveData.setValue(0.0);
                    return;
                }
                
                double total = 0.0;
                for (com.google.firebase.firestore.DocumentSnapshot doc : querySnapshot.getDocuments()) {
                    Farmer farmer = doc.toObject(Farmer.class);
                    if (farmer != null) {
                        total += farmer.getBalance();
                    }
                }
                totalBalanceLiveData.setValue(total);
            });
        
        return totalBalanceLiveData;
    }
    
    /**
     * Convert Farmer object to Map for Firestore
     */
    private Map<String, Object> farmerToMap(Farmer farmer) {
        Map<String, Object> map = new HashMap<>();
        map.put("userId", farmer.getUserId());
        map.put("familyId", farmer.getFamilyId());
        map.put("name", farmer.getName());
        map.put("mobile", farmer.getMobile());
        map.put("farmLocation", farmer.getFarmLocation());
        map.put("defaultRate", farmer.getDefaultRate());
        map.put("balance", farmer.getBalance());
        map.put("isActive", farmer.isActive());
        map.put("createdAt", farmer.getCreatedAt() != null ? farmer.getCreatedAt() : new java.util.Date());
        map.put("updatedAt", new java.util.Date());
        return map;
    }
    
    /**
     * Callback interface for Firestore operations
     */
    public interface OnCompleteListener {
        void onSuccess(String documentId);
        void onFailure(String error);
    }
}
