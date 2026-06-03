package com.watersupply.data.models;

import com.google.firebase.firestore.DocumentId;
import com.google.firebase.firestore.ServerTimestamp;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Settlement model for Firestore.
 * Represents a "hisab settlement" — a point-in-time event where a farmer settles
 * their outstanding balance. Records what was owed, what was paid, and the adjustment.
 */
public class Settlement implements Serializable {
    @DocumentId
    private String id;
    private String userId;
    private String familyId;
    private String farmerId;
    private String farmerName;
    private String settlementDate;          // yyyy-MM-dd
    private double totalCharges;            // sum of unsettled supply amounts
    private double totalPreviousPayments;   // standalone payments already made
    private double outstandingAmount;       // totalCharges - totalPreviousPayments
    private double amountReceived;          // what farmer actually paid now
    private double adjustmentAmount;        // outstandingAmount - amountReceived
    private String adjustmentType;          // EXACT | WRITEOFF | OVERPAYMENT
    private String paymentMethod;           // Cash / UPI / Bank Transfer
    private String transactionId;
    private String remarks;
    private List<String> settledSupplyIds;
    private List<String> settledPaymentIds;
    @ServerTimestamp
    private Date createdAt;
    @ServerTimestamp
    private Date updatedAt;

    // Required empty constructor for Firestore
    public Settlement() {
        this.settledSupplyIds = new ArrayList<>();
        this.settledPaymentIds = new ArrayList<>();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFamilyId() { return familyId; }
    public void setFamilyId(String familyId) { this.familyId = familyId; }

    public String getFarmerId() { return farmerId; }
    public void setFarmerId(String farmerId) { this.farmerId = farmerId; }

    public String getFarmerName() { return farmerName; }
    public void setFarmerName(String farmerName) { this.farmerName = farmerName; }

    public String getSettlementDate() { return settlementDate; }
    public void setSettlementDate(String settlementDate) { this.settlementDate = settlementDate; }

    public double getTotalCharges() { return totalCharges; }
    public void setTotalCharges(double totalCharges) { this.totalCharges = totalCharges; }

    public double getTotalPreviousPayments() { return totalPreviousPayments; }
    public void setTotalPreviousPayments(double totalPreviousPayments) { this.totalPreviousPayments = totalPreviousPayments; }

    public double getOutstandingAmount() { return outstandingAmount; }
    public void setOutstandingAmount(double outstandingAmount) { this.outstandingAmount = outstandingAmount; }

    public double getAmountReceived() { return amountReceived; }
    public void setAmountReceived(double amountReceived) { this.amountReceived = amountReceived; }

    public double getAdjustmentAmount() { return adjustmentAmount; }
    public void setAdjustmentAmount(double adjustmentAmount) { this.adjustmentAmount = adjustmentAmount; }

    public String getAdjustmentType() { return adjustmentType; }
    public void setAdjustmentType(String adjustmentType) { this.adjustmentType = adjustmentType; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public List<String> getSettledSupplyIds() { return settledSupplyIds; }
    public void setSettledSupplyIds(List<String> settledSupplyIds) { this.settledSupplyIds = settledSupplyIds; }

    public List<String> getSettledPaymentIds() { return settledPaymentIds; }
    public void setSettledPaymentIds(List<String> settledPaymentIds) { this.settledPaymentIds = settledPaymentIds; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}
