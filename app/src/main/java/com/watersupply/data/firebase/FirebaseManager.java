package com.watersupply.data.firebase;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;

import javax.inject.Inject;
import javax.inject.Singleton;

/**
 * Central manager for Firebase services
 */
@Singleton
public class FirebaseManager {
    
    private final FirebaseAuth auth;
    private final FirebaseFirestore firestore;
    @Inject
    public FirebaseManager() {
        this.auth = FirebaseAuth.getInstance();
        this.firestore = FirebaseFirestore.getInstance();
    }
    
    public FirebaseAuth getAuth() {
        return auth;
    }
    
    public FirebaseFirestore getFirestore() {
        return firestore;
    }
    
    public String getCurrentUserId() {
        return auth.getCurrentUser() != null ? auth.getCurrentUser().getUid() : null;
    }
    
    public boolean isUserLoggedIn() {
        return auth.getCurrentUser() != null;
    }
}
