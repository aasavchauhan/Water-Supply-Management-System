package com.watersupply.data.repository;

import android.content.Context;
import android.content.SharedPreferences;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;
import com.watersupply.data.firebase.FirebaseManager;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.inject.Singleton;

import dagger.hilt.android.qualifiers.ApplicationContext;

/**
 * Repository for Firebase Authentication operations
 */
@Singleton
public class AuthRepository {
    private final FirebaseAuth firebaseAuth;
    private final FirebaseFirestore firestore;
    private final SharedPreferences prefs;
    
    @Inject
    public AuthRepository(FirebaseManager firebaseManager, @ApplicationContext Context context) {
        this.firebaseAuth = firebaseManager.getAuth();
        this.firestore = firebaseManager.getFirestore();
        this.prefs = context.getSharedPreferences("user_session", Context.MODE_PRIVATE);
    }
    
    /**
     * Register new user with Firebase Authentication
     */
    public void registerWithEmail(String email, String password, String name, String mobile, OnAuthListener listener) {
        firebaseAuth.createUserWithEmailAndPassword(email, password)
            .addOnSuccessListener(authResult -> {
                FirebaseUser firebaseUser = authResult.getUser();
                if (firebaseUser != null) {
                    String userId = firebaseUser.getUid();
                    
                    // Create user document in Firestore
                    Map<String, Object> userData = new HashMap<>();
                    userData.put("name", name);
                    userData.put("email", email);
                    userData.put("mobile", mobile);
                    userData.put("role", "admin"); // Default to admin (own family)
                    userData.put("familyId", userId); // Default to own ID
                    userData.put("createdAt", System.currentTimeMillis());
                    userData.put("updatedAt", System.currentTimeMillis());
                    
                    firestore.collection("users").document(userId)
                        .set(userData)
                        .addOnSuccessListener(aVoid -> {
                            firebaseUser.sendEmailVerification();
                            saveUserSession(userId, userId, "admin", name, mobile);
                            listener.onAuthSuccess(userId);
                        })
                        .addOnFailureListener(e -> listener.onAuthFailure(e.getMessage()));
                } else {
                    listener.onAuthFailure("Failed to create user");
                }
            })
            .addOnFailureListener(e -> listener.onAuthFailure(e.getMessage()));
    }

    /**
     * Register user (helper for ViewModel)
     */
    public void registerUser(com.watersupply.data.models.User user, String password) {
        registerWithEmail(user.getEmail(), password, user.getName(), user.getMobile(), new OnAuthListener() {
            @Override
            public void onAuthSuccess(String userId) {
                // Registration successful
            }
            
            @Override
            public void onAuthFailure(String error) {
                // Registration failed
            }
        });
    }
    
    /**
     * Login with Firebase Authentication
     */
    public void loginWithEmail(String email, String password, OnAuthListener listener) {
        firebaseAuth.signInWithEmailAndPassword(email, password)
            .addOnSuccessListener(authResult -> {
                FirebaseUser firebaseUser = authResult.getUser();
                if (firebaseUser != null) {
                    String userId = firebaseUser.getUid();
                    
                    // Fetch user details to get familyId
                    firestore.collection("users").document(userId).get()
                        .addOnSuccessListener(documentSnapshot -> {
                            String familyId = documentSnapshot.getString("familyId");
                            String role = documentSnapshot.getString("role");
                            String name = documentSnapshot.getString("name");
                            String mobile = documentSnapshot.getString("mobile");
                            
                            // If familyId is missing (legacy user), use userId as familyId
                            if (familyId == null) {
                                familyId = userId;
                                // Optionally update the user document
                                firestore.collection("users").document(userId).update("familyId", familyId);
                            }
                            
                            saveUserSession(userId, familyId, role, name, mobile);
                            listener.onAuthSuccess(userId);
                        })
                        .addOnFailureListener(e -> {
                            // Fallback if fetch fails, though this shouldn't happen often
                            saveUserSession(userId, userId, "user", "User", "");
                            listener.onAuthSuccess(userId);
                        });
                } else {
                    listener.onAuthFailure("Login failed");
                }
            })
            .addOnFailureListener(e -> listener.onAuthFailure(e.getMessage()));
    }

    /**
     * Login with Google
     */
    public void loginWithGoogle(String idToken, OnAuthListener listener) {
        com.google.firebase.auth.AuthCredential credential = com.google.firebase.auth.GoogleAuthProvider.getCredential(idToken, null);
        firebaseAuth.signInWithCredential(credential)
            .addOnSuccessListener(authResult -> {
                FirebaseUser firebaseUser = authResult.getUser();
                if (firebaseUser != null) {
                    String userId = firebaseUser.getUid();
                    
                    // Check if user exists in Firestore, if not create
                    firestore.collection("users").document(userId).get()
                        .addOnSuccessListener(documentSnapshot -> {
                            if (!documentSnapshot.exists()) {
                                // Create new user from Google profile
                                Map<String, Object> userData = new HashMap<>();
                                userData.put("name", firebaseUser.getDisplayName());
                                userData.put("email", firebaseUser.getEmail());
                                String phone = firebaseUser.getPhoneNumber();
                                userData.put("mobile", phone != null ? phone : "");
                                userData.put("role", "admin");
                                userData.put("familyId", userId);
                                userData.put("createdAt", System.currentTimeMillis());
                                userData.put("updatedAt", System.currentTimeMillis());
                                
                                firestore.collection("users").document(userId).set(userData)
                                    .addOnSuccessListener(aVoid -> {
                                        saveUserSession(userId, userId, "admin", firebaseUser.getDisplayName(), firebaseUser.getPhoneNumber());
                                        listener.onAuthSuccess(userId);
                                    });
                            } else {
                                // Existing user
                                String familyId = documentSnapshot.getString("familyId");
                                String role = documentSnapshot.getString("role");
                                String name = documentSnapshot.getString("name");
                                String mobile = documentSnapshot.getString("mobile");
                                
                                if (familyId == null) familyId = userId;
                                
                                saveUserSession(userId, familyId, role, name, mobile);
                                listener.onAuthSuccess(userId);
                            }
                        })
                        .addOnFailureListener(e -> {
                            // Fallback
                            saveUserSession(userId, userId, "user", "User", "");
                            listener.onAuthSuccess(userId);
                        });
                } else {
                    listener.onAuthFailure("Google Sign-In failed");
                }
            })
            .addOnFailureListener(e -> listener.onAuthFailure(e.getMessage()));
    }
    
    /**
     * Check if user is currently logged in
     */
    public boolean isUserLoggedIn() {
        return firebaseAuth.getCurrentUser() != null;
    }
    
    /**
     * Save user session to SharedPreferences (for offline access)
     */
    public void saveUserSession(String userId, String familyId, String role, String name, String mobile) {
        prefs.edit()
            .putString("user_id", userId)
            .putString("family_id", familyId)
            .putString("user_role", role)
            .putString("user_name", name != null ? name : "User")
            .putString("user_mobile", mobile != null ? mobile : "")
            .putBoolean("is_logged_in", true)
            .apply();
    }
    
    /**
     * Get current family ID (for shared data access)
     */
    public String getCurrentFamilyId() {
        return prefs.getString("family_id", getCurrentUserId());
    }
    
    /**
     * Get current user role
     */
    public String getUserRole() {
        return prefs.getString("user_role", "user");
    }
    
    /**
     * Get current user ID
     */
    public String getCurrentUserId() {
        FirebaseUser user = firebaseAuth.getCurrentUser();
        return user != null ? user.getUid() : prefs.getString("user_id", null);
    }
    
    /**
     * Logout user
     */
    public void logout() {
        firebaseAuth.signOut();
        prefs.edit().clear().apply();
    }
    
    /**
     * Callback interface for authentication operations
     */
    public interface OnAuthListener {
        void onAuthSuccess(String userId);
        void onAuthFailure(String error);
    }
    
    public void sendPasswordResetEmail(String email, OnAuthListener listener) {
        firebaseAuth.sendPasswordResetEmail(email)
            .addOnSuccessListener(aVoid -> listener.onAuthSuccess("Email Sent"))
            .addOnFailureListener(e -> listener.onAuthFailure(e.getMessage()));
    }
    public androidx.lifecycle.LiveData<com.watersupply.data.models.User> getUser(String userId) {
        com.google.firebase.firestore.DocumentReference docRef = firestore.collection("users").document(userId);
        return new com.watersupply.data.firebase.FirestoreDocumentLiveData<>(docRef, com.watersupply.data.models.User.class);
    }
    
    // Phone Authentication
    public void sendOtp(android.app.Activity activity, String mobile, com.google.firebase.auth.PhoneAuthProvider.OnVerificationStateChangedCallbacks callbacks) {
        com.google.firebase.auth.PhoneAuthOptions options =
            com.google.firebase.auth.PhoneAuthOptions.newBuilder(firebaseAuth)
            .setPhoneNumber("+91" + mobile)       // Phone number to verify (Hardcoded +91 for now, or assume formatted)
            .setTimeout(60L, java.util.concurrent.TimeUnit.SECONDS) // Timeout and unit
            .setActivity(activity)                 // Activity (for callback binding)
            .setCallbacks(callbacks)          // OnVerificationStateChangedCallbacks
            .build();
        com.google.firebase.auth.PhoneAuthProvider.verifyPhoneNumber(options);
    }
    
    public void verifyOtp(String verificationId, String code, OnAuthListener listener) {
        com.google.firebase.auth.PhoneAuthCredential credential = com.google.firebase.auth.PhoneAuthProvider.getCredential(verificationId, code);
        signInWithPhoneCredential(credential, listener);
    }
    
    private void signInWithPhoneCredential(com.google.firebase.auth.PhoneAuthCredential credential, OnAuthListener listener) {
        firebaseAuth.signInWithCredential(credential)
            .addOnSuccessListener(authResult -> {
                FirebaseUser firebaseUser = authResult.getUser();
                if (firebaseUser != null) {
                    String userId = firebaseUser.getUid();
                    String mobile = firebaseUser.getPhoneNumber();
                    
                    // Check if user exists
                    firestore.collection("users").document(userId).get()
                        .addOnSuccessListener(documentSnapshot -> {
                            if (!documentSnapshot.exists()) {
                                // New User via Phone
                                Map<String, Object> userData = new HashMap<>();
                                userData.put("mobile", mobile != null ? mobile : "");
                                userData.put("role", "admin");
                                userData.put("familyId", userId);
                                userData.put("createdAt", System.currentTimeMillis());
                                userData.put("updatedAt", System.currentTimeMillis());
                                
                                firestore.collection("users").document(userId).set(userData)
                                    .addOnSuccessListener(aVoid -> {
                                        saveUserSession(userId, userId, "admin", "User", mobile);
                                        listener.onAuthSuccess(userId);
                                    });
                            } else {
                                // Existing User
                                String familyId = documentSnapshot.getString("familyId");
                                String role = documentSnapshot.getString("role");
                                String name = documentSnapshot.getString("name");
                                
                                if (familyId == null) familyId = userId;
                                saveUserSession(userId, familyId, role, name, mobile);
                                listener.onAuthSuccess(userId);
                            }
                        })
                        .addOnFailureListener(e -> {
                            // Recovery
                            saveUserSession(userId, userId, "user", "User", mobile);
                            listener.onAuthSuccess(userId);
                        });
                } else {
                    listener.onAuthFailure("Phone Auth Failed");
                }
            })
            .addOnFailureListener(e -> listener.onAuthFailure(e.getMessage()));
    }

    public void updateUserName(String userId, String name, OnAuthListener listener) {
        firestore.collection("users").document(userId)
            .update("name", name)
            .addOnSuccessListener(aVoid -> {
                // Update local session
                prefs.edit().putString("user_name", name).apply();
                listener.onAuthSuccess(userId);
            })
            .addOnFailureListener(e -> listener.onAuthFailure(e.getMessage()));
    }
}
