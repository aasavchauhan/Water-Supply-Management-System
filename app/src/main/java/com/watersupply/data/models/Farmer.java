package com.watersupply.data.models;

import com.google.firebase.firestore.DocumentId;
import com.google.firebase.firestore.ServerTimestamp;

import java.util.Date;

/**
 * Farmer model for Firestore
 */
public class Farmer {
    @DocumentId
    private String id;
    private String userId;
    private String familyId;
    private String name;
    private String mobile;
    private String farmLocation;
    private double defaultRate;
    private double balance;
    private boolean isActive;
    @ServerTimestamp
    private Date createdAt;
    @ServerTimestamp
    private Date updatedAt;
    
    // Required empty constructor for Firestore
    public Farmer() {
        this.balance = 0.0;
        this.isActive = true;
    }
    
    public Farmer(String userId, String name, String mobile) {
        this();
        this.userId = userId;
        this.name = name;
        this.mobile = mobile;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getFamilyId() {
        return familyId;
    }

    public void setFamilyId(String familyId) {
        this.familyId = familyId;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getMobile() {
        return mobile;
    }
    
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }
    
    public String getFarmLocation() {
        return farmLocation;
    }
    
    public void setFarmLocation(String farmLocation) {
        this.farmLocation = farmLocation;
    }
    
    public double getDefaultRate() {
        return defaultRate;
    }
    
    public void setDefaultRate(double defaultRate) {
        this.defaultRate = defaultRate;
    }
    
    public double getBalance() {
        return balance;
    }
    
    public void setBalance(double balance) {
        this.balance = balance;
    }
    
    @com.google.firebase.firestore.PropertyName("isActive")
    public boolean isActive() {
        return isActive;
    }
    
    @com.google.firebase.firestore.PropertyName("isActive")
    public void setActive(boolean active) {
        isActive = active;
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
    @Override
    public String toString() {
        return name != null ? name : "Unknown Farmer";
    }
}
