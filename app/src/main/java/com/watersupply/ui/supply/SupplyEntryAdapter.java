package com.watersupply.ui.supply;

import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.ListAdapter;
import androidx.recyclerview.widget.RecyclerView;

import com.watersupply.data.models.SupplyEntry;
import com.watersupply.databinding.ItemSupplyEntryBinding;
import com.watersupply.utils.CurrencyFormatter;
import com.watersupply.utils.DateFormatter;

import java.util.Locale;

/**
 * Adapter for displaying supply entries in RecyclerView
 */
public class SupplyEntryAdapter extends ListAdapter<SupplyEntry, SupplyEntryAdapter.ViewHolder> {
    
    private final OnSupplyEntryClickListener listener;
    private boolean isDetailMode = false;
    
    public SupplyEntryAdapter(OnSupplyEntryClickListener listener) {
        super(DIFF_CALLBACK);
        this.listener = listener;
    }
    
    public void setDetailMode(boolean isDetailMode) {
        this.isDetailMode = isDetailMode;
    }
    
    private static final DiffUtil.ItemCallback<SupplyEntry> DIFF_CALLBACK = 
        new DiffUtil.ItemCallback<SupplyEntry>() {
            @Override
            public boolean areItemsTheSame(@NonNull SupplyEntry oldItem, @NonNull SupplyEntry newItem) {
                return oldItem.getId().equals(newItem.getId());
            }
            
            @Override
            public boolean areContentsTheSame(@NonNull SupplyEntry oldItem, @NonNull SupplyEntry newItem) {
                return oldItem.getDate().equals(newItem.getDate()) && 
                       oldItem.getAmount() == newItem.getAmount() &&
                       oldItem.getBillingMethod().equals(newItem.getBillingMethod());
            }
        };
    
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemSupplyEntryBinding binding = ItemSupplyEntryBinding.inflate(
            LayoutInflater.from(parent.getContext()), parent, false);
        return new ViewHolder(binding);
    }
    
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        holder.bind(getItem(position));
    }
    
    private java.util.Map<String, String> farmerNames = new java.util.HashMap<>();
    
    public void setFarmerNames(java.util.Map<String, String> farmerNames) {
        this.farmerNames = farmerNames;
        notifyDataSetChanged();
    }

    class ViewHolder extends RecyclerView.ViewHolder {
        private final ItemSupplyEntryBinding binding;
        
        ViewHolder(ItemSupplyEntryBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }
        
        void bind(SupplyEntry entry) {
            if (isDetailMode) {
                binding.tvFarmerName.setVisibility(android.view.View.GONE);
            } else {
                binding.tvFarmerName.setVisibility(android.view.View.VISIBLE);
                if (entry.getFarmerName() != null) {
                    binding.tvFarmerName.setText(entry.getFarmerName());
                } else if (entry.getFarmerId() != null && farmerNames.containsKey(entry.getFarmerId())) {
                    binding.tvFarmerName.setText(farmerNames.get(entry.getFarmerId()));
                } else {
                    binding.tvFarmerName.setText("Unknown Farmer");
                }
            }
            
            binding.tvDate.setText(DateFormatter.format(entry.getDate()));
            
            String methodText = "meter".equals(entry.getBillingMethod()) ? "Meter" : "Time";
            binding.tvBillingMethod.setText(methodText);
            
            if (entry.getTotalTimeUsed() != null) {
                binding.tvUsage.setText(
                    String.format(Locale.getDefault(), "%.2f hours", entry.getTotalTimeUsed())
                );
            } else {
                binding.tvUsage.setText("--");
            }
            
            // Show rate alongside usage
            if (entry.getRate() > 0) {
                binding.tvRate.setText(
                    String.format(Locale.getDefault(), "%s/hr", CurrencyFormatter.format(entry.getRate()))
                );
                binding.tvRate.setVisibility(android.view.View.VISIBLE);
            } else {
                binding.tvRate.setVisibility(android.view.View.GONE);
            }
            
            // Change usage icon based on billing method
            if ("meter".equals(entry.getBillingMethod())) {
                binding.ivUsageIcon.setImageResource(com.watersupply.R.drawable.ic_speedometer);
            } else {
                binding.ivUsageIcon.setImageResource(com.watersupply.R.drawable.ic_timer);
            }
            
            binding.tvAmount.setText(CurrencyFormatter.format(entry.getAmount()));
            
            // Card click - show detail dialog
            binding.cardSupplyEntry.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onSupplyEntryClick(entry);
                }
            });
        }
    }
    
    public interface OnSupplyEntryClickListener {
        void onSupplyEntryClick(SupplyEntry entry);
    }
}
