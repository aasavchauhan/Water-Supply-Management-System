package com.watersupply.ui.settings;

import android.content.Intent;
import android.os.Bundle;
import android.text.InputType;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RadioGroup;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.lifecycle.ViewModelProvider;
import com.watersupply.R;
import com.watersupply.data.models.AppSettings;
import com.watersupply.databinding.ActivitySettingsBinding;
import com.watersupply.ui.auth.LoginActivity;
import com.watersupply.utils.ThemePreference;
import dagger.hilt.android.AndroidEntryPoint;

/**
 * Settings and data management activity
 */
@AndroidEntryPoint
public class SettingsActivity extends AppCompatActivity {
    
    private ActivitySettingsBinding binding;
    private SettingsViewModel viewModel;
    private ThemePreference themePreference;
    private AppSettings currentSettings;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySettingsBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        viewModel = new ViewModelProvider(this).get(SettingsViewModel.class);
        themePreference = new ThemePreference(this);
        
        setupToolbar();
        setupThemeSwitcher();
        setupClickListeners();
        loadSettings();
        observeViewModel();
    }
    
    private void setupToolbar() {
        setSupportActionBar(binding.toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle("Settings");
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
    }
    
    private void setupThemeSwitcher() {
        // Set current theme selection
        String currentTheme = themePreference.getThemeMode();
        switch (currentTheme) {
            case ThemePreference.MODE_LIGHT:
                binding.rbThemeLight.setChecked(true);
                break;
            case ThemePreference.MODE_DARK:
                binding.rbThemeDark.setChecked(true);
                break;
            case ThemePreference.MODE_SYSTEM:
            default:
                binding.rbThemeSystem.setChecked(true);
                break;
        }
        
        // Handle theme change
        binding.rgThemeMode.setOnCheckedChangeListener((group, checkedId) -> {
            String newTheme;
            
            if (checkedId == R.id.rbThemeLight) {
                newTheme = ThemePreference.MODE_LIGHT;
            } else if (checkedId == R.id.rbThemeDark) {
                newTheme = ThemePreference.MODE_DARK;
            } else {
                newTheme = ThemePreference.MODE_SYSTEM;
            }
            
            // Save preference
            themePreference.saveThemeMode(newTheme);
            
            // Apply theme immediately
            AppCompatDelegate.setDefaultNightMode(ThemePreference.getNightModeFromString(newTheme));
        });
    }
    
    private void setupClickListeners() {
        binding.cardBusinessProfile.setOnClickListener(v -> showEditBusinessNameDialog());
        binding.cardDefaultRate.setOnClickListener(v -> showEditDefaultRateDialog());
        
        binding.cardExportData.setOnClickListener(v -> exportData());
        binding.cardImportData.setOnClickListener(v -> importData());
        binding.cardClearData.setOnClickListener(v -> showClearDataConfirmation());
        binding.cardLogout.setOnClickListener(v -> showLogoutConfirmation());
    }
    
    private void loadSettings() {
        viewModel.getAppSettings().observe(this, settings -> {
            if (settings != null) {
                currentSettings = settings;
                binding.tvBusinessName.setText(settings.getBusinessName());
                binding.tvDefaultRate.setText(String.format("₹%.2f/hr", settings.getDefaultHourlyRate()));
                binding.tvCurrency.setText(settings.getCurrency());
            }
        });
        
        viewModel.getDatabaseStats().observe(this, stats -> {
            if (stats != null) {
                binding.tvFarmerCount.setText(String.valueOf(stats.farmerCount));
                binding.tvSupplyCount.setText(String.valueOf(stats.supplyCount));
                binding.tvPaymentCount.setText(String.valueOf(stats.paymentCount));
            }
        });
    }
    
    private void observeViewModel() {
        viewModel.getStatusMessage().observe(this, message -> {
            if (message != null) {
                Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
            }
        });
    }
    
    private void showEditBusinessNameDialog() {
        if (currentSettings == null) return;
        
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Edit Business Name");

        final EditText input = new EditText(this);
        input.setInputType(InputType.TYPE_CLASS_TEXT);
        input.setText(currentSettings.getBusinessName());
        
        LinearLayout container = new LinearLayout(this);
        container.setOrientation(LinearLayout.VERTICAL);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        params.setMargins(50, 20, 50, 20);
        container.addView(input, params);
        
        builder.setView(container);

        builder.setPositiveButton("Save", (dialog, which) -> {
            String newName = input.getText().toString().trim();
            if (!newName.isEmpty()) {
                currentSettings.setBusinessName(newName);
                viewModel.saveSettings(currentSettings);
            }
        });
        builder.setNegativeButton("Cancel", (dialog, which) -> dialog.cancel());

        builder.show();
    }
    
    private void showEditDefaultRateDialog() {
        if (currentSettings == null) {
            Toast.makeText(this, "Settings not loaded yet, please wait...", Toast.LENGTH_SHORT).show();
            return;
        }
        
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Edit Default Hourly Rate");

        final EditText input = new EditText(this);
        input.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL);
        input.setText(String.valueOf(currentSettings.getDefaultHourlyRate()));
        
        LinearLayout container = new LinearLayout(this);
        container.setOrientation(LinearLayout.VERTICAL);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        params.setMargins(50, 20, 50, 20);
        container.addView(input, params);
        
        builder.setView(container);

        builder.setPositiveButton("Save", (dialog, which) -> {
            try {
                double newRate = Double.parseDouble(input.getText().toString().trim());
                if (newRate > 0) {
                    currentSettings.setDefaultHourlyRate(newRate);
                    viewModel.saveSettings(currentSettings);
                } else {
                    Toast.makeText(this, "Rate must be greater than 0", Toast.LENGTH_SHORT).show();
                }
            } catch (NumberFormatException e) {
                Toast.makeText(this, "Invalid number format", Toast.LENGTH_SHORT).show();
            }
        });
        builder.setNegativeButton("Cancel", (dialog, which) -> dialog.cancel());

        builder.show();
    }
    
    private void exportData() {
        viewModel.exportData(this, success -> {
            runOnUiThread(() -> {
                if (success) {
                    Toast.makeText(this, "Data exported successfully to Downloads folder", Toast.LENGTH_LONG).show();
                } else {
                    Toast.makeText(this, "Failed to export data", Toast.LENGTH_SHORT).show();
                }
            });
        });
    }
    
    private void importData() {
        new AlertDialog.Builder(this)
            .setTitle("Import Data")
            .setMessage("This will replace all current data. Make sure you have a backup first. Continue?")
            .setPositiveButton("Import", (dialog, which) -> {
                viewModel.importData(this, success -> {
                    runOnUiThread(() -> {
                        if (success) {
                            Toast.makeText(this, "Data imported successfully", Toast.LENGTH_SHORT).show();
                        } else {
                            Toast.makeText(this, "Failed to import data", Toast.LENGTH_SHORT).show();
                        }
                    });
                });
            })
            .setNegativeButton("Cancel", null)
            .show();
    }
    
    private void showClearDataConfirmation() {
        new AlertDialog.Builder(this)
            .setTitle("Clear All Data")
            .setMessage("This will permanently delete all farmers, supply entries, and payment records. This action cannot be undone!")
            .setPositiveButton("Delete All", (dialog, which) -> {
                viewModel.clearAllData();
                Toast.makeText(this, "All data cleared", Toast.LENGTH_SHORT).show();
            })
            .setNegativeButton("Cancel", null)
            .setIcon(android.R.drawable.ic_dialog_alert)
            .show();
    }
    
    private void showLogoutConfirmation() {
        new AlertDialog.Builder(this)
            .setTitle("Logout")
            .setMessage("Are you sure you want to logout?")
            .setPositiveButton("Logout", (dialog, which) -> {
                viewModel.logout();
                Intent intent = new Intent(this, LoginActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                startActivity(intent);
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
