package com.watersupply.ui.supply;

import android.app.Dialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.watersupply.data.models.SupplyEntry;
import com.watersupply.databinding.DialogSupplyDetailBinding;
import com.watersupply.utils.CurrencyFormatter;
import com.watersupply.utils.DateFormatter;

import java.util.Locale;

import dagger.hilt.android.AndroidEntryPoint;

/**
 * Bottom sheet dialog showing supply entry details
 */
@AndroidEntryPoint
public class SupplyDetailDialog extends BottomSheetDialogFragment {
    
    private DialogSupplyDetailBinding binding;
    private SupplyEntry entry;
    
    @javax.inject.Inject
    com.watersupply.data.repository.SupplyRepository supplyRepository;
    
    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Hilt injection is handled by @AndroidEntryPoint annotation on class
    }
    
    public static SupplyDetailDialog newInstance(SupplyEntry entry) {
        SupplyDetailDialog dialog = new SupplyDetailDialog();
        dialog.entry = entry;
        return dialog;
    }
    
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = DialogSupplyDetailBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }
    
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        if (entry != null) {
            displayEntryDetails();
        }
        
        // TODO: Implement edit functionality
        binding.btnEdit.setOnClickListener(v -> {
            if (entry != null) {
                android.content.Intent intent = new android.content.Intent(requireContext(), NewSupplyActivity.class);
                intent.putExtra("supply_entry", entry);
                startActivity(intent);
                dismiss();
            }
        });
        
        binding.btnDelete.setOnClickListener(v -> {
            if (entry != null) {
                new com.google.android.material.dialog.MaterialAlertDialogBuilder(requireContext())
                    .setTitle("Delete Supply Entry")
                    .setMessage("Are you sure you want to delete this supply entry? This will revert the farmer's balance.")
                    .setPositiveButton("Delete", (dialog, which) -> {
                        // We need a way to call delete. 
                        // Since this is a DialogFragment, we should probably use a ViewModel or interface.
                        // For simplicity in this refactor, we can get the Repository from EntryPoint or ViewModel.
                        // Let's use the ViewModel associated with the parent activity or a new one.
                        // Actually, let's inject the repository here like in PaymentDetailDialog.
                        supplyRepository.deleteSupplyEntry(entry);
                        android.widget.Toast.makeText(requireContext(), "Supply entry deleted", android.widget.Toast.LENGTH_SHORT).show();
                        dismiss();
                    })
                    .setNegativeButton("Cancel", null)
                    .show();
            }
        });
    }
    
    private void displayEntryDetails() {
        binding.tvDate.setText(DateFormatter.format(entry.getDate()));
        binding.tvBillingMethod.setText(
            "meter".equals(entry.getBillingMethod()) ? "Meter Reading" : "Time Based"
        );
        
        if ("meter".equals(entry.getBillingMethod())) {
            binding.meterDetailsGroup.setVisibility(View.VISIBLE);
            binding.timeDetailsGroup.setVisibility(View.GONE);
            
            if (entry.getMeterReadingStart() != null) {
                binding.tvMeterStart.setText(String.format(Locale.getDefault(), "%.2f", entry.getMeterReadingStart() / 100.0));
            }
            if (entry.getMeterReadingEnd() != null) {
                binding.tvMeterEnd.setText(String.format(Locale.getDefault(), "%.2f", entry.getMeterReadingEnd() / 100.0));
            }
        } else {
            binding.meterDetailsGroup.setVisibility(View.GONE);
            binding.timeDetailsGroup.setVisibility(View.VISIBLE);
            
            binding.tvStartTime.setText(entry.getStartTime() != null ? entry.getStartTime() : "--:--");
            binding.tvStopTime.setText(entry.getStopTime() != null ? entry.getStopTime() : "--:--");
            binding.tvPauseDuration.setText(String.format(Locale.getDefault(), "%.2f hours", entry.getPauseDuration()));
        }
        
        if (entry.getTotalTimeUsed() != null) {
            binding.tvTotalHours.setText(String.format(Locale.getDefault(), "%.2f hours", entry.getTotalTimeUsed()));
        }
        
        binding.tvRate.setText(CurrencyFormatter.format(entry.getRate()) + "/hour");
        binding.tvAmount.setText(CurrencyFormatter.format(entry.getAmount()));
        
        if (entry.getRemarks() != null && !entry.getRemarks().isEmpty()) {
            binding.tvRemarks.setText(entry.getRemarks());
            binding.tvRemarks.setVisibility(View.VISIBLE);
            binding.tvRemarksLabel.setVisibility(View.VISIBLE);
        } else {
            binding.tvRemarks.setVisibility(View.GONE);
            binding.tvRemarksLabel.setVisibility(View.GONE);
        }
    }
}
