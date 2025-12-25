package com.watersupply.ui.farmers;

import android.app.ProgressDialog;
import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.watersupply.databinding.ActivityAddFarmerBinding;
import com.watersupply.data.models.Farmer;
import com.watersupply.data.repository.AuthRepository;
import com.watersupply.data.repository.FarmerRepository;

import javax.inject.Inject;

import dagger.hilt.android.AndroidEntryPoint;

/**
 * Activity for adding new farmer with Firebase
 */
@AndroidEntryPoint
public class AddFarmerActivity extends AppCompatActivity {
    
    private ActivityAddFarmerBinding binding;
    
    @Inject
    FarmerRepository farmerRepository;
    
    @Inject
    AuthRepository authRepository;
    
    @Inject
    com.watersupply.data.repository.AppSettingsRepository appSettingsRepository;
    
    private ProgressDialog progressDialog;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityAddFarmerBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        setupToolbar();
        setupSaveButton();
        loadDefaultRate();
    }
    
    private void loadDefaultRate() {
        String userId = authRepository.getCurrentUserId();
        if (userId != null) {
            appSettingsRepository.getSettings(userId).observe(this, settings -> {
                if (settings != null) {
                    binding.etRate.setText(String.valueOf(settings.getDefaultHourlyRate()));
                } else {
                    binding.etRate.setText("100.0"); // Default fallback
                }
            });
        }
    }
    
    private void setupToolbar() {
        setSupportActionBar(binding.toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle("Add Farmer");
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
    }
    
    private void setupSaveButton() {
        binding.btnSave.setOnClickListener(v -> {
            String name = binding.etName.getText().toString().trim();
            String mobile = binding.etMobile.getText().toString().trim();
            String location = binding.etLocation.getText().toString().trim();
            String rateStr = binding.etRate.getText().toString().trim();
            
            if (validateInput(name, mobile, rateStr)) {
                saveFarmer(name, mobile, location, Double.parseDouble(rateStr));
            }
        });
    }
    
    private boolean validateInput(String name, String mobile, String rate) {
        if (name.isEmpty()) {
            binding.tilName.setError("Name is required");
            return false;
        }
        if (mobile.isEmpty() || mobile.length() != 10) {
            binding.tilMobile.setError("Valid 10-digit mobile required");
            return false;
        }
        if (rate.isEmpty()) {
            binding.tilRate.setError("Rate is required");
            return false;
        }
        
        binding.tilName.setError(null);
        binding.tilMobile.setError(null);
        binding.tilRate.setError(null);
        return true;
    }
    
    private void saveFarmer(String name, String mobile, String location, double rate) {
        String userId = authRepository.getCurrentUserId();
        if (userId == null) {
            Toast.makeText(this, "Please login first", Toast.LENGTH_SHORT).show();
            return;
        }
        
        showProgressDialog("Saving farmer...");
        
        String familyId = authRepository.getCurrentFamilyId();
        
        Farmer farmer = new Farmer(userId, name, mobile);
        farmer.setFamilyId(familyId);
        farmer.setFarmLocation(location);
        farmer.setDefaultRate(rate);
        farmer.setActive(true);
        
        farmerRepository.addFarmer(farmer, new FarmerRepository.OnCompleteListener() {
            @Override
            public void onSuccess(String farmerId) {
                hideProgressDialog();
                Toast.makeText(AddFarmerActivity.this, "Farmer added successfully!", Toast.LENGTH_SHORT).show();
                finish();
            }
            
            @Override
            public void onFailure(String error) {
                hideProgressDialog();
                Toast.makeText(AddFarmerActivity.this, "Error: " + error, Toast.LENGTH_SHORT).show();
            }
        });
    }
    
    private void showProgressDialog(String message) {
        progressDialog = new ProgressDialog(this);
        progressDialog.setMessage(message);
        progressDialog.setCancelable(false);
        progressDialog.show();
    }
    
    private void hideProgressDialog() {
        if (progressDialog != null && progressDialog.isShowing()) {
            progressDialog.dismiss();
        }
    }
    
    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        hideProgressDialog();
    }
}
