package com.watersupply.ui.payments;

import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.content.Intent;
import android.os.Bundle;
import android.os.Environment;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import com.watersupply.R;
import com.watersupply.databinding.ActivityPaymentListBinding;
import com.watersupply.data.models.Payment;
import com.watersupply.ui.payments.adapters.PaymentAdapter;
import com.watersupply.utils.CurrencyFormatter;
import com.watersupply.utils.DateFormatter;
import dagger.hilt.android.AndroidEntryPoint;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.inject.Inject;

@AndroidEntryPoint
public class PaymentListActivity extends AppCompatActivity {
    private ActivityPaymentListBinding binding;
    private PaymentListViewModel viewModel;
    private PaymentAdapter adapter;
    
    // Date filter variables
    private String startDate;
    private String endDate;
    private Calendar calendar = Calendar.getInstance();
    private MenuItem filterMenuItem;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityPaymentListBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        viewModel = new ViewModelProvider(this).get(PaymentListViewModel.class);
        
        setupToolbar();
        setupRecyclerView();
        setupFab();
        setupSwipeRefresh();
        observePayments();
        observeStatistics();
        observeFarmerMap();
    }
    
    private void setupToolbar() {
        binding.toolbar.setTitle("Payments");
        binding.toolbar.setNavigationOnClickListener(v -> finish());
    }
    
    private void setupRecyclerView() {
        adapter = new PaymentAdapter(new PaymentAdapter.OnPaymentClickListener() {
            @Override
            public void onPaymentClick(Payment payment) {
                // Show payment details dialog
                PaymentDetailDialog dialog = PaymentDetailDialog.newInstance(payment.getId());
                dialog.show(getSupportFragmentManager(), "payment_detail");
            }
        });
        
        binding.paymentRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        binding.paymentRecyclerView.setAdapter(adapter);
    }
    
    private void showDeleteConfirmation(Payment payment) {
        new AlertDialog.Builder(this)
            .setTitle("Delete Payment")
            .setMessage("Are you sure you want to delete this payment?\n\n" +
                "Date: " + DateFormatter.formatDate(payment.getPaymentDate()) + "\n" +
                "Amount: " + CurrencyFormatter.format(payment.getAmount()) + "\n" +
                "Method: " + payment.getPaymentMethod() + "\n\n" +
                "This action cannot be undone.")
            .setIcon(R.drawable.ic_delete)
            .setPositiveButton("Delete", (dialog, which) -> {
                viewModel.deletePayment(payment);
                Toast.makeText(this, "Payment deleted", Toast.LENGTH_SHORT).show();
            })
            .setNegativeButton("Cancel", null)
            .show();
    }
    
    private void setupFab() {
        binding.fab.setOnClickListener(v -> {
            // Show farmer selection dialog
            SelectFarmerForPaymentDialog dialog = new SelectFarmerForPaymentDialog();
            dialog.show(getSupportFragmentManager(), "select_farmer");
        });
    }
    
    private void observePayments() {
        viewModel.getPayments().observe(this, payments -> {
            binding.swipeRefresh.setRefreshing(false);
            binding.progressBar.setVisibility(View.GONE);
            
            if (payments == null || payments.isEmpty()) {
                binding.emptyView.setVisibility(View.VISIBLE);
                binding.paymentRecyclerView.setVisibility(View.GONE);
                binding.statsCard.setVisibility(View.GONE);
            } else {
                binding.emptyView.setVisibility(View.GONE);
                binding.paymentRecyclerView.setVisibility(View.VISIBLE);
                binding.statsCard.setVisibility(View.VISIBLE);
                adapter.submitList(payments);
            }
        });
    }
    
    private void observeStatistics() {
        viewModel.getTotalPayments().observe(this, total -> {
            if (total != null) {
                binding.tvTotalPayments.setText(String.valueOf(total));
            }
        });
        
        viewModel.getTotalAmount().observe(this, total -> {
            if (total != null) {
                binding.tvTotalAmount.setText(CurrencyFormatter.format(total));
            }
        });
        
        viewModel.getAveragePayment().observe(this, avg -> {
            if (avg != null) {
                binding.tvAveragePayment.setText(CurrencyFormatter.format(avg));
            }
        });
    }

    private void observeFarmerMap() {
        viewModel.getFarmerNameMap().observe(this, map -> {
            if (map != null) {
                adapter.setFarmerNameMap(map);
            }
        });
    }
    
    private void setupSwipeRefresh() {
        binding.swipeRefresh.setOnRefreshListener(() -> {
            viewModel.refreshData();
        });
    }
    
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_payment_list, menu);
        
        // Setup search
        MenuItem searchItem = menu.findItem(R.id.action_search);
        SearchView searchView = (SearchView) searchItem.getActionView();
        searchView.setQueryHint("Search by farmer or method...");
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                return false;
            }
            
            @Override
            public boolean onQueryTextChange(String newText) {
                viewModel.searchPayments(newText);
                return true;
            }
        });
        
        filterMenuItem = menu.findItem(R.id.action_filter);
        
        return true;
    }
    
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        
        if (id == R.id.action_filter) {
            showDateRangeFilter();
            return true;
        } else if (id == R.id.action_clear_filter) {
            clearFilter();
            return true;
        } else if (id == R.id.action_export) {
            exportToCSV();
            return true;
        } else if (id == R.id.action_sort_date) {
            viewModel.sortByDate();
            return true;
        } else if (id == R.id.action_sort_amount) {
            viewModel.sortByAmount();
            return true;
        }
        
        return super.onOptionsItemSelected(item);
    }
    
    private void showDateRangeFilter() {
        // Show start date picker
        DatePickerDialog startDatePicker = new DatePickerDialog(
            this,
            (view, year, month, dayOfMonth) -> {
                calendar.set(year, month, dayOfMonth);
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
                startDate = sdf.format(calendar.getTime());
                
                // Show end date picker
                DatePickerDialog endDatePicker = new DatePickerDialog(
                    this,
                    (view2, year2, month2, dayOfMonth2) -> {
                        calendar.set(year2, month2, dayOfMonth2);
                        endDate = sdf.format(calendar.getTime());
                        
                        // Apply filter
                        viewModel.filterByDateRange(startDate, endDate);
                        updateFilterMenuTitle();
                        Toast.makeText(this, "Filter applied: " + startDate + " to " + endDate, Toast.LENGTH_SHORT).show();
                    },
                    calendar.get(Calendar.YEAR),
                    calendar.get(Calendar.MONTH),
                    calendar.get(Calendar.DAY_OF_MONTH)
                );
                endDatePicker.setTitle("Select End Date");
                endDatePicker.show();
            },
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH)
        );
        startDatePicker.setTitle("Select Start Date");
        startDatePicker.show();
    }
    
    private void clearFilter() {
        startDate = null;
        endDate = null;
        viewModel.clearFilter();
        updateFilterMenuTitle();
        Toast.makeText(this, "Filter cleared", Toast.LENGTH_SHORT).show();
    }
    
    private void updateFilterMenuTitle() {
        if (filterMenuItem != null) {
            if (startDate != null && endDate != null) {
                filterMenuItem.setTitle("Filter: " + startDate + " - " + endDate);
            } else {
                filterMenuItem.setTitle("Filter by Date");
            }
        }
    }
    
    private void exportToCSV() {
        List<Payment> payments = viewModel.getPayments().getValue();
        if (payments == null || payments.isEmpty()) {
            Toast.makeText(this, "No payments to export", Toast.LENGTH_SHORT).show();
            return;
        }
        
        try {
            File downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(new Date());
            File file = new File(downloadsDir, "payments_" + timestamp + ".csv");
            
            FileWriter writer = new FileWriter(file);
            
            // Write CSV header
            writer.append("Date,Farmer,Amount,Payment Method,Transaction ID,Remarks\n");
            
            java.util.Map<String, String> farmerMap = viewModel.getFarmerNameMap().getValue();
            
            // Write payment entries
            for (Payment payment : payments) {
                writer.append(payment.getPaymentDate()).append(",");
                
                // Use farmer name if available, otherwise lookup, otherwise ID
                String farmer = payment.getFarmerName();
                if ((farmer == null || farmer.isEmpty()) && farmerMap != null) {
                    farmer = farmerMap.get(payment.getFarmerId());
                }
                if (farmer == null) farmer = payment.getFarmerId();
                
                writer.append(farmer != null ? farmer : "Unknown").append(",");
                writer.append(String.valueOf(payment.getAmount())).append(",");
                writer.append(payment.getPaymentMethod() != null ? payment.getPaymentMethod() : "").append(",");
                writer.append(payment.getTransactionId() != null ? payment.getTransactionId() : "").append(",");
                writer.append(payment.getRemarks() != null ? payment.getRemarks() : "").append("\n");
            }
            
            writer.flush();
            writer.close();
            
            Toast.makeText(this, "Exported to " + file.getAbsolutePath(), Toast.LENGTH_LONG).show();
        } catch (IOException e) {
            e.printStackTrace();
            Toast.makeText(this, "Export failed: " + e.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        binding = null;
    }
}
