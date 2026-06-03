package com.watersupply.data.repository;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.WriteBatch;
import com.google.firebase.firestore.DocumentReference;
import com.watersupply.data.firebase.FirebaseManager;
import com.watersupply.data.firebase.FirestoreQueryLiveData;
import com.watersupply.data.models.Payment;
import com.watersupply.data.models.Settlement;
import com.watersupply.data.models.SupplyEntry;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;
import javax.inject.Singleton;

/**
 * Repository for Settlement operations.
 * Uses Firestore batch writes for atomic all-or-nothing settlement execution.
 */
@Singleton
public class SettlementRepository {
    private static final String TAG = "SettlementRepository";
    private static final String COLLECTION_SETTLEMENTS = "settlements";
    private static final String COLLECTION_SUPPLY = "supply_entries";
    private static final String COLLECTION_PAYMENTS = "payments";
    private static final String COLLECTION_FARMERS = "farmers";

    private final FirebaseFirestore firestore;

    @Inject
    public SettlementRepository(FirebaseManager firebaseManager) {
        this.firestore = firebaseManager.getFirestore();
    }

    /**
     * Fetch all unsettled supply entries for a farmer.
     * Includes entries with settlementStatus == "unsettled" OR null (backward compat).
     */
    public void getUnsettledSupplyEntries(String familyId, String farmerId, OnDataCallback<List<SupplyEntry>> callback) {
        firestore.collection(COLLECTION_SUPPLY)
            .whereEqualTo("familyId", familyId)
            .whereEqualTo("farmerId", farmerId)
            .get()
            .addOnSuccessListener(querySnapshot -> {
                List<SupplyEntry> unsettled = new ArrayList<>();
                for (SupplyEntry entry : querySnapshot.toObjects(SupplyEntry.class)) {
                    String status = entry.getSettlementStatus();
                    if ("unsettled".equals(status)) {
                        unsettled.add(entry);
                    }
                }
                callback.onSuccess(unsettled);
            })
            .addOnFailureListener(e -> {
                Log.e(TAG, "Failed to fetch unsettled entries", e);
                callback.onFailure(e.getMessage());
            });
    }

    /**
     * Fetch standalone payments (not linked to any settlement) for a farmer.
     */
    public void getUnlinkedPayments(String familyId, String farmerId, OnDataCallback<List<Payment>> callback) {
        firestore.collection(COLLECTION_PAYMENTS)
            .whereEqualTo("familyId", familyId)
            .whereEqualTo("farmerId", farmerId)
            .get()
            .addOnSuccessListener(querySnapshot -> {
                List<Payment> unlinked = new ArrayList<>();
                for (Payment payment : querySnapshot.toObjects(Payment.class)) {
                    if (payment.getSettlementId() == null) {
                        unlinked.add(payment);
                    }
                }
                callback.onSuccess(unlinked);
            })
            .addOnFailureListener(e -> {
                Log.e(TAG, "Failed to fetch unlinked payments", e);
                callback.onFailure(e.getMessage());
            });
    }

    /**
     * Execute a settlement as a single atomic Firestore batch write.
     *
     * Operations in the batch:
     * 1. Create Settlement document
     * 2. Mark all unsettled supply entries as "settled"
     * 3. Link existing standalone payments to this settlement
     * 4. Create a new Payment record for the amount received (if > 0)
     * 5. Set farmer balance to 0
     */
    public void performSettlement(
        Settlement settlement,
        List<SupplyEntry> supplyEntries,
        List<Payment> existingPayments,
        OnCompleteListener listener
    ) {
        WriteBatch batch = firestore.batch();

        // 1. Create Settlement document
        String settlementId = settlement.getId();
        if (settlementId == null) {
            settlementId = firestore.collection(COLLECTION_SETTLEMENTS).document().getId();
            settlement.setId(settlementId);
        }
        settlement.setCreatedAt(new Date());
        settlement.setUpdatedAt(new Date());

        // Collect IDs for the settlement record
        List<String> supplyIds = new ArrayList<>();
        List<String> paymentIds = new ArrayList<>();

        DocumentReference settlementRef = firestore.collection(COLLECTION_SETTLEMENTS).document(settlementId);
        batch.set(settlementRef, settlement);

        // 2. Mark supply entries as settled
        for (SupplyEntry entry : supplyEntries) {
            if (entry.getId() != null) {
                supplyIds.add(entry.getId());
                DocumentReference entryRef = firestore.collection(COLLECTION_SUPPLY).document(entry.getId());
                batch.update(entryRef, 
                    "settlementStatus", "settled",
                    "settlementId", settlementId,
                    "updatedAt", new Date());
            }
        }

        // 3. Link existing payments to this settlement
        for (Payment payment : existingPayments) {
            if (payment.getId() != null) {
                paymentIds.add(payment.getId());
                DocumentReference paymentRef = firestore.collection(COLLECTION_PAYMENTS).document(payment.getId());
                batch.update(paymentRef, 
                    "settlementId", settlementId,
                    "updatedAt", new Date());
            }
        }

        // 4. Create new payment record if amount received > 0
        if (settlement.getAmountReceived() > 0) {
            Payment newPayment = new Payment();
            String paymentId = firestore.collection(COLLECTION_PAYMENTS).document().getId();
            newPayment.setId(paymentId);
            newPayment.setUserId(settlement.getUserId());
            newPayment.setFamilyId(settlement.getFamilyId());
            newPayment.setFarmerId(settlement.getFarmerId());
            newPayment.setFarmerName(settlement.getFarmerName());
            newPayment.setPaymentDate(settlement.getSettlementDate());
            newPayment.setAmount(settlement.getAmountReceived());
            newPayment.setPaymentMethod(settlement.getPaymentMethod());
            newPayment.setTransactionId(settlement.getTransactionId());
            newPayment.setRemarks("Settlement: " + (settlement.getRemarks() != null ? settlement.getRemarks() : "Hisab settled"));
            newPayment.setSettlementId(settlementId);
            newPayment.setCreatedAt(new Date());
            newPayment.setUpdatedAt(new Date());

            paymentIds.add(paymentId);
            DocumentReference newPaymentRef = firestore.collection(COLLECTION_PAYMENTS).document(paymentId);
            batch.set(newPaymentRef, newPayment);
        }

        // Update settlement with collected IDs
        batch.update(settlementRef, 
            "settledSupplyIds", supplyIds,
            "settledPaymentIds", paymentIds);

        // 5. Reset farmer balance to 0
        DocumentReference farmerRef = firestore.collection(COLLECTION_FARMERS).document(settlement.getFarmerId());
        batch.update(farmerRef, 
            "balance", 0.0,
            "updatedAt", new Date());

        // Commit the atomic batch
        final String finalSettlementId = settlementId;
        batch.commit()
            .addOnSuccessListener(aVoid -> {
                Log.d(TAG, "Settlement committed successfully: " + finalSettlementId);
                listener.onSuccess(finalSettlementId);
            })
            .addOnFailureListener(e -> {
                Log.e(TAG, "Settlement batch failed", e);
                listener.onFailure("Settlement failed: " + e.getMessage());
            });
    }

    /**
     * Revert and delete a settlement.
     * Restores all supply entries back to "unsettled" and unlinks payments,
     * deletes the new payment record if one was created, and restores the farmer's balance.
     */
    public void deleteSettlement(Settlement settlement, OnCompleteListener listener) {
        List<String> paymentIds = settlement.getSettledPaymentIds();
        if (paymentIds == null || paymentIds.isEmpty()) {
            executeDeleteSettlementBatch(settlement, new ArrayList<>(), listener);
            return;
        }

        List<Payment> fetchedPayments = new ArrayList<>();
        java.util.concurrent.atomic.AtomicInteger pendingQueries = new java.util.concurrent.atomic.AtomicInteger(paymentIds.size());
        
        for (String paymentId : paymentIds) {
            firestore.collection(COLLECTION_PAYMENTS).document(paymentId).get()
                .addOnSuccessListener(documentSnapshot -> {
                    if (documentSnapshot.exists()) {
                        Payment p = documentSnapshot.toObject(Payment.class);
                        if (p != null) {
                            fetchedPayments.add(p);
                        }
                    }
                    if (pendingQueries.decrementAndGet() == 0) {
                        executeDeleteSettlementBatch(settlement, fetchedPayments, listener);
                    }
                })
                .addOnFailureListener(e -> {
                    if (pendingQueries.decrementAndGet() == 0) {
                        executeDeleteSettlementBatch(settlement, fetchedPayments, listener);
                    }
                });
        }
    }

    private void executeDeleteSettlementBatch(Settlement settlement, List<Payment> payments, OnCompleteListener listener) {
        WriteBatch batch = firestore.batch();

        // 1. Revert supply entries to unsettled
        if (settlement.getSettledSupplyIds() != null) {
            for (String supplyId : settlement.getSettledSupplyIds()) {
                DocumentReference entryRef = firestore.collection(COLLECTION_SUPPLY).document(supplyId);
                batch.update(entryRef,
                    "settlementStatus", "unsettled",
                    "settlementId", com.google.firebase.firestore.FieldValue.delete(),
                    "updatedAt", new Date());
            }
        }

        // 2. Revert payments
        for (Payment payment : payments) {
            DocumentReference paymentRef = firestore.collection(COLLECTION_PAYMENTS).document(payment.getId());
            if (payment.getRemarks() != null && payment.getRemarks().startsWith("Settlement:")) {
                batch.delete(paymentRef);
            } else {
                batch.update(paymentRef,
                    "settlementId", com.google.firebase.firestore.FieldValue.delete(),
                    "updatedAt", new Date());
            }
        }

        // 3. Restore farmer's balance by incrementing it back with the outstanding amount
        DocumentReference farmerRef = firestore.collection(COLLECTION_FARMERS).document(settlement.getFarmerId());
        batch.update(farmerRef,
            "balance", com.google.firebase.firestore.FieldValue.increment(settlement.getOutstandingAmount()),
            "updatedAt", new Date());

        // 4. Delete the settlement document itself
        DocumentReference settlementRef = firestore.collection(COLLECTION_SETTLEMENTS).document(settlement.getId());
        batch.delete(settlementRef);

        batch.commit()
            .addOnSuccessListener(aVoid -> listener.onSuccess(settlement.getId()))
            .addOnFailureListener(e -> listener.onFailure(e.getMessage()));
    }

    /**
     * Get all settlements for a farmer (LiveData, real-time).
     */
    public LiveData<List<Settlement>> getSettlementsByFarmer(String familyId, String farmerId) {
        Query query = firestore.collection(COLLECTION_SETTLEMENTS)
            .whereEqualTo("familyId", familyId)
            .whereEqualTo("farmerId", farmerId);
        return new FirestoreQueryLiveData<>(query, Settlement.class);
    }

    /**
     * Get all settlements for the family.
     */
    public LiveData<List<Settlement>> getAllSettlements(String familyId) {
        Query query = firestore.collection(COLLECTION_SETTLEMENTS)
            .whereEqualTo("familyId", familyId);
        return new FirestoreQueryLiveData<>(query, Settlement.class);
    }

    public interface OnCompleteListener {
        void onSuccess(String settlementId);
        void onFailure(String error);
    }

    public interface OnDataCallback<T> {
        void onSuccess(T data);
        void onFailure(String error);
    }
}

