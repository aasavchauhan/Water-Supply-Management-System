package com.watersupply.ui.supply;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.watersupply.data.models.Farmer;
import com.watersupply.databinding.DialogSelectFarmerBinding;
import com.watersupply.ui.farmers.adapters.FarmerAdapter;

import dagger.hilt.android.AndroidEntryPoint;

/**
 * Bottom sheet dialog for selecting a farmer
 */
@AndroidEntryPoint
public class SelectFarmerDialog extends BottomSheetDialogFragment {
    
    private DialogSelectFarmerBinding binding;
    private SelectFarmerViewModel viewModel;
    private FarmerAdapter adapter;
    
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = DialogSelectFarmerBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }
    
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        viewModel = new ViewModelProvider(this).get(SelectFarmerViewModel.class);
        
        setupRecyclerView();
        observeFarmers();
    }
    
    private void setupRecyclerView() {
        adapter = new FarmerAdapter(new FarmerAdapter.OnFarmerClickListener() {
            @Override
            public void onFarmerClick(Farmer farmer) {
                // Navigate to NewSupplyActivity with selected farmer
                Intent intent = new Intent(requireContext(), NewSupplyActivity.class);
                intent.putExtra("farmer_id", farmer.getId());
                intent.putExtra("farmer_name", farmer.getName());
                startActivity(intent);
                dismiss();
            }

            @Override
            public void onMenuClick(Farmer farmer, View anchorView) {
                // Menu not needed in selection dialog
            }
        });
        
        binding.recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.recyclerView.setAdapter(adapter);
    }
    
    private void observeFarmers() {
        viewModel.getFarmers().observe(getViewLifecycleOwner(), farmers -> {
            adapter.submitList(farmers);
            
            if (farmers == null || farmers.isEmpty()) {
                binding.emptyStateCard.setVisibility(View.VISIBLE);
                binding.recyclerView.setVisibility(View.GONE);
            } else {
                binding.emptyStateCard.setVisibility(View.GONE);
                binding.recyclerView.setVisibility(View.VISIBLE);
            }
        });
    }
}
