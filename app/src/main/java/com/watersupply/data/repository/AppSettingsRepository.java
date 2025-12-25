package com.watersupply.data.repository;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.google.firebase.firestore.FirebaseFirestore;
import com.watersupply.data.firebase.FirebaseManager;
import com.watersupply.data.firebase.FirestoreDocumentLiveData;
import com.watersupply.data.models.AppSettings;

import javax.inject.Inject;
import javax.inject.Singleton;

/**
 * Repository for App Settings data operations with Firebase Firestore
 */
@Singleton
public class AppSettingsRepository {
    private final FirebaseFirestore firestore;
    
    @Inject
    public AppSettingsRepository(FirebaseManager firebaseManager) {
        this.firestore = firebaseManager.getFirestore();
    }
    
    /**
     * Get settings for a specific user
     */
    public LiveData<AppSettings> getSettings(String userId) {
        return new FirestoreDocumentLiveData<>(
            firestore.collection("settings").document(userId),
            AppSettings.class
        );
    }
    
    /**
     * Save or update settings
     */
    public void saveSettings(AppSettings settings, OnCompleteListener listener) {
        if (settings.getUserId() == null) {
            listener.onFailure("User ID is required");
            return;
        }
        
        settings.setUpdatedAt(new java.util.Date());
        if (settings.getCreatedAt() == null) {
            settings.setCreatedAt(new java.util.Date());
        }
        
        // Use userId as document ID for 1:1 mapping
        firestore.collection("settings").document(settings.getUserId())
            .set(settings)
            .addOnSuccessListener(aVoid -> listener.onSuccess(settings.getUserId()))
            .addOnFailureListener(e -> listener.onFailure(e.getMessage()));
    }
    
    /**
     * Callback interface
     */
    public interface OnCompleteListener {
        void onSuccess(String documentId);
        void onFailure(String error);
    }
}
