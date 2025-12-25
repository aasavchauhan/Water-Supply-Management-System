package com.watersupply.ui.payments;

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
import com.watersupply.databinding.DialogSelectFarmerForPaymentBinding;
import com.watersupply.ui.farmers.adapters.FarmerAdapter;
import android.content.Intent;
import dagger.hilt.android.AndroidEntryPoint;

@AndroidEntryPoint
public class SelectFarmerForPaymentDialog extends BottomSheetDialogFragment {
    private DialogSelectFarmerForPaymentBinding binding;
    private SelectFarmerForPaymentViewModel viewModel;
    private FarmerAdapter adapter;
    
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = DialogSelectFarmerForPaymentBinding.inflate(inflater, container, false);
        viewModel = new ViewModelProvider(this).get(SelectFarmerForPaymentViewModel.class);
        
        setupRecyclerView();
        observeFarmers();
        
        return binding.getRoot();
    }
    
    private void setupRecyclerView() {
        adapter = new FarmerAdapter(new FarmerAdapter.OnFarmerClickListener() {
            @Override
            public void onFarmerClick(Farmer farmer) {
                // Navigate to AddPaymentActivity with selected farmer
                Intent intent = new Intent(requireContext(), AddPaymentActivity.class);
                intent.putExtra("farmer_id", farmer.getId());
                startActivity(intent);
                dismiss();
            }

            @Override
            public void onMenuClick(Farmer farmer, View anchorView) {
                // Menu not needed in selection dialog
            }
        });
        
        binding.farmerRecyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.farmerRecyclerView.setAdapter(adapter);
    }
    
    private void observeFarmers() {
        viewModel.getFarmers().observe(getViewLifecycleOwner(), farmers -> {
            if (farmers == null || farmers.isEmpty()) {
                binding.emptyView.setVisibility(View.VISIBLE);
                binding.farmerRecyclerView.setVisibility(View.GONE);
            } else {
                binding.emptyView.setVisibility(View.GONE);
                binding.farmerRecyclerView.setVisibility(View.VISIBLE);
                adapter.submitList(farmers);
            }
        });
    }
    
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
