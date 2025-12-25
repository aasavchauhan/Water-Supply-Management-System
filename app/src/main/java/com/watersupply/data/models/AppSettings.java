package com.watersupply.data.models;

import com.google.firebase.firestore.DocumentId;
import com.google.firebase.firestore.ServerTimestamp;

import java.util.Date;

/**
 * App Settings model for Firestore
 */
public class AppSettings {
    @DocumentId
    private String id;
    private String userId;
    private String businessName;
    private String businessAddress;
    private String businessPhone;
    private double defaultHourlyRate;
    private String currency;
    private String currencySymbol;
    private String language;
    private String theme;
    @ServerTimestamp
    private Date createdAt;
    @ServerTimestamp
    private Date updatedAt;
    
    // Required empty constructor for Firestore
    public AppSettings() {
        this.defaultHourlyRate = 100.0;
        this.currency = "INR";
        this.currencySymbol = "₹";
        this.language = "en";
        this.theme = "light";
    }
    
    public AppSettings(String userId, String businessName) {
        this();
        this.userId = userId;
        this.businessName = businessName;
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
    
    public String getBusinessName() {
        return businessName;
    }
    
    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }
    
    public String getBusinessAddress() {
        return businessAddress;
    }
    
    public void setBusinessAddress(String businessAddress) {
        this.businessAddress = businessAddress;
    }
    
    public String getBusinessPhone() {
        return businessPhone;
    }
    
    public void setBusinessPhone(String businessPhone) {
        this.businessPhone = businessPhone;
    }
    
    public double getDefaultHourlyRate() {
        return defaultHourlyRate;
    }
    
    public void setDefaultHourlyRate(double defaultHourlyRate) {
        this.defaultHourlyRate = defaultHourlyRate;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public String getCurrencySymbol() {
        return currencySymbol;
    }
    
    public void setCurrencySymbol(String currencySymbol) {
        this.currencySymbol = currencySymbol;
    }
    
    public String getLanguage() {
        return language;
    }
    
    public void setLanguage(String language) {
        this.language = language;
    }
    
    public String getTheme() {
        return theme;
    }
    
    public void setTheme(String theme) {
        this.theme = theme;
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
