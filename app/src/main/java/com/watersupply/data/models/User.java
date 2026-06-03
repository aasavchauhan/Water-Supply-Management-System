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
    @ServerTimestamp
    private Object createdAt;
    @ServerTimestamp
    private Object updatedAt;
    
    // Required empty constructor for Firestore
    public User() {
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
    
    public Date getCreatedAt() {
        if (createdAt == null) return null;
        if (createdAt instanceof Date) {
            return (Date) createdAt;
        } else if (createdAt instanceof com.google.firebase.Timestamp) {
            return ((com.google.firebase.Timestamp) createdAt).toDate();
        } else if (createdAt instanceof Long) {
            return new Date((Long) createdAt);
        } else if (createdAt instanceof Double) {
            return new Date(((Double) createdAt).longValue());
        }
        return null;
    }
    
    public void setCreatedAt(Object createdAt) {
        this.createdAt = createdAt;
    }
    
    public Date getUpdatedAt() {
        if (updatedAt == null) return null;
        if (updatedAt instanceof Date) {
            return (Date) updatedAt;
        } else if (updatedAt instanceof com.google.firebase.Timestamp) {
            return ((com.google.firebase.Timestamp) updatedAt).toDate();
        } else if (updatedAt instanceof Long) {
            return new Date((Long) updatedAt);
        } else if (updatedAt instanceof Double) {
            return new Date(((Double) updatedAt).longValue());
        }
        return null;
    }
    
    public void setUpdatedAt(Object updatedAt) {
        this.updatedAt = updatedAt;
    }
}
