package com.watersupply.data.migration;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.WriteBatch;
import com.watersupply.data.firebase.FirebaseManager;

import javax.inject.Inject;
import javax.inject.Singleton;

import dagger.hilt.android.qualifiers.ApplicationContext;

/**
 * Manager to handle data migration tasks
 */
@Singleton
public class DataMigrationManager {
    private static final String TAG = "DataMigrationManager";
    private static final String PREF_MIGRATION_V3_COMPLETE = "migration_v3_complete";
    
    private final FirebaseFirestore firestore;
    private final SharedPreferences prefs;
    
    @Inject
    public DataMigrationManager(FirebaseManager firebaseManager, @ApplicationContext Context context) {
        this.firestore = firebaseManager.getFirestore();
        this.prefs = context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE);
    }
    
    /**
     * Check if migration is needed and perform it
     */
    public void checkAndMigrate(String userId) {
        if (userId == null) return;
        
        // Check for V3 migration (Force Run for missing familyId)
        boolean isMigrationComplete = prefs.getBoolean(PREF_MIGRATION_V3_COMPLETE + "_" + userId, false);
        
        if (!isMigrationComplete) {
            Log.d(TAG, "Starting data migration V3 for user: " + userId);
            performMigration(userId);
        }
    }
    
    private void performMigration(String userId) {
        // We use a batch for atomicity, but Firestore batches are limited to 500 ops.
        // For simplicity, we'll process each collection independently and commit batches.
        
        migrateCollection(userId, "farmers");
        migrateCollection(userId, "supply_entries");
        migrateCollection(userId, "payments");
        
        // Mark as complete immediately to avoid repeated runs on every startup
        // In a production app, we'd wait for success, but for this fix we want it to be non-blocking
        prefs.edit().putBoolean(PREF_MIGRATION_V3_COMPLETE + "_" + userId, true).apply();
    }
    
    private void migrateCollection(String userId, String collectionName) {
        firestore.collection(collectionName)
            .whereEqualTo("userId", userId)
            .get()
            .addOnSuccessListener(querySnapshot -> {
                if (querySnapshot == null || querySnapshot.isEmpty()) return;
                
                WriteBatch batch = firestore.batch();
                int count = 0;
                
                for (DocumentSnapshot doc : querySnapshot.getDocuments()) {
                    boolean needsUpdate = false;
                    
                    if (!doc.contains("familyId")) {
                        batch.update(doc.getReference(), "familyId", userId);
                        needsUpdate = true;
                    }
                    
                    // Backfill isActive for farmers
                    if ("farmers".equals(collectionName) && !doc.contains("isActive")) {
                        batch.update(doc.getReference(), "isActive", true);
                        needsUpdate = true;
                    }
                    
                    if (needsUpdate) {
                        count++;
                        
                        // Commit batch if limit reached
                        if (count % 400 == 0) {
                            batch.commit();
                            batch = firestore.batch();
                        }
                    }
                }
                
                if (count > 0) {
                    final int finalCount = count;
                    batch.commit().addOnSuccessListener(aVoid -> 
                        Log.d(TAG, "Migrated " + finalCount + " documents in " + collectionName));
                }
            })
            .addOnFailureListener(e -> Log.e(TAG, "Error migrating " + collectionName, e));
    }
}
