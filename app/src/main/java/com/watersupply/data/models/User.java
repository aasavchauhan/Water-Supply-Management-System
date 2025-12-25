package com.watersupply.data.models;

import com.google.firebase.firestore.DocumentId;
import com.google.firebase.firestore.ServerTimestamp;

import java.util.Date;

/**
 * User model for Firestore
 */
public class User {
    @DocumentId
    private String id;
    private String name;
    private String email;
    private String mobile;
    private String role;
    private String familyId;
    private String pinHash;
    private boolean biometricEnabled;
    @ServerTimestamp
    private Date createdAt;
    @ServerTimestamp
    private Date updatedAt;
    
    // Required empty constructor for Firestore
    public User() {
        this.biometricEnabled = false;
        this.role = "user";
    }
    
    public User(String name, String email, String mobile) {
        this();
        this.name = name;
        this.email = email;
        this.mobile = mobile;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getMobile() {
        return mobile;
    }
    
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }

    public String getFamilyId() {
        return familyId;
    }

    public void setFamilyId(String familyId) {
        this.familyId = familyId;
    }
    
    public String getPinHash() {
        return pinHash;
    }
    
    public void setPinHash(String pinHash) {
        this.pinHash = pinHash;
    }
    
    public boolean isBiometricEnabled() {
        return biometricEnabled;
    }
    
    public void setBiometricEnabled(boolean biometricEnabled) {
        this.biometricEnabled = biometricEnabled;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
    
    public Date getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}
