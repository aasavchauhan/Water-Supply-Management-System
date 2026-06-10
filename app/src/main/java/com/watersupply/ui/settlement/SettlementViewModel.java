package com.watersupply.ui.settlement;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.watersupply.data.models.Farmer;
import com.watersupply.data.models.Payment;
import com.watersupply.data.models.Settlement;
import com.watersupply.data.models.SupplyEntry;
import com.watersupply.data.repository.AuthRepository;
import com.watersupply.data.repository.FarmerRepository;
import com.watersupply.data.repository.SettlementRepository;
import com.watersupply.utils.BillingCalculator;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import dagger.hilt.android.lifecycle.HiltViewModel;

@HiltViewModel
public class SettlementViewModel extends ViewModel {
    private final SettlementRepository settlementRepository;
    private final FarmerRepository farmerRepository;
    private final AuthRepository authRepository;

    private final MutableLiveData<List<SupplyEntry>> unsettledEntries = new MutableLiveData<>(new ArrayList<>());
    private final MutableLiveData<List<Payment>> unlinkedPayments = new MutableLiveData<>(new ArrayList<>());
    private final MutableLiveData<Double> totalCharges = new MutableLiveData<>(0.0);
    private final MutableLiveData<Double> totalPreviousPayments = new MutableLiveData<>(0.0);
    private final MutableLiveData<Double> outstandingAmount = new MutableLiveData<>(0.0);
    private final MutableLiveData<Boolean> isLoading = new MutableLiveData<>(false);
    private final MutableLiveData<String> settlementResult = new MutableLiveData<>();
    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();

    @Inject
    public SettlementViewModel(
        SettlementRepository settlementRepository,
        FarmerRepository farmerRepository,
        AuthRepository authRepository
    ) {
        this.settlementRepository = settlementRepository;
        this.farmerRepository = farmerRepository;
        this.authRepository = authRepository;
    }

    public LiveData<Farmer> getFarmerById(String farmerId) {
        return farmerRepository.getFarmerByIdLiveData(farmerId);
    }

    /**
     * Load unsettled supply entries and unlinked payments for a farmer.
     */
    public void loadSettlementData(String farmerId) {
        String familyId = authRepository.getCurrentFamilyId();
        if (familyId == null) return;

        isLoading.setValue(true);

        // Load unsettled entries
        settlementRepository.getUnsettledSupplyEntries(familyId, farmerId,
            new SettlementRepository.OnDataCallback<List<SupplyEntry>>() {
                @Override
                public void onSuccess(List<SupplyEntry> entries) {
                    unsettledEntries.setValue(entries);
                    double charges = 0;
                    for (SupplyEntry entry : entries) {
                        charges = BillingCalculator.addAmounts(charges, entry.getAmount());
                    }
                    totalCharges.setValue(charges);

                    // Now load unlinked payments
                    loadUnlinkedPayments(farmerId, familyId, charges);
                }

                @Override
                public void onFailure(String error) {
                    isLoading.setValue(false);
                    errorMessage.setValue("Failed to load entries: " + error);
                }
            });
    }

    private void loadUnlinkedPayments(String farmerId, String familyId, double charges) {
        settlementRepository.getUnlinkedPayments(familyId, farmerId,
            new SettlementRepository.OnDataCallback<List<Payment>>() {
                @Override
                public void onSuccess(List<Payment> payments) {
                    unlinkedPayments.setValue(payments);
                    double prevPayments = 0;
                    for (Payment p : payments) {
                        prevPayments = BillingCalculator.addAmounts(prevPayments, p.getAmount());
                    }
                    totalPreviousPayments.setValue(prevPayments);
                    outstandingAmount.setValue(
                        BillingCalculator.normalizeAmount(charges - prevPayments));
                    isLoading.setValue(false);
                }

                @Override
                public void onFailure(String error) {
                    isLoading.setValue(false);
                    errorMessage.setValue("Failed to load payments: " + error);
                }
            });
    }

    /**
     * Execute the settlement.
     */
    public void performSettlement(
        String farmerId,
        String farmerName,
        String settlementDate,
        double amountReceived,
        String paymentMethod,
        String transactionId,
        String remarks
    ) {
        String userId = authRepository.getCurrentUserId();
        String familyId = authRepository.getCurrentFamilyId();
        if (userId == null || familyId == null) return;

        Double charges = totalCharges.getValue();
        Double prevPayments = totalPreviousPayments.getValue();
        Double outstanding = outstandingAmount.getValue();
        if (charges == null) charges = 0.0;
        if (prevPayments == null) prevPayments = 0.0;
        if (outstanding == null) outstanding = 0.0;

        amountReceived = BillingCalculator.normalizeAmount(amountReceived);
        double adjustment = BillingCalculator.normalizeAmount(outstanding - amountReceived);
        String adjustmentType;
        if (adjustment == 0) {
            adjustmentType = "EXACT";
        } else if (adjustment > 0) {
            adjustmentType = "WRITEOFF";
        } else {
            adjustmentType = "OVERPAYMENT";
        }

        Settlement settlement = new Settlement();
        settlement.setUserId(userId);
        settlement.setFamilyId(familyId);
        settlement.setFarmerId(farmerId);
        settlement.setFarmerName(farmerName);
        settlement.setSettlementDate(settlementDate);
        settlement.setTotalCharges(charges);
        settlement.setTotalPreviousPayments(prevPayments);
        settlement.setOutstandingAmount(outstanding);
        settlement.setAmountReceived(amountReceived);
        settlement.setAdjustmentAmount(Math.abs(adjustment));
        settlement.setAdjustmentType(adjustmentType);
        settlement.setPaymentMethod(paymentMethod);
        settlement.setTransactionId(transactionId);
        settlement.setRemarks(remarks);

        List<SupplyEntry> entries = unsettledEntries.getValue();
        List<Payment> payments = unlinkedPayments.getValue();
        if (entries == null) entries = new ArrayList<>();
        if (payments == null) payments = new ArrayList<>();

        isLoading.setValue(true);

        settlementRepository.performSettlement(settlement, entries, payments,
            new SettlementRepository.OnCompleteListener() {
                @Override
                public void onSuccess(String settlementId) {
                    isLoading.setValue(false);
                    settlementResult.setValue(settlementId);
                }

                @Override
                public void onFailure(String error) {
                    isLoading.setValue(false);
                    errorMessage.setValue(error);
                }
            });
    }

    // LiveData getters
    public LiveData<List<SupplyEntry>> getUnsettledEntries() { return unsettledEntries; }
    public LiveData<List<Payment>> getUnlinkedPayments() { return unlinkedPayments; }
    public LiveData<Double> getTotalCharges() { return totalCharges; }
    public LiveData<Double> getTotalPreviousPayments() { return totalPreviousPayments; }
    public LiveData<Double> getOutstandingAmount() { return outstandingAmount; }
    public LiveData<Boolean> getIsLoading() { return isLoading; }
    public LiveData<String> getSettlementResult() { return settlementResult; }
    public LiveData<String> getErrorMessage() { return errorMessage; }

    /**
     * Get settlement history for a farmer.
     */
    public LiveData<List<Settlement>> getSettlements(String farmerId) {
        String familyId = authRepository.getCurrentFamilyId();
        return settlementRepository.getSettlementsByFarmer(familyId, farmerId);
    }
}
