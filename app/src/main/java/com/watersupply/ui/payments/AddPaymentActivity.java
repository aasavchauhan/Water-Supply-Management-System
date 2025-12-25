package com.watersupply.ui.payments;

import android.app.DatePickerDialog;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import com.google.android.material.button.MaterialButton;
import com.watersupply.R;
import com.watersupply.databinding.ActivityAddPaymentBinding;
import com.watersupply.utils.DateFormatter;
import java.util.Calendar;
import java.util.Locale;
import dagger.hilt.android.AndroidEntryPoint;

@AndroidEntryPoint
public class AddPaymentActivity extends AppCompatActivity {
    private ActivityAddPaymentBinding binding;
    private AddPaymentViewModel viewModel;
    private boolean isEditMode = false;
    private com.watersupply.data.models.Payment editingPayment;
    private String farmerId;
    private String selectedDate;
    private String selectedPaymentMethod = "Cash";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityAddPaymentBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        viewModel = new ViewModelProvider(this).get(AddPaymentViewModel.class);
        
        if (getIntent().hasExtra("payment")) {
            isEditMode = true;
            editingPayment = (com.watersupply.data.models.Payment) getIntent().getSerializableExtra("payment");
            farmerId = editingPayment.getFarmerId();
            binding.toolbar.setTitle("Edit Payment");
            binding.btnSave.setText("Update Payment");
        } else {
            farmerId = getIntent().getStringExtra("farmer_id");
        }
        
        if (farmerId == null) {
            Toast.makeText(this, "Error: No farmer selected", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }
        
        setupToolbar();
        setupDatePicker();
        setupPaymentMethodToggle();
        setupTransactionIdField();
        setupSaveButton();
        loadFarmerDetails();
        
        if (isEditMode) {
            prefillData();
        } else {
            // Set default date to today
            selectedDate = DateFormatter.getCurrentDate();
            binding.etDate.setText(DateFormatter.formatDate(selectedDate));
        }
    }
    
    private void prefillData() {
        selectedDate = editingPayment.getPaymentDate();
        binding.etDate.setText(DateFormatter.formatDate(selectedDate));
        binding.etAmount.setText(String.valueOf(editingPayment.getAmount()));
        
        if (editingPayment.getRemarks() != null) {
            binding.etRemarks.setText(editingPayment.getRemarks());
        }
        
        if (editingPayment.getTransactionId() != null) {
            binding.etTransactionId.setText(editingPayment.getTransactionId());
        }
        
        String method = editingPayment.getPaymentMethod();
        if ("UPI".equals(method)) {
            binding.paymentMethodGroup.check(R.id.btnUpi);
        } else if ("Bank Transfer".equals(method)) {
            binding.paymentMethodGroup.check(R.id.btnBank);
        } else {
            binding.paymentMethodGroup.check(R.id.btnCash);
        }
        selectedPaymentMethod = method;
    }

    private void setupToolbar() {
        if (!isEditMode) binding.toolbar.setTitle("Record Payment");
        binding.toolbar.setNavigationOnClickListener(v -> finish());
    }
    
    private void setupDatePicker() {
        binding.etDate.setOnClickListener(v -> showDatePicker());
    }
    
    private void showDatePicker() {
        Calendar calendar = Calendar.getInstance();
        // Parse existing date if available
        if (selectedDate != null) {
            try {
                java.util.Date date = new java.text.SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).parse(selectedDate);
                if (date != null) calendar.setTime(date);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        DatePickerDialog datePickerDialog = new DatePickerDialog(
            this,
            (view, year, month, dayOfMonth) -> {
                calendar.set(year, month, dayOfMonth);
                // Format as yyyy-MM-dd
                selectedDate = String.format(Locale.getDefault(), "%04d-%02d-%02d", year, month + 1, dayOfMonth);
                binding.etDate.setText(DateFormatter.formatDate(selectedDate));
            },
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH)
        );
        datePickerDialog.show();
    }
    
    private void setupPaymentMethodToggle() {
        binding.paymentMethodGroup.addOnButtonCheckedListener((group, checkedId, isChecked) -> {
            if (!isChecked) return;
            
            if (checkedId == R.id.btnCash) {
                selectedPaymentMethod = "Cash";
                binding.tilTransactionId.setVisibility(android.view.View.GONE);
                // Don't clear text in edit mode if switching back and forth, but for new entry maybe?
                // Let's keep it simple and not clear, or clear if user wants.
                // binding.etTransactionId.setText(""); 
            } else if (checkedId == R.id.btnUpi) {
                selectedPaymentMethod = "UPI";
                binding.tilTransactionId.setVisibility(android.view.View.VISIBLE);
                binding.tilTransactionId.setHint("UPI Transaction ID");
            } else if (checkedId == R.id.btnBank) {
                selectedPaymentMethod = "Bank Transfer";
                binding.tilTransactionId.setVisibility(android.view.View.VISIBLE);
                binding.tilTransactionId.setHint("Transaction Reference");
            }
        });
    }
    
    private void setupTransactionIdField() {
        // Transaction ID is optional for cash, required for digital payments
        binding.etTransactionId.addTextChangedListener(new TextWatcher() {
            @Override
            public void afterTextChanged(Editable s) {
                validateTransactionId();
            }
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}
        });
    }
    
    private boolean validateTransactionId() {
        if (!selectedPaymentMethod.equals("Cash")) {
            String txnId = binding.etTransactionId.getText().toString().trim();
            if (txnId.isEmpty()) {
                binding.tilTransactionId.setError("Transaction ID required for " + selectedPaymentMethod);
                return false;
            }
        }
        binding.tilTransactionId.setError(null);
        return true;
    }
    
    private void setupSaveButton() {
        binding.btnSave.setOnClickListener(v -> handleSave());
    }
    
    private void loadFarmerDetails() {
        viewModel.getFarmerById(farmerId).observe(this, farmer -> {
            if (farmer != null) {
                binding.tvFarmerName.setText(farmer.getName());
                binding.tvFarmerMobile.setText(farmer.getMobile());
                binding.tvCurrentBalance.setText(String.format("₹%.2f", farmer.getBalance()));
                
                // Show warning if balance is low
                if (farmer.getBalance() < 100) {
                    binding.tvBalanceWarning.setVisibility(android.view.View.VISIBLE);
                    binding.tvBalanceWarning.setText("Low balance");
                } else {
                    binding.tvBalanceWarning.setVisibility(android.view.View.GONE);
                }
            }
        });
    }
    
    private void handleSave() {
        String amountStr = binding.etAmount.getText().toString().trim();
        String remarks = binding.etRemarks.getText().toString().trim();
        String transactionId = binding.etTransactionId.getText().toString().trim();
        
        // Validate amount
        if (amountStr.isEmpty()) {
            binding.tilAmount.setError("Amount is required");
            binding.etAmount.requestFocus();
            return;
        }
        
        double amount;
        try {
            amount = Double.parseDouble(amountStr);
            if (amount <= 0) {
                binding.tilAmount.setError("Amount must be greater than 0");
                binding.etAmount.requestFocus();
                return;
            }
        } catch (NumberFormatException e) {
            binding.tilAmount.setError("Invalid amount");
            binding.etAmount.requestFocus();
            return;
        }
        binding.tilAmount.setError(null);
        
        // Validate transaction ID for digital payments
        if (!validateTransactionId()) {
            binding.etTransactionId.requestFocus();
            return;
        }
        
        if (isEditMode) {
            viewModel.updatePayment(
                editingPayment,
                selectedDate,
                amount,
                selectedPaymentMethod,
                transactionId.isEmpty() ? null : transactionId,
                remarks.isEmpty() ? null : remarks
            );
            Toast.makeText(this, "Payment updated successfully", Toast.LENGTH_SHORT).show();
        } else {
            viewModel.savePayment(
                farmerId,
                selectedDate,
                amount,
                selectedPaymentMethod,
                transactionId.isEmpty() ? null : transactionId,
                remarks.isEmpty() ? null : remarks
            );
            Toast.makeText(this, "Payment recorded successfully", Toast.LENGTH_SHORT).show();
        }
        
        finish();
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        binding = null;
    }
}
