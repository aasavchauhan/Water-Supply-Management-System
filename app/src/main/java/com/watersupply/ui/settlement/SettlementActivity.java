package com.watersupply.ui.settlement;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.watersupply.R;
import com.watersupply.databinding.ActivitySettlementBinding;
import com.watersupply.ui.supply.SupplyEntryAdapter;
import com.watersupply.utils.CurrencyFormatter;
import com.watersupply.utils.DateFormatter;

import java.util.Locale;

import dagger.hilt.android.AndroidEntryPoint;

@AndroidEntryPoint
public class SettlementActivity extends AppCompatActivity {
    private ActivitySettlementBinding binding;
    private SettlementViewModel viewModel;
    private String farmerId;
    private String farmerName = "";
    private String selectedPaymentMethod = "Cash";
    private boolean entriesVisible = false;
    private SupplyEntryAdapter entryAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySettlementBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        viewModel = new ViewModelProvider(this).get(SettlementViewModel.class);
        farmerId = getIntent().getStringExtra("farmer_id");

        if (farmerId == null) {
            Toast.makeText(this, "Error: No farmer selected", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        setupToolbar();
        setupEntriesList();
        setupPaymentMethodToggle();
        setupAmountWatcher();
        setupConfirmButton();
        setupToggleEntries();
        observeData();

        // Load data
        viewModel.loadSettlementData(farmerId);
    }

    private void setupToolbar() {
        binding.toolbar.setNavigationOnClickListener(v -> finish());
    }

    private void setupEntriesList() {
        entryAdapter = new SupplyEntryAdapter(entry -> {
            // Read-only in settlement context
        });
        entryAdapter.setDetailMode(true);
        binding.rvEntries.setLayoutManager(new LinearLayoutManager(this));
        binding.rvEntries.setAdapter(entryAdapter);
    }

    private void setupPaymentMethodToggle() {
        binding.paymentMethodGroup.addOnButtonCheckedListener((group, checkedId, isChecked) -> {
            if (!isChecked) return;
            if (checkedId == R.id.btnCash) {
                selectedPaymentMethod = "Cash";
                binding.tilTransactionId.setVisibility(View.GONE);
            } else if (checkedId == R.id.btnUpi) {
                selectedPaymentMethod = "UPI";
                binding.tilTransactionId.setVisibility(View.VISIBLE);
                binding.tilTransactionId.setHint("UPI Transaction ID");
            } else if (checkedId == R.id.btnBank) {
                selectedPaymentMethod = "Bank Transfer";
                binding.tilTransactionId.setVisibility(View.VISIBLE);
                binding.tilTransactionId.setHint("Transaction Reference");
            }
        });
    }

    private void setupAmountWatcher() {
        binding.etAmount.addTextChangedListener(new TextWatcher() {
            @Override
            public void afterTextChanged(Editable s) {
                updateAdjustmentDisplay();
            }
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}
        });
    }

    private void updateAdjustmentDisplay() {
        String amountStr = binding.etAmount.getText().toString().trim();
        Double outstanding = viewModel.getOutstandingAmount().getValue();
        if (outstanding == null) outstanding = 0.0;

        if (amountStr.isEmpty()) {
            binding.cardAdjustment.setVisibility(View.GONE);
            return;
        }

        try {
            double amount = Double.parseDouble(amountStr);
            double adjustment = outstanding - amount;

            binding.cardAdjustment.setVisibility(View.VISIBLE);

            if (adjustment == 0) {
                binding.tvAdjustmentInfo.setText("Exact payment — no adjustment");
                binding.ivAdjustmentIcon.setImageResource(R.drawable.ic_info);
                binding.ivAdjustmentIcon.setColorFilter(getColor(R.color.success));
                binding.tvAdjustmentInfo.setTextColor(getColor(R.color.success));
            } else if (adjustment > 0) {
                binding.tvAdjustmentInfo.setText(
                    String.format(Locale.getDefault(), "Write-off: %s (maaf)", CurrencyFormatter.format(adjustment))
                );
                binding.ivAdjustmentIcon.setImageResource(R.drawable.ic_info);
                binding.ivAdjustmentIcon.setColorFilter(getColor(R.color.warning));
                binding.tvAdjustmentInfo.setTextColor(getColor(R.color.warning));
            } else {
                binding.tvAdjustmentInfo.setText(
                    String.format(Locale.getDefault(), "Overpayment: %s (advance)", CurrencyFormatter.format(Math.abs(adjustment)))
                );
                binding.ivAdjustmentIcon.setImageResource(R.drawable.ic_info);
                binding.ivAdjustmentIcon.setColorFilter(getColor(R.color.brand_primary));
                binding.tvAdjustmentInfo.setTextColor(getColor(R.color.brand_primary));
            }
        } catch (NumberFormatException e) {
            binding.cardAdjustment.setVisibility(View.GONE);
        }
    }

    private void setupToggleEntries() {
        binding.tvToggleEntries.setOnClickListener(v -> {
            entriesVisible = !entriesVisible;
            binding.rvEntries.setVisibility(entriesVisible ? View.VISIBLE : View.GONE);
            binding.tvToggleEntries.setText(entriesVisible ? "Hide" : "Show");
        });
    }

    private void setupConfirmButton() {
        binding.btnConfirmSettlement.setOnClickListener(v -> {
            if (!validateInput()) return;
            showConfirmationDialog();
        });
    }

    private boolean validateInput() {
        String amountStr = binding.etAmount.getText().toString().trim();

        if (amountStr.isEmpty()) {
            binding.tilAmount.setError("Enter amount received");
            return false;
        }

        try {
            double amount = Double.parseDouble(amountStr);
            if (amount < 0) {
                binding.tilAmount.setError("Amount cannot be negative");
                return false;
            }
        } catch (NumberFormatException e) {
            binding.tilAmount.setError("Invalid amount");
            return false;
        }
        binding.tilAmount.setError(null);

        // Validate transaction ID for digital payments
        if (!"Cash".equals(selectedPaymentMethod)) {
            String txnId = binding.etTransactionId.getText().toString().trim();
            if (txnId.isEmpty()) {
                binding.tilTransactionId.setError("Transaction ID required for " + selectedPaymentMethod);
                return false;
            }
            binding.tilTransactionId.setError(null);
        }

        return true;
    }

    private void showConfirmationDialog() {
        double amount = Double.parseDouble(binding.etAmount.getText().toString().trim());
        Double outstanding = viewModel.getOutstandingAmount().getValue();
        if (outstanding == null) outstanding = 0.0;

        double adjustment = outstanding - amount;
        String adjustmentText;
        if (adjustment == 0) {
            adjustmentText = "Exact payment.";
        } else if (adjustment > 0) {
            adjustmentText = String.format(Locale.getDefault(),
                "Write-off of %s will be applied.", CurrencyFormatter.format(adjustment));
        } else {
            adjustmentText = String.format(Locale.getDefault(),
                "Overpayment of %s noted.", CurrencyFormatter.format(Math.abs(adjustment)));
        }

        String message = String.format(Locale.getDefault(),
            "Outstanding: %s\nAmount Received: %s\n%s\n\nFarmer's balance will be reset to ₹0.\n\nThis action cannot be undone.",
            CurrencyFormatter.format(outstanding),
            CurrencyFormatter.format(amount),
            adjustmentText
        );

        new AlertDialog.Builder(this)
            .setTitle("Confirm Settlement")
            .setMessage(message)
            .setPositiveButton("Settle", (dialog, which) -> executeSettlement())
            .setNegativeButton("Cancel", null)
            .show();
    }

    private void executeSettlement() {
        double amount = Double.parseDouble(binding.etAmount.getText().toString().trim());
        String txnId = binding.etTransactionId.getText().toString().trim();
        String remarks = binding.etRemarks.getText().toString().trim();

        viewModel.performSettlement(
            farmerId,
            farmerName,
            DateFormatter.getCurrentDate(),
            amount,
            selectedPaymentMethod,
            txnId.isEmpty() ? null : txnId,
            remarks.isEmpty() ? null : remarks
        );
    }

    private void observeData() {
        // Farmer info
        viewModel.getFarmerById(farmerId).observe(this, farmer -> {
            if (farmer != null) {
                farmerName = farmer.getName();
                binding.tvFarmerName.setText(farmer.getName());
                binding.tvSettlementDate.setText("Settlement on " + DateFormatter.formatDate(DateFormatter.getCurrentDate()));
            }
        });

        // Unsettled entries
        viewModel.getUnsettledEntries().observe(this, entries -> {
            if (entries == null || entries.isEmpty()) {
                binding.llNoEntries.setVisibility(View.VISIBLE);
                binding.rvEntries.setVisibility(View.GONE);
                binding.tvToggleEntries.setVisibility(View.GONE);
                binding.btnConfirmSettlement.setEnabled(false);
                binding.btnConfirmSettlement.setAlpha(0.5f);
            } else {
                binding.llNoEntries.setVisibility(View.GONE);
                binding.tvToggleEntries.setVisibility(View.VISIBLE);
                entryAdapter.submitList(entries);
                binding.tvEntriesCount.setText(entries.size() + " supply " + (entries.size() == 1 ? "entry" : "entries"));
                binding.btnConfirmSettlement.setEnabled(true);
                binding.btnConfirmSettlement.setAlpha(1.0f);
            }
        });

        // Summary values
        viewModel.getTotalCharges().observe(this, charges -> {
            binding.tvTotalCharges.setText(CurrencyFormatter.format(charges != null ? charges : 0));
        });

        viewModel.getTotalPreviousPayments().observe(this, prevPayments -> {
            if (prevPayments != null && prevPayments > 0) {
                binding.llPreviousPayments.setVisibility(View.VISIBLE);
                binding.tvPreviousPayments.setText("–" + CurrencyFormatter.format(prevPayments));
            } else {
                binding.llPreviousPayments.setVisibility(View.GONE);
            }
        });

        viewModel.getOutstandingAmount().observe(this, outstanding -> {
            binding.tvOutstandingAmount.setText(CurrencyFormatter.format(outstanding != null ? outstanding : 0));
            // Pre-fill amount field
            if (outstanding != null && outstanding > 0) {
                binding.etAmount.setText(String.format(Locale.getDefault(), "%.0f", outstanding));
            }
        });

        // Loading
        viewModel.getIsLoading().observe(this, loading -> {
            binding.loadingOverlay.setVisibility(loading ? View.VISIBLE : View.GONE);
        });

        // Result
        viewModel.getSettlementResult().observe(this, settlementId -> {
            if (settlementId != null) {
                Toast.makeText(this, "Settlement completed successfully!", Toast.LENGTH_LONG).show();
                finish();
            }
        });

        // Error
        viewModel.getErrorMessage().observe(this, error -> {
            if (error != null) {
                Toast.makeText(this, error, Toast.LENGTH_LONG).show();
            }
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        binding = null;
    }
}
