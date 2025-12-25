package com.watersupply.ui.onboarding;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.ArrayAdapter;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.watersupply.R;
import com.watersupply.databinding.ActivityBusinessSetupBinding;
import com.watersupply.ui.auth.LoginActivity;

public class BusinessSetupActivity extends AppCompatActivity {
    private ActivityBusinessSetupBinding binding;
    private SharedPreferences prefs;
    
    private static final String PREFS_NAME = "business_settings";
    private static final String KEY_BUSINESS_NAME = "business_name";
    private static final String KEY_DEFAULT_RATE = "default_rate";
    private static final String KEY_CURRENCY = "currency";
    private static final String KEY_SETUP_COMPLETED = "setup_completed";
    
    private final String[] currencies = {"INR (₹)", "USD ($)", "EUR (€)", "GBP (£)"};
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityBusinessSetupBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        
        setupCurrencySpinner();
        setupButtons();
    }
    
    private void setupCurrencySpinner() {
        ArrayAdapter<String> adapter = new ArrayAdapter<>(
            this,
            android.R.layout.simple_spinner_item,
            currencies
        );
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        binding.spinnerCurrency.setAdapter(adapter);
        binding.spinnerCurrency.setSelection(0); // Default to INR
    }
    
    private void setupButtons() {
        binding.btnSkipSetup.setOnClickListener(v -> {
            // Save default values
            saveDefaultSettings();
            navigateToLogin();
        });
        
        binding.btnSaveSetup.setOnClickListener(v -> {
            if (validateInputs()) {
                saveBusinessSettings();
                navigateToLogin();
            }
        });
    }
    
    private boolean validateInputs() {
        String businessName = binding.etBusinessName.getText().toString().trim();
        String defaultRate = binding.etDefaultRate.getText().toString().trim();
        
        if (TextUtils.isEmpty(businessName)) {
            binding.tilBusinessName.setError("Business name is required");
            return false;
        }
        binding.tilBusinessName.setError(null);
        
        if (TextUtils.isEmpty(defaultRate)) {
            binding.tilDefaultRate.setError("Default rate is required");
            return false;
        }
        
        try {
            double rate = Double.parseDouble(defaultRate);
            if (rate <= 0) {
                binding.tilDefaultRate.setError("Rate must be greater than 0");
                return false;
            }
            binding.tilDefaultRate.setError(null);
        } catch (NumberFormatException e) {
            binding.tilDefaultRate.setError("Invalid rate format");
            return false;
        }
        
        return true;
    }
    
    private void saveBusinessSettings() {
        String businessName = binding.etBusinessName.getText().toString().trim();
        String defaultRate = binding.etDefaultRate.getText().toString().trim();
        String currency = currencies[binding.spinnerCurrency.getSelectedItemPosition()];
        
        prefs.edit()
            .putString(KEY_BUSINESS_NAME, businessName)
            .putString(KEY_DEFAULT_RATE, defaultRate)
            .putString(KEY_CURRENCY, currency)
            .putBoolean(KEY_SETUP_COMPLETED, true)
            .apply();
        
        Toast.makeText(this, "Business settings saved successfully", Toast.LENGTH_SHORT).show();
    }
    
    private void saveDefaultSettings() {
        prefs.edit()
            .putString(KEY_BUSINESS_NAME, "Water Supply Business")
            .putString(KEY_DEFAULT_RATE, "100.0")
            .putString(KEY_CURRENCY, "INR (₹)")
            .putBoolean(KEY_SETUP_COMPLETED, true)
            .apply();
    }
    
    private void navigateToLogin() {
        Intent intent = new Intent(this, LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        binding = null;
    }
}
