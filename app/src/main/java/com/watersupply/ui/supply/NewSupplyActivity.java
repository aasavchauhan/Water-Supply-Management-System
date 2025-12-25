package com.watersupply.ui.supply;

import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.google.android.material.button.MaterialButtonToggleGroup;
import com.watersupply.R;
import com.watersupply.data.models.SupplyEntry;
import com.watersupply.databinding.ActivityNewSupplyBinding;
import com.watersupply.utils.BillingCalculator;
import com.watersupply.utils.CurrencyFormatter;
import com.watersupply.utils.DateFormatter;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;

import dagger.hilt.android.AndroidEntryPoint;

/**
 * Activity for creating new supply entries with dual billing support
 */
@AndroidEntryPoint
public class NewSupplyActivity extends AppCompatActivity {
    private ActivityNewSupplyBinding binding;
    private NewSupplyViewModel viewModel;
    
    private boolean isEditMode = false;
    private SupplyEntry editingEntry;
    private double originalAmount = 0.0;
    
    private String farmerId;
    private String selectedFarmerName;
    private String billingMethod = "meter";
    private String selectedDate;
    private String startTime;
    private String stopTime;
    private double pauseDuration = 0.0;
    private String oldFarmerId; // To track farmer change in edit mode
    private double globalDefaultRate = 100.0; // Default fallback

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityNewSupplyBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        viewModel = new ViewModelProvider(this).get(NewSupplyViewModel.class);
        
        // Check for edit mode
        if (getIntent().hasExtra("supply_entry")) {
            isEditMode = true;
            editingEntry = (SupplyEntry) getIntent().getSerializableExtra("supply_entry");
            farmerId = editingEntry.getFarmerId();
            oldFarmerId = farmerId; // Capture original farmer
            originalAmount = editingEntry.getAmount();
            binding.toolbar.setTitle("Edit Supply Entry");
            binding.btnSave.setText("Update Entry");
        } else {
            farmerId = getIntent().getStringExtra("farmer_id");
        }

        setupToolbar();
        setupFarmerSelection(); // Call this new method
        
        // Observe App Settings for Global Default Rate
        viewModel.getAppSettings().observe(this, settings -> {
            if (settings != null) {
                globalDefaultRate = settings.getDefaultHourlyRate();
                // If rate fields are empty or 0.0, update them with new global rate
                updateRateFieldsIfEmpty();
            }
        });
        
        // Fetch farmer details if we have an ID
        if (farmerId != null) {
            viewModel.getFarmer(farmerId).observe(this, farmer -> {
                if (farmer != null) {
                    binding.tvFarmerName.setText(farmer.getName());
                    binding.tvFarmerBalance.setText("Balance: " + CurrencyFormatter.format(farmer.getBalance()));
                    
                    // Pre-fill rate logic
                    double rateToUse = farmer.getDefaultRate() > 0 ? farmer.getDefaultRate() : globalDefaultRate;
                    
                    if (shouldUpdateRateField(binding.etTimeRate.getText().toString())) {
                        binding.etTimeRate.setText(String.valueOf(rateToUse));
                    }
                    if (shouldUpdateRateField(binding.etMeterRate.getText().toString())) {
                        binding.etMeterRate.setText(String.valueOf(rateToUse));
                    }
                }
            });
        }
        
        setupDatePicker();
        setupBillingMethodToggle();
        setupTimeInputs();
        setupMeterInputs();
        setupSaveButton();
        observeViewModel();
        
        if (isEditMode) {
            prefillData();
        } else {
            // Set default date to today
            selectedDate = DateFormatter.getCurrentDate();
            binding.tvSelectedDate.setText(DateFormatter.formatDate(selectedDate));
        }
    }
    
    private void prefillData() {
        selectedDate = editingEntry.getDate();
        binding.tvSelectedDate.setText(DateFormatter.formatDate(selectedDate));
        
        if ("time".equals(editingEntry.getBillingMethod())) {
            binding.billingMethodGroup.check(R.id.btnTime);
            billingMethod = "time";
            
            startTime = editingEntry.getStartTime();
            stopTime = editingEntry.getStopTime();
            pauseDuration = editingEntry.getPauseDuration();
            
            binding.tvStartTime.setText(startTime);
            binding.tvStopTime.setText(stopTime);
            binding.etPauseDuration.setText(String.valueOf(pauseDuration));
            binding.etTimeRate.setText(String.valueOf(editingEntry.getRate()));
            if (editingEntry.getRemarks() != null) {
                binding.etTimeRemarks.setText(editingEntry.getRemarks());
            }
            
            calculateTimeBasedAmount();
            
        } else {
            binding.billingMethodGroup.check(R.id.btnMeter);
            billingMethod = "meter";
            
            if (editingEntry.getMeterReadingStart() != null)
                binding.etMeterStart.setText(String.valueOf(editingEntry.getMeterReadingStart()));
            if (editingEntry.getMeterReadingEnd() != null)
                binding.etMeterEnd.setText(String.valueOf(editingEntry.getMeterReadingEnd()));
            
            binding.etMeterRate.setText(String.valueOf(editingEntry.getRate()));
            if (editingEntry.getRemarks() != null) {
                binding.etMeterRemarks.setText(editingEntry.getRemarks());
            }
            
            calculateMeterBasedAmount();
        }
    }
    
    private void setupToolbar() {
        if (!isEditMode) {
            binding.toolbar.setTitle("New Supply Entry");
        }
        binding.toolbar.setNavigationOnClickListener(v -> finish());
    }
    
    private void setupDatePicker() {
        binding.btnSelectDate.setOnClickListener(v -> {
            Calendar calendar = Calendar.getInstance();
            // Parse existing date if available
            if (selectedDate != null) {
                try {
                    java.util.Date date = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).parse(selectedDate);
                    if (date != null) calendar.setTime(date);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            
            new DatePickerDialog(this, (view, year, month, dayOfMonth) -> {
                calendar.set(year, month, dayOfMonth);
                selectedDate = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(calendar.getTime());
                binding.tvSelectedDate.setText(DateFormatter.formatDate(selectedDate));
            }, calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH), calendar.get(Calendar.DAY_OF_MONTH)).show();
        });
    }
    
    private void setupBillingMethodToggle() {
        binding.billingMethodGroup.addOnButtonCheckedListener((group, checkedId, isChecked) -> {
            if (isChecked) {
                if (checkedId == R.id.btnMeter) {
                    billingMethod = "meter";
                    binding.meterInputsCard.setVisibility(View.VISIBLE);
                    binding.timeInputsCard.setVisibility(View.GONE);
                    // Only clear inputs if we are NOT in edit mode or if switching away from the original method
                    if (!isEditMode || !"meter".equals(editingEntry.getBillingMethod())) {
                         // clearTimeInputs(); // Optional: decide if we want to clear or keep state
                    }
                } else if (checkedId == R.id.btnTime) {
                    billingMethod = "time";
                    binding.meterInputsCard.setVisibility(View.GONE);
                    binding.timeInputsCard.setVisibility(View.VISIBLE);
                    if (!isEditMode || !"time".equals(editingEntry.getBillingMethod())) {
                        // clearMeterInputs();
                    }
                }
            }
        });
        
        // Default selection handled in onCreate/prefillData
        if (!isEditMode) {
            binding.btnMeter.setChecked(true);
        }
    }
    
    private void setupTimeInputs() {
        binding.btnStartTime.setOnClickListener(v -> showTimePicker(true));
        binding.btnStopTime.setOnClickListener(v -> showTimePicker(false));
        
        binding.etPauseDuration.addTextChangedListener(new TextWatcher() {
            @Override
            public void afterTextChanged(Editable s) {
                if (!s.toString().isEmpty()) {
                    try {
                        pauseDuration = Double.parseDouble(s.toString());
                    } catch (NumberFormatException e) {
                        pauseDuration = 0.0;
                    }
                } else {
                    pauseDuration = 0.0;
                }
                calculateTimeBasedAmount();
            }
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}
        });
        
        binding.etTimeRate.addTextChangedListener(new TextWatcher() {
            @Override
            public void afterTextChanged(Editable s) {
                calculateTimeBasedAmount();
            }
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}
        });
    }
    
    private void showTimePicker(boolean isStartTime) {
        Calendar calendar = Calendar.getInstance();
        // Try to parse existing time
        String timeStr = isStartTime ? startTime : stopTime;
        if (timeStr != null && timeStr.contains(":")) {
            try {
                String[] parts = timeStr.split(":");
                calendar.set(Calendar.HOUR_OF_DAY, Integer.parseInt(parts[0]));
                calendar.set(Calendar.MINUTE, Integer.parseInt(parts[1]));
            } catch (Exception e) {
                // Ignore
            }
        }
        
        new TimePickerDialog(this, (view, hourOfDay, minute) -> {
            String time = String.format(Locale.getDefault(), "%02d:%02d", hourOfDay, minute);
            if (isStartTime) {
                startTime = time;
                binding.tvStartTime.setText(time);
            } else {
                stopTime = time;
                binding.tvStopTime.setText(time);
            }
            calculateTimeBasedAmount();
        }, calendar.get(Calendar.HOUR_OF_DAY), calendar.get(Calendar.MINUTE), true).show();
    }
    
    private void setupMeterInputs() {
        TextWatcher calculationWatcher = new TextWatcher() {
            @Override
            public void afterTextChanged(Editable s) {
                calculateMeterBasedAmount();
            }
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}
        };
        
        binding.etMeterStart.addTextChangedListener(calculationWatcher);
        binding.etMeterEnd.addTextChangedListener(calculationWatcher);
        binding.etMeterRate.addTextChangedListener(calculationWatcher);
    }
    
    private void calculateTimeBasedAmount() {
        try {
            if (startTime != null && stopTime != null && !binding.etTimeRate.getText().toString().isEmpty()) {
                double hours = BillingCalculator.calculateHoursFromTime(startTime, stopTime);
                double effectiveHours = hours - pauseDuration;
                
                if (effectiveHours < 0) {
                    effectiveHours = 0;
                }
                
                double rate = Double.parseDouble(binding.etTimeRate.getText().toString());
                double amount = BillingCalculator.calculateAmount(effectiveHours, rate);
                
                binding.tvCalculatedHours.setText(String.format(Locale.getDefault(), "%.2f hours", effectiveHours));
                binding.tvCalculatedAmount.setText(CurrencyFormatter.format(amount));
            }
        } catch (NumberFormatException e) {
            // Invalid input, ignore
        }
    }
    
    private void calculateMeterBasedAmount() {
        try {
            String startStr = binding.etMeterStart.getText().toString();
            String endStr = binding.etMeterEnd.getText().toString();
            String rateStr = binding.etMeterRate.getText().toString();
            
            if (!startStr.isEmpty() && !endStr.isEmpty() && !rateStr.isEmpty()) {
                double start = Double.parseDouble(startStr);
                double end = Double.parseDouble(endStr);
                double rate = Double.parseDouble(rateStr);
                
                double startHours = BillingCalculator.convertMeterToHours(start);
                double endHours = BillingCalculator.convertMeterToHours(end);
                double hours = endHours - startHours;
                
                if (hours < 0) {
                    binding.tilMeterEnd.setError("End reading must be greater than start");
                    // Don't return, let user correct it
                } else {
                    binding.tilMeterEnd.setError(null);
                }
                
                double amount = BillingCalculator.calculateAmount(hours, rate);
                
                binding.tvMeterCalculatedHours.setText(String.format(Locale.getDefault(), "%.2f hours", hours));
                binding.tvMeterCalculatedAmount.setText(CurrencyFormatter.format(amount));
            }
        } catch (NumberFormatException e) {
            // Invalid input, ignore
        }
    }
    
    private void setupSaveButton() {
        binding.btnSave.setOnClickListener(v -> saveSupplyEntry("completed"));
        binding.btnDraft.setOnClickListener(v -> saveSupplyEntry("draft"));
    }
    
    private void saveSupplyEntry(String status) {
        SharedPreferences prefs = getSharedPreferences("user_session", MODE_PRIVATE);
        String userId = prefs.getString("user_id", null);
        String familyId = prefs.getString("family_id", userId); // Default to userId if not found
        
        if (userId == null) {
            Toast.makeText(this, "User not logged in", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }
        
        SupplyEntry entry = isEditMode ? editingEntry : new SupplyEntry();
        
        if (!isEditMode) {
            entry.setUserId(userId);
            entry.setFamilyId(familyId);
            entry.setFarmerId(farmerId);
            String farmerName = getIntent().getStringExtra("farmer_name");
            if (farmerName != null) {
                entry.setFarmerName(farmerName);
            } else if (selectedFarmerName != null) {
                entry.setFarmerName(selectedFarmerName);
            }
        }
        // If edit mode, userId, familyId, farmerId, farmerName are already set in editingEntry
        
        entry.setDate(selectedDate);
        entry.setBillingMethod(billingMethod);
        entry.setStatus(status);
        
        try {
            if ("time".equals(billingMethod)) {
                entry.setStartTime(startTime);
                entry.setStopTime(stopTime);
                entry.setPauseDuration(pauseDuration);
                
                // Only calculate if stop time is present or not a draft
                if (startTime != null && stopTime != null) {
                    double hours = BillingCalculator.calculateHoursFromTime(startTime, stopTime);
                    entry.setTotalTimeUsed(hours - pauseDuration);
                    
                    String rateStr = binding.etTimeRate.getText().toString();
                    if (!rateStr.isEmpty()) {
                        entry.setRate(Double.parseDouble(rateStr));
                        entry.setAmount(BillingCalculator.calculateAmount(entry.getTotalTimeUsed(), entry.getRate()));
                    }
                } else if ("completed".equals(status)) {
                    Toast.makeText(this, "Start and Stop times are required for completed entry", Toast.LENGTH_SHORT).show();
                    return;
                } else {
                    // Draft with partial data
                    String rateStr = binding.etTimeRate.getText().toString();
                    if (!rateStr.isEmpty()) entry.setRate(Double.parseDouble(rateStr));
                }
                
                String remarks = binding.etTimeRemarks.getText().toString();
                entry.setRemarks(remarks.isEmpty() ? null : remarks);
                
                // Clear meter fields if switching methods
                entry.setMeterReadingStart(null);
                entry.setMeterReadingEnd(null);
                
            } else if ("meter".equals(billingMethod)) {
                String startStr = binding.etMeterStart.getText().toString();
                String endStr = binding.etMeterEnd.getText().toString();
                String rateStr = binding.etMeterRate.getText().toString();
                
                if (!startStr.isEmpty()) {
                    entry.setMeterReadingStart(Double.parseDouble(startStr));
                } else if ("completed".equals(status)) {
                    binding.tilMeterStart.setError("Start reading required");
                    return;
                }
                
                if (!endStr.isEmpty()) {
                    entry.setMeterReadingEnd(Double.parseDouble(endStr));
                } else if ("completed".equals(status)) {
                    binding.tilMeterEnd.setError("End reading required");
                    return;
                }
                
                if (!rateStr.isEmpty()) {
                    entry.setRate(Double.parseDouble(rateStr));
                }
                
                if (entry.getMeterReadingStart() != null && entry.getMeterReadingEnd() != null && entry.getRate() > 0) {
                    double startHours = BillingCalculator.convertMeterToHours(entry.getMeterReadingStart());
                    double endHours = BillingCalculator.convertMeterToHours(entry.getMeterReadingEnd());
                    entry.setTotalTimeUsed(endHours - startHours);
                    entry.setAmount(BillingCalculator.calculateAmount(entry.getTotalTimeUsed(), entry.getRate()));
                }
                
                String remarks = binding.etMeterRemarks.getText().toString();
                entry.setRemarks(remarks.isEmpty() ? null : remarks);
                
                // Clear time fields
                entry.setStartTime(null);
                entry.setStopTime(null);
                entry.setPauseDuration(0.0);
            }
            
            if (isEditMode) {
                viewModel.updateSupplyEntry(entry, originalAmount, oldFarmerId);
            } else {
                viewModel.saveSupplyEntry(entry);
            }
            
        } catch (NumberFormatException e) {
            Toast.makeText(this, "Please fill all required fields with valid values", Toast.LENGTH_SHORT).show();
        }
    }
    
    private void setupFarmerSelection() {
        android.widget.ArrayAdapter<com.watersupply.data.models.Farmer> adapter = 
            new android.widget.ArrayAdapter<>(this, android.R.layout.simple_dropdown_item_1line);
        binding.actvFarmerSearch.setAdapter(adapter);
        
        viewModel.getAllFarmers().observe(this, farmers -> {
            adapter.clear();
            adapter.addAll(farmers);
        });
        
        binding.actvFarmerSearch.setOnItemClickListener((parent, view, position, id) -> {
            com.watersupply.data.models.Farmer selectedFarmer = adapter.getItem(position);
            if (selectedFarmer != null) {
                farmerId = selectedFarmer.getId();
                selectedFarmerName = selectedFarmer.getName(); // Capture name
                binding.tvFarmerName.setText(selectedFarmer.getName());
                binding.tvFarmerBalance.setText("Balance: " + CurrencyFormatter.format(selectedFarmer.getBalance()));
                
                // Switch to name view
                binding.farmerSelectionCard.setVisibility(View.GONE);
                binding.farmerNameCard.setVisibility(View.VISIBLE);
                
                // Pre-fill rate logic
                double rateToUse = selectedFarmer.getDefaultRate() > 0 ? selectedFarmer.getDefaultRate() : globalDefaultRate;
                
                // Always update rate when farmer is selected
                binding.etTimeRate.setText(String.valueOf(rateToUse));
                binding.etMeterRate.setText(String.valueOf(rateToUse));
            }
        });

        if (farmerId == null) {
            binding.farmerSelectionCard.setVisibility(View.VISIBLE);
            binding.farmerNameCard.setVisibility(View.GONE);
        } else {
            binding.farmerSelectionCard.setVisibility(View.GONE);
            binding.farmerNameCard.setVisibility(View.VISIBLE);
        }
        
        // Add click listener to farmer name card to allow changing farmer
        binding.farmerNameCard.setOnClickListener(v -> {
            binding.farmerNameCard.setVisibility(View.GONE);
            binding.farmerSelectionCard.setVisibility(View.VISIBLE);
            binding.actvFarmerSearch.setText(""); // Clear previous search
            binding.actvFarmerSearch.requestFocus();
        });
    }

    private void observeViewModel() {
        viewModel.getSaveSuccess().observe(this, success -> {
            if (success != null && success) {
                Toast.makeText(this, isEditMode ? "Supply entry updated" : "Supply entry saved", Toast.LENGTH_SHORT).show();
                finish();
            }
        });
        
        viewModel.getErrorMessage().observe(this, error -> {
            if (error != null) {
                Toast.makeText(this, error, Toast.LENGTH_SHORT).show();
            }
        });
    }
    
    private void clearTimeInputs() {
        startTime = null;
        stopTime = null;
        pauseDuration = 0.0;
        binding.tvStartTime.setText("--:--");
        binding.tvStopTime.setText("--:--");
        binding.etPauseDuration.setText("");
        binding.etTimeRate.setText("");
        binding.etTimeRemarks.setText("");
        binding.tvCalculatedHours.setText("0.00 hours");
        binding.tvCalculatedAmount.setText("₹0.00");
    }
    
    private void clearMeterInputs() {
        binding.etMeterStart.setText("");
        binding.etMeterEnd.setText("");
        binding.etMeterRate.setText("");
        binding.etMeterRemarks.setText("");
        binding.tvMeterCalculatedHours.setText("0.00 hours");
        binding.tvMeterCalculatedAmount.setText("₹0.00");
    }

    private void updateRateFieldsIfEmpty() {
        if (shouldUpdateRateField(binding.etTimeRate.getText().toString())) {
            binding.etTimeRate.setText(String.valueOf(globalDefaultRate));
        }
        if (shouldUpdateRateField(binding.etMeterRate.getText().toString())) {
            binding.etMeterRate.setText(String.valueOf(globalDefaultRate));
        }
    }

    private boolean shouldUpdateRateField(String currentText) {
        return currentText.isEmpty() || currentText.equals("0.0") || currentText.equals("0");
    }
}
