package com.watersupply.ui.farmers;

import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.PopupMenu;
import android.widget.Toast;
import androidx.appcompat.widget.SearchView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.watersupply.R;
import com.watersupply.databinding.ActivityFarmerListBinding;
import com.watersupply.data.models.Farmer;
import com.watersupply.ui.farmers.adapters.FarmerAdapter;

import java.util.ArrayList;
import java.util.List;

import dagger.hilt.android.AndroidEntryPoint;

/**
 * Activity showing list of all farmers with Firebase real-time updates
 */
@AndroidEntryPoint
public class FarmerListActivity extends AppCompatActivity {
    
    private ActivityFarmerListBinding binding;
    private FarmerAdapter adapter;
    private FarmerListViewModel viewModel;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityFarmerListBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        viewModel = new ViewModelProvider(this).get(FarmerListViewModel.class);
        
        setupToolbar();
        setupRecyclerView();
        setupFab();
        setupSwipeRefresh();
        observeFarmers();
    }
    
    private void setupToolbar() {
        setSupportActionBar(binding.toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle("Farmers");
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
    }
    
    private void setupRecyclerView() {
        adapter = new FarmerAdapter(new FarmerAdapter.OnFarmerClickListener() {
            @Override
            public void onFarmerClick(Farmer farmer) {
                Intent intent = new Intent(FarmerListActivity.this, FarmerDetailActivity.class);
                intent.putExtra("farmer_id", farmer.getId());
                startActivity(intent);
            }
            
            @Override
            public void onMenuClick(Farmer farmer, View view) {
                showFarmerMenu(farmer, view);
            }
        });
        
        binding.recyclerView.setLayoutManager(new LinearLayoutManager(this));
        binding.recyclerView.setAdapter(adapter);
    }
    
    private void showFarmerMenu(Farmer farmer, View anchorView) {
        PopupMenu popup = new PopupMenu(this, anchorView);
        popup.inflate(R.menu.menu_farmer_item);
        popup.setOnMenuItemClickListener(item -> {
            int itemId = item.getItemId();
            if (itemId == R.id.action_edit) {
                Intent intent = new Intent(this, EditFarmerActivity.class);
                intent.putExtra("farmer_id", farmer.getId());
                startActivity(intent);
                return true;
            } else if (itemId == R.id.action_delete) {
                showDeleteConfirmation(farmer);
                return true;
            } else if (itemId == R.id.action_view_details) {
                Intent intent = new Intent(this, FarmerDetailActivity.class);
                intent.putExtra("farmer_id", farmer.getId());
                startActivity(intent);
                return true;
            }
            return false;
        });
        popup.show();
    }
    
    private void showDeleteConfirmation(Farmer farmer) {
        new AlertDialog.Builder(this)
            .setTitle("Delete Farmer")
            .setMessage("Are you sure you want to delete " + farmer.getName() + "?\n\n" +
                "This will mark the farmer as inactive.\n\n" +
                "This action can be reversed later.")
            .setIcon(R.drawable.ic_delete)
            .setPositiveButton("Delete", (dialog, which) -> {
                viewModel.deleteFarmer(farmer);
                Toast.makeText(this, "Farmer deleted", Toast.LENGTH_SHORT).show();
            })
            .setNegativeButton("Cancel", null)
            .show();
    }
    
    private void setupFab() {
        binding.fab.setOnClickListener(v -> {
            Intent intent = new Intent(this, AddFarmerActivity.class);
            startActivity(intent);
        });
    }
    
    private void setupSwipeRefresh() {
        binding.swipeRefresh.setOnRefreshListener(() -> {
            viewModel.refreshFarmers();
            binding.swipeRefresh.setRefreshing(false);
        });
    }
    
    private void observeFarmers() {
        viewModel.getFarmers().observe(this, this::updateUI);
    }
    
    private void updateUI(List<Farmer> farmers) {
        binding.progressBar.setVisibility(View.GONE);
        if (farmers == null || farmers.isEmpty()) {
            binding.emptyView.setVisibility(View.VISIBLE);
            binding.recyclerView.setVisibility(View.GONE);
        } else {
            binding.emptyView.setVisibility(View.GONE);
            binding.recyclerView.setVisibility(View.VISIBLE);
            adapter.submitList(new ArrayList<>(farmers));
        }
    }
    
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_farmer_list, menu);
        
        MenuItem searchItem = menu.findItem(R.id.action_search);
        SearchView searchView = (SearchView) searchItem.getActionView();
        searchView.setQueryHint("Search farmers...");
        
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                return false;
            }
            
            @Override
            public boolean onQueryTextChange(String newText) {
                viewModel.searchFarmers(newText);
                return true;
            }
        });
        
        return true;
    }
    
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == R.id.action_sort_name) {
            viewModel.sortByName();
            return true;
        } else if (item.getItemId() == R.id.action_sort_balance) {
            viewModel.sortByBalance();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
    
    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }
}
