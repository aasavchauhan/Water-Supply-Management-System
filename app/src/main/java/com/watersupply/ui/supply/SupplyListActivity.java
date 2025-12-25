package com.watersupply.ui.supply;

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
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.watersupply.R;
import com.watersupply.databinding.ActivitySupplyListBinding;
import com.watersupply.data.models.SupplyEntry;
import com.watersupply.data.repository.FarmerRepository;
import com.watersupply.utils.DateFormatter;
import com.watersupply.utils.CurrencyFormatter;

import java.io.File;
import java.io.FileWriter;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;

import javax.inject.Inject;
import dagger.hilt.android.AndroidEntryPoint;

/**
 * Activity showing list of supply entries
 */
@AndroidEntryPoint
public class SupplyListActivity extends AppCompatActivity {
    
    private ActivitySupplyListBinding binding;
    private SupplyListViewModel viewModel;
    private SupplyEntryAdapter adapter;
    private String startDate = null;
    private String endDate = null;
    private Calendar calendar = Calendar.getInstance();
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySupplyListBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        viewModel = new ViewModelProvider(this).get(SupplyListViewModel.class);
        
        setupToolbar();
        setupRecyclerView();
        setupFab();
        setupSwipeRefresh();
        observeSupplyEntries();
        observeStatistics();
        observeFarmers();
    }
    
    private void observeFarmers() {
        viewModel.getAllFarmers().observe(this, farmers -> {
            if (farmers != null) {
                java.util.Map<String, String> farmerMap = new java.util.HashMap<>();
                for (com.watersupply.data.models.Farmer farmer : farmers) {
                    farmerMap.put(farmer.getId(), farmer.getName());
                }
                if (adapter != null) {
                    adapter.setFarmerNames(farmerMap);
                }
            }
        });
    }
    
    private void setupToolbar() {
        setSupportActionBar(binding.toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle("Supply Entries");
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
    }
    
    private void setupRecyclerView() {
        adapter = new SupplyEntryAdapter(new SupplyEntryAdapter.OnSupplyEntryClickListener() {
            @Override
            public void onSupplyEntryClick(SupplyEntry entry) {
                SupplyDetailDialog dialog = SupplyDetailDialog.newInstance(entry);
                dialog.show(getSupportFragmentManager(), "SupplyDetail");
            }
        });
        
        binding.recyclerView.setLayoutManager(new LinearLayoutManager(this));
        binding.recyclerView.setAdapter(adapter);
    }
    
    private void showDeleteConfirmation(SupplyEntry entry) {
        new AlertDialog.Builder(this)
            .setTitle("Delete Supply Entry")
            .setMessage("Are you sure you want to delete this supply entry?\n\n" +
                "Date: " + DateFormatter.format(entry.getDate()) + "\n" +
                "Amount: " + CurrencyFormatter.format(entry.getAmount()) + "\n\n" +
                "This action cannot be undone.")
            .setIcon(R.drawable.ic_delete)
            .setPositiveButton("Delete", (dialog, which) -> {
                viewModel.deleteSupplyEntry(entry);
                Toast.makeText(this, "Supply entry deleted", Toast.LENGTH_SHORT).show();
            })
            .setNegativeButton("Cancel", null)
            .show();
    }
    
    private void observeSupplyEntries() {
        viewModel.getSupplyEntries().observe(this, entries -> {
            binding.progressBar.setVisibility(View.GONE);
            if (entries == null || entries.isEmpty()) {
                binding.emptyView.setVisibility(View.VISIBLE);
                binding.recyclerView.setVisibility(View.GONE);
                binding.statsCard.setVisibility(View.GONE);
            } else {
                binding.emptyView.setVisibility(View.GONE);
                binding.recyclerView.setVisibility(View.VISIBLE);
                binding.statsCard.setVisibility(View.VISIBLE);
                adapter.submitList(entries);
            }
        });
    }
    
    private void observeStatistics() {
        viewModel.getTotalEntries().observe(this, count -> {
            binding.tvTotalEntries.setText(String.valueOf(count != null ? count : 0));
        });
        
        viewModel.getTotalHours().observe(this, hours -> {
            binding.tvTotalHours.setText(String.format("%.2f hrs", hours != null ? hours : 0.0));
        });
        
        viewModel.getTotalRevenue().observe(this, revenue -> {
            binding.tvTotalRevenue.setText(CurrencyFormatter.format(revenue != null ? revenue : 0.0));
        });
    }
    
    private void setupSwipeRefresh() {
        binding.swipeRefresh.setOnRefreshListener(() -> {
            viewModel.refreshData();
            binding.swipeRefresh.setRefreshing(false);
        });
    }
    
    private void setupFab() {
        binding.fab.setOnClickListener(v -> {
            // Show farmer selection dialog
            SelectFarmerDialog dialog = new SelectFarmerDialog();
            dialog.show(getSupportFragmentManager(), "SelectFarmer");
        });
    }
    
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_supply_list, menu);
        updateFilterMenuTitle(menu);
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
        }
        return super.onOptionsItemSelected(item);
    }
    
    private void updateFilterMenuTitle(Menu menu) {
        MenuItem filterItem = menu.findItem(R.id.action_filter);
        if (startDate != null && endDate != null) {
            filterItem.setTitle("Filter: " + DateFormatter.format(startDate, "dd/MM") + " - " + DateFormatter.format(endDate, "dd/MM"));
        }
    }
    
    private void showDateRangeFilter() {
        DatePickerDialog startPicker = new DatePickerDialog(this,
            (view, year, month, day) -> {
                calendar.set(year, month, day);
                startDate = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(calendar.getTime());
                
                DatePickerDialog endPicker = new DatePickerDialog(this,
                    (v, y, m, d) -> {
                        calendar.set(y, m, d);
                        endDate = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(calendar.getTime());
                        viewModel.filterByDateRange(startDate, endDate);
                        invalidateOptionsMenu();
                    },
                    calendar.get(Calendar.YEAR),
                    calendar.get(Calendar.MONTH),
                    calendar.get(Calendar.DAY_OF_MONTH));
                endPicker.setTitle("Select End Date");
                endPicker.show();
            },
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH));
        startPicker.setTitle("Select Start Date");
        startPicker.show();
    }
    
    private void clearFilter() {
        startDate = null;
        endDate = null;
        viewModel.clearFilter();
        invalidateOptionsMenu();
        Toast.makeText(this, "Filter cleared", Toast.LENGTH_SHORT).show();
    }
    
    private void exportToCSV() {
        viewModel.getSupplyEntries().observe(this, entries -> {
            if (entries == null || entries.isEmpty()) {
                Toast.makeText(this, "No data to export", Toast.LENGTH_SHORT).show();
                return;
            }
            
            new Thread(() -> {
                try {
                    String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(System.currentTimeMillis());
                    String filename = "supply_entries_" + timestamp + ".csv";
                    
                    File downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                    File exportFile = new File(downloadsDir, filename);
                    
                    FileWriter writer = new FileWriter(exportFile);
                    writer.write("Date,Farmer,Billing Method,Time Used,Water Used,Rate,Amount\n");
                    
                    for (var entry : entries) {
                        writer.write(String.format("%s,%s,%s,%.2f,%.2f,%.2f,%.2f\n",
                            entry.getDate(),
                            entry.getFarmerName() != null ? entry.getFarmerName() : "Unknown",
                            entry.getBillingMethod(),
                            entry.getTotalTimeUsed() != null ? entry.getTotalTimeUsed() : 0.0,
                            entry.getTotalWaterUsed() != null ? entry.getTotalWaterUsed() : 0.0,
                            entry.getRate(),
                            entry.getAmount()));
                    }
                    
                    writer.close();
                    runOnUiThread(() -> Toast.makeText(this, "Exported to " + filename, Toast.LENGTH_LONG).show());
                } catch (Exception e) {
                    e.printStackTrace();
                    runOnUiThread(() -> Toast.makeText(this, "Export failed: " + e.getMessage(), Toast.LENGTH_SHORT).show());
                }
            }).start();
        });
    }
    
    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }
}
