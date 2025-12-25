package com.watersupply;

import android.app.Application;
import com.google.firebase.FirebaseApp;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreSettings;
import com.watersupply.utils.ThemePreference;
import dagger.hilt.android.HiltAndroidApp;

/**
 * Main application class for Water Supply Management
 * Initializes Hilt dependency injection and applies user theme preference
 */
@HiltAndroidApp
public class WaterSupplyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        
        // Initialize Firebase
        FirebaseApp.initializeApp(this);
        
        // Enable offline persistence for Firestore
        FirebaseFirestore firestore = FirebaseFirestore.getInstance();
        FirebaseFirestoreSettings settings = new FirebaseFirestoreSettings.Builder()
                .setPersistenceEnabled(true)
                .setCacheSizeBytes(FirebaseFirestoreSettings.CACHE_SIZE_UNLIMITED)
                .build();
        firestore.setFirestoreSettings(settings);
        
        // Apply saved theme preference
        ThemePreference themePreference = new ThemePreference(this);
        themePreference.applyTheme();
    }
}
