package com.watersupply.data.models;

import com.google.firebase.firestore.DocumentId;
import com.google.firebase.firestore.ServerTimestamp;

import java.util.Date;

import java.io.Serializable;

/**
 * Supply Entry model for Firestore
 */
public class SupplyEntry implements Serializable {
    @DocumentId
    private String id;
    private String userId;
    private String familyId;
    private String farmerId;
    private String farmerName; // Denormalized for easier querying
    private String date;
    private String billingMethod; // "time" or "meter"
    private String startTime;
    private String stopTime;
    private double pauseDuration;
    private Double meterReadingStart;
    private Double meterReadingEnd;
    private Double totalTimeUsed;
    private Double totalWaterUsed;
    private double rate;
    private double amount;
    private String remarks;
    @ServerTimestamp
    private Date createdAt;
    @ServerTimestamp
    private Date updatedAt;
    private String status; // "completed" or "draft"
    
    // Required empty constructor for Firestore
    public SupplyEntry() {
        this.pauseDuration = 0.0;
    }
    
    public SupplyEntry(String userId, String farmerId, String farmerName) {
        this();
        this.userId = userId;
        this.farmerId = farmerId;
        this.farmerName = farmerName;
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
    
    public String getFarmerId() {
        return farmerId;
    }
    
    public void setFarmerId(String farmerId) {
        this.farmerId = farmerId;
    }
    
    public String getFarmerName() {
        return farmerName;
    }
    
    public void setFarmerName(String farmerName) {
        this.farmerName = farmerName;
    }
    
    public String getDate() {
        return date;
    }
    
    public void setDate(String date) {
        this.date = date;
    }
    
    public String getBillingMethod() {
        return billingMethod;
    }
    
    public void setBillingMethod(String billingMethod) {
        this.billingMethod = billingMethod;
    }
    
    public String getStartTime() {
        return startTime;
    }
    
    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }
    
    public String getStopTime() {
        return stopTime;
    }
    
    public void setStopTime(String stopTime) {
        this.stopTime = stopTime;
    }
    
    public double getPauseDuration() {
        return pauseDuration;
    }
    
    public void setPauseDuration(double pauseDuration) {
        this.pauseDuration = pauseDuration;
    }
    
    public Double getMeterReadingStart() {
        return meterReadingStart;
    }
    
    public void setMeterReadingStart(Double meterReadingStart) {
        this.meterReadingStart = meterReadingStart;
    }
    
    public Double getMeterReadingEnd() {
        return meterReadingEnd;
    }
    
    public void setMeterReadingEnd(Double meterReadingEnd) {
        this.meterReadingEnd = meterReadingEnd;
    }
    
    public Double getTotalTimeUsed() {
        return totalTimeUsed;
    }
    
    public void setTotalTimeUsed(Double totalTimeUsed) {
        this.totalTimeUsed = totalTimeUsed;
    }
    
    public Double getTotalWaterUsed() {
        return totalWaterUsed;
    }
    
    public void setTotalWaterUsed(Double totalWaterUsed) {
        this.totalWaterUsed = totalWaterUsed;
    }
    
    public double getRate() {
        return rate;
    }
    
    public void setRate(double rate) {
        this.rate = rate;
    }
    
    public double getAmount() {
        return amount;
    }
    
    public void setAmount(double amount) {
        this.amount = amount;
    }
    
    public String getRemarks() {
        return remarks;
    }
    
    public void setRemarks(String remarks) {
        this.remarks = remarks;
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

    public String getStatus() {
        return status != null ? status : "completed";
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
