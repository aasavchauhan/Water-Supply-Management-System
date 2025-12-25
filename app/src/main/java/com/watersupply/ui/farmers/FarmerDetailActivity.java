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
import com.watersupply.data.repository.FarmerRepository;
import com.watersupply.databinding.ActivityFarmerDetailBinding;
import com.watersupply.ui.supply.NewSupplyActivity;
import com.watersupply.ui.payments.AddPaymentActivity;
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
    }
    
    private void setupButtons() {
        binding.fabNewSupply.setOnClickListener(v -> {
            Intent intent = new Intent(this, NewSupplyActivity.class);
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
