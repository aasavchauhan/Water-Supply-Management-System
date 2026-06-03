package com.watersupply.ui.farmers;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import com.watersupply.data.models.SupplyEntry;
import com.watersupply.data.models.Payment;
import com.watersupply.data.models.Settlement;
import com.watersupply.data.repository.FarmerRepository;
import com.watersupply.databinding.ActivityFarmerDetailBinding;
import com.watersupply.ui.supply.NewSupplyActivity;
import com.watersupply.ui.payments.AddPaymentActivity;
import com.watersupply.ui.settlement.SettlementActivity;
import com.watersupply.ui.settlement.SettlementAdapter;
import com.watersupply.ui.supply.SupplyEntryAdapter;
import com.watersupply.ui.payments.adapters.PaymentAdapter;
import com.watersupply.ui.supply.SupplyDetailDialog;
import com.watersupply.ui.payments.PaymentDetailDialog;
import com.watersupply.utils.CurrencyFormatter;
import dagger.hilt.android.AndroidEntryPoint;

import javax.inject.Inject;

/**
 * Activity showing farmer details and history
 */
@AndroidEntryPoint
public class FarmerDetailActivity extends AppCompatActivity {
    
    private ActivityFarmerDetailBinding binding;
    private FarmerDetailViewModel viewModel;
    private String farmerId;
    private SupplyEntryAdapter supplyAdapter;
    private PaymentAdapter paymentAdapter;
    private SettlementAdapter settlementAdapter;
    
    @Inject
    FarmerRepository farmerRepository;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityFarmerDetailBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        viewModel = new ViewModelProvider(this).get(FarmerDetailViewModel.class);
        farmerId = getIntent().getStringExtra("farmer_id");
        
        if (farmerId == null) {
            finish();
            return;
        }
        
        setupToolbar();
        setupRecyclerViews();
        setupButtons();
        observeFarmerDetails();
        observeSupplyEntries();
        observePayments();
        observeSettlements();
    }
    
    private void setupToolbar() {
        setSupportActionBar(binding.toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle("Farmer Details");
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
    }
    
    private void setupRecyclerViews() {
        // Supply entries
        supplyAdapter = new SupplyEntryAdapter(new SupplyEntryAdapter.OnSupplyEntryClickListener() {
            @Override
            public void onSupplyEntryClick(SupplyEntry entry) {
                SupplyDetailDialog dialog = SupplyDetailDialog.newInstance(entry);
                dialog.show(getSupportFragmentManager(), "supply_detail");
            }
        });
        supplyAdapter.setDetailMode(true); // Hide farmer name in detail view

        binding.rvSupplyEntries.setLayoutManager(new LinearLayoutManager(this));
        binding.rvSupplyEntries.setAdapter(supplyAdapter);
        
        // Payments
        paymentAdapter = new PaymentAdapter(new PaymentAdapter.OnPaymentClickListener() {
            @Override
            public void onPaymentClick(Payment payment) {
                PaymentDetailDialog dialog = PaymentDetailDialog.newInstance(payment.getId());
                dialog.show(getSupportFragmentManager(), "payment_detail");
            }
        });
        paymentAdapter.setDetailMode(true); // Hide farmer name in detail view
        
        binding.rvPayments.setLayoutManager(new LinearLayoutManager(this));
        binding.rvPayments.setAdapter(paymentAdapter);
        
        // Settlements
        settlementAdapter = new SettlementAdapter(settlement -> {
            // Show settlement details (could open detail dialog/activity)
            showSettlementDetail(settlement);
        });
        settlementAdapter.setDetailMode(true);
        
        binding.rvSettlements.setLayoutManager(new LinearLayoutManager(this));
        binding.rvSettlements.setAdapter(settlementAdapter);
    }
    
    private void setupButtons() {
        binding.fabNewSupply.setOnClickListener(v -> {
            Intent intent = new Intent(this, NewSupplyActivity.class);
            intent.putExtra("farmer_id", farmerId);
            startActivity(intent);
        });
        
        binding.btnSettleAccount.setOnClickListener(v -> {
            Intent intent = new Intent(this, SettlementActivity.class);
            intent.putExtra("farmer_id", farmerId);
            startActivity(intent);
        });
        
        binding.btnRecordPayment.setOnClickListener(v -> {
            Intent intent = new Intent(this, AddPaymentActivity.class);
            intent.putExtra("farmer_id", farmerId);
            startActivity(intent);
        });
        
        binding.btnEditFarmer.setOnClickListener(v -> {
            if (farmerId != null) {
                Intent intent = new Intent(this, EditFarmerActivity.class);
                intent.putExtra("farmer_id", farmerId);
                startActivity(intent);
            } else {
                Toast.makeText(this, "Farmer ID is missing", Toast.LENGTH_SHORT).show();
            }
        });
        
        binding.btnDeleteFarmer.setOnClickListener(v -> {
            showDeleteConfirmation();
        });
    }
    
    private void observeFarmerDetails() {
        viewModel.getFarmerById(farmerId).observe(this, farmer -> {
            if (farmer != null) {
                binding.tvFarmerName.setText(farmer.getName());
                binding.tvFarmerMobile.setText(farmer.getMobile());
                binding.tvFarmerLocation.setText(farmer.getFarmLocation() != null ? farmer.getFarmLocation() : "Not specified");
                binding.tvDefaultRate.setText(CurrencyFormatter.format(farmer.getDefaultRate()) + "/hr");
                binding.tvBalance.setText(CurrencyFormatter.format(farmer.getBalance()));
                
                // Set up phone call click listener
                binding.llPhoneContainer.setOnClickListener(v -> {
                    String mobile = farmer.getMobile();
                    if (mobile != null && !mobile.isEmpty()) {
                        Intent intent = new Intent(Intent.ACTION_DIAL);
                        intent.setData(android.net.Uri.parse("tel:" + mobile));
                        startActivity(intent);
                    } else {
                        Toast.makeText(this, "Phone number not available", Toast.LENGTH_SHORT).show();
                    }
                });
                
                // Show warning if balance is high
                if (farmer.getBalance() > 1000) {
                    binding.tvBalanceWarning.setVisibility(View.VISIBLE);
                    binding.tvBalanceWarning.setText("High pending balance!");
                } else {
                    binding.tvBalanceWarning.setVisibility(View.GONE);
                }
                
                // Enable/disable settle button based on balance
                if (farmer.getBalance() <= 0) {
                    binding.btnSettleAccount.setEnabled(false);
                    binding.btnSettleAccount.setAlpha(0.5f);
                } else {
                    binding.btnSettleAccount.setEnabled(true);
                    binding.btnSettleAccount.setAlpha(1.0f);
                }
            }
        });
    }
    
    private void observeSupplyEntries() {
        viewModel.getSupplyEntries(farmerId).observe(this, entries -> {
            if (entries == null || entries.isEmpty()) {
                binding.tvNoSupplyEntries.setVisibility(View.VISIBLE);
                binding.rvSupplyEntries.setVisibility(View.GONE);
            } else {
                binding.tvNoSupplyEntries.setVisibility(View.GONE);
                binding.rvSupplyEntries.setVisibility(View.VISIBLE);
                supplyAdapter.submitList(entries);
            }
        });
    }
    
    private void observePayments() {
        viewModel.getPayments(farmerId).observe(this, payments -> {
            if (payments == null || payments.isEmpty()) {
                binding.tvNoPayments.setVisibility(View.VISIBLE);
                binding.rvPayments.setVisibility(View.GONE);
            } else {
                binding.tvNoPayments.setVisibility(View.GONE);
                binding.rvPayments.setVisibility(View.VISIBLE);
                paymentAdapter.submitList(payments);
            }
        });
    }
    
    private void observeSettlements() {
        viewModel.getSettlements(farmerId).observe(this, settlements -> {
            if (settlements == null || settlements.isEmpty()) {
                binding.llNoSettlements.setVisibility(View.VISIBLE);
                binding.rvSettlements.setVisibility(View.GONE);
            } else {
                binding.llNoSettlements.setVisibility(View.GONE);
                binding.rvSettlements.setVisibility(View.VISIBLE);
                // Sort by date descending
                java.util.Collections.sort(settlements, (s1, s2) -> {
                    if (s1.getSettlementDate() == null) return 1;
                    if (s2.getSettlementDate() == null) return -1;
                    return s2.getSettlementDate().compareTo(s1.getSettlementDate());
                });
                settlementAdapter.submitList(settlements);
            }
        });
    }
    
    private void showSettlementDetail(Settlement settlement) {
        String message = String.format(
            "Date: %s\n\nOutstanding: %s\nAmount Paid: %s\nAdjustment: %s (%s)\n\nPayment Method: %s\nEntries Settled: %d\n\n%s",
            com.watersupply.utils.DateFormatter.format(settlement.getSettlementDate()),
            CurrencyFormatter.format(settlement.getOutstandingAmount()),
            CurrencyFormatter.format(settlement.getAmountReceived()),
            CurrencyFormatter.format(settlement.getAdjustmentAmount()),
            settlement.getAdjustmentType() != null ? settlement.getAdjustmentType() : "N/A",
            settlement.getPaymentMethod() != null ? settlement.getPaymentMethod() : "N/A",
            settlement.getSettledSupplyIds() != null ? settlement.getSettledSupplyIds().size() : 0,
            settlement.getRemarks() != null ? "Remarks: " + settlement.getRemarks() : ""
        );

        new AlertDialog.Builder(this)
            .setTitle("Settlement Details")
            .setMessage(message)
            .setPositiveButton("OK", null)
            .setNegativeButton("Delete", (dialog, which) -> {
                showDeleteSettlementConfirmation(settlement);
            })
            .show();
    }

    private void showDeleteSettlementConfirmation(Settlement settlement) {
        new AlertDialog.Builder(this)
            .setTitle("Delete Settlement")
            .setMessage("Are you sure you want to delete this settlement? This will mark settled supply entries back as unsettled, delete/unlink associated payments, and restore the farmer's balance.")
            .setPositiveButton("Delete", (dialog, which) -> {
                viewModel.deleteSettlement(settlement, new com.watersupply.data.repository.SettlementRepository.OnCompleteListener() {
                    @Override
                    public void onSuccess(String settlementId) {
                        Toast.makeText(FarmerDetailActivity.this, "Settlement deleted successfully", Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onFailure(String error) {
                        Toast.makeText(FarmerDetailActivity.this, "Failed to delete settlement: " + error, Toast.LENGTH_LONG).show();
                    }
                });
            })
            .setNegativeButton("Cancel", null)
            .show();
    }

    
    private void showDeleteConfirmation() {
        new AlertDialog.Builder(this)
            .setTitle("Delete Farmer")
            .setMessage("Are you sure you want to delete this farmer? This will also delete all associated supply entries and payment records.")
            .setPositiveButton("Delete", (dialog, which) -> {
                viewModel.deleteFarmer(farmerId);
                finish();
            })
            .setNegativeButton("Cancel", null)
            .show();
    }
    
    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        binding = null;
    }
}
