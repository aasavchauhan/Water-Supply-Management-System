package com.watersupply.ui.dashboard;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.watersupply.R;
import com.watersupply.databinding.ActivityMainBinding;
import com.watersupply.ui.farmers.FarmerListActivity;
import com.watersupply.ui.supply.SupplyListActivity;
import com.watersupply.ui.payments.PaymentListActivity;
import com.watersupply.ui.profile.ProfileFragment;

import dagger.hilt.android.AndroidEntryPoint;

/**
 * Main dashboard with bottom navigation
 */
@AndroidEntryPoint
public class DashboardActivity extends AppCompatActivity {
    
    private ActivityMainBinding binding;
    private DashboardViewModel viewModel;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        viewModel = new ViewModelProvider(this).get(DashboardViewModel.class);
        
        setupBottomNavigation();
        setupFloatingActionButton();
        
        // Load dashboard fragment by default
        if (savedInstanceState == null) {
            loadDashboardFragment();
        }
    }
    
    private void setupBottomNavigation() {
        binding.bottomNavigation.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            
            if (itemId == R.id.nav_home) {
                loadDashboardFragment();
                return true;
            } else if (itemId == R.id.nav_search) {
                loadSearchFragment();
                return true;
            } else if (itemId == R.id.nav_reports) {
                loadReportsFragment();
                return true;
            } else if (itemId == R.id.nav_profile) {
                loadProfileFragment();
                return true;
            }
            
            return false;
        });
        
        // Set home as selected
        binding.bottomNavigation.setSelectedItemId(R.id.nav_home);
    }
    
    private void setupFloatingActionButton() {
        binding.fabAddSupply.setOnClickListener(v -> {
            Intent intent = new Intent(this, com.watersupply.ui.supply.NewSupplyActivity.class);
            startActivity(intent);
        });
    }
    
    private void loadDashboardFragment() {
        getSupportFragmentManager().beginTransaction()
                .replace(R.id.nav_host_fragment, new DashboardFragment())
                .commit();
    }
    
    private void loadSearchFragment() {
        // Navigate to Farmers List
        Intent intent = new Intent(this, FarmerListActivity.class);
        startActivity(intent);
    }
    
    private void loadReportsFragment() {
        getSupportFragmentManager().beginTransaction()
                .replace(R.id.nav_host_fragment, new com.watersupply.ui.reports.ReportsFragment())
                .commit();
    }
    
    private void loadProfileFragment() {
        getSupportFragmentManager().beginTransaction()
                .replace(R.id.nav_host_fragment, new ProfileFragment())
                .commit();
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        binding = null;
    }
}
