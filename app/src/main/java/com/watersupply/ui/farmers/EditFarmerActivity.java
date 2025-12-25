package com.watersupply.ui.farmers;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import com.watersupply.databinding.ActivityEditFarmerBinding;
import dagger.hilt.android.AndroidEntryPoint;

/**
 * Activity for editing farmer details
 */
@AndroidEntryPoint
public class EditFarmerActivity extends AppCompatActivity {
    
    private ActivityEditFarmerBinding binding;
    private EditFarmerViewModel viewModel;
    private String farmerId;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityEditFarmerBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        viewModel = new ViewModelProvider(this).get(EditFarmerViewModel.class);
        farmerId = getIntent().getStringExtra("farmer_id");
        
        if (farmerId == null || farmerId.isEmpty()) {
            Toast.makeText(this, "Error: Farmer ID is missing", Toast.LENGTH_LONG).show();
            finish();
            return;
        }
        
        setupToolbar();
        setupFormValidation();
        setupSaveButton();
        loadFarmerData();
    }
    
    private void setupToolbar() {
        setSupportActionBar(binding.toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle("Edit Farmer");
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
    }
    
    private void setupFormValidation() {
        binding.etName.addTextChangedListener(new TextWatcher() {
            @Override
            public void afterTextChanged(Editable s) {
                validateName(s.toString());
            }
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}
        });
        
        binding.etMobile.addTextChangedListener(new TextWatcher() {
            @Override
            public void afterTextChanged(Editable s) {
                validateMobile(s.toString());
            }
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}
        });
        
        binding.etDefaultRate.addTextChangedListener(new TextWatcher() {
            @Override
            public void afterTextChanged(Editable s) {
                validateDefaultRate(s.toString());
            }
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}
        });
    }
    
    private void setupSaveButton() {
        binding.btnSave.setOnClickListener(v -> handleSave());
    }
    
    private void loadFarmerData() {
        // Show loading state
        binding.btnSave.setEnabled(false);
        
        viewModel.getFarmerById(farmerId).observe(this, farmer -> {
            if (farmer != null) {
                binding.etName.setText(farmer.getName());
                binding.etMobile.setText(farmer.getMobile());
                binding.etLocation.setText(farmer.getFarmLocation() != null ? farmer.getFarmLocation() : "");
                binding.etDefaultRate.setText(String.valueOf(farmer.getDefaultRate()));
                
                // Enable save button
                binding.btnSave.setEnabled(true);
            } else {
                Toast.makeText(this, "Error: Farmer not found", Toast.LENGTH_LONG).show();
                finish();
            }
        });
    }
    
    private boolean validateName(String name) {
        if (name.trim().isEmpty()) {
            binding.tilName.setError("Name is required");
            return false;
        } else if (name.trim().length() < 2) {
            binding.tilName.setError("Name must be at least 2 characters");
            return false;
        }
        binding.tilName.setError(null);
        return true;
    }
    
    private boolean validateMobile(String mobile) {
        if (mobile.trim().isEmpty()) {
            binding.tilMobile.setError("Mobile number is required");
            return false;
        } else if (!mobile.matches("\\d{10}")) {
            binding.tilMobile.setError("Mobile number must be 10 digits");
            return false;
        }
        binding.tilMobile.setError(null);
        return true;
    }
    
    private boolean validateDefaultRate(String rateStr) {
        if (rateStr.trim().isEmpty()) {
            binding.tilDefaultRate.setError("Default rate is required");
            return false;
        }
        
        try {
            double rate = Double.parseDouble(rateStr);
            if (rate <= 0) {
                binding.tilDefaultRate.setError("Rate must be greater than 0");
                return false;
            }
        } catch (NumberFormatException e) {
            binding.tilDefaultRate.setError("Invalid rate format");
            return false;
        }
        
        binding.tilDefaultRate.setError(null);
        return true;
    }
    
    private void handleSave() {
        String name = binding.etName.getText().toString();
        String mobile = binding.etMobile.getText().toString();
        String location = binding.etLocation.getText().toString();
        String rateStr = binding.etDefaultRate.getText().toString();
        
        // Validate all fields
        boolean isValid = validateName(name) 
                        & validateMobile(mobile) 
                        & validateDefaultRate(rateStr);
        
        if (!isValid) {
            Toast.makeText(this, "Please fix the errors", Toast.LENGTH_SHORT).show();
            return;
        }
        
        double defaultRate = Double.parseDouble(rateStr);
        
        // Update farmer
        viewModel.updateFarmer(farmerId, name.trim(), mobile.trim(), 
                              location.trim().isEmpty() ? null : location.trim(), 
                              defaultRate);
        
        Toast.makeText(this, "Farmer updated successfully", Toast.LENGTH_SHORT).show();
        finish();
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
