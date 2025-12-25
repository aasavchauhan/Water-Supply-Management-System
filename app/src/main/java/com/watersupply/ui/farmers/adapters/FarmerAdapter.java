package com.watersupply.ui.farmers.adapters;

import android.graphics.Color;
import android.net.Uri;
import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.ListAdapter;
import androidx.recyclerview.widget.RecyclerView;

import com.watersupply.R;
import com.watersupply.data.models.Farmer;
import com.watersupply.databinding.ItemFarmerBinding;
import com.watersupply.utils.CurrencyFormatter;

/**
 * RecyclerView adapter for Farmer list
 */
public class FarmerAdapter extends ListAdapter<Farmer, FarmerAdapter.ViewHolder> {
    
    private final OnFarmerClickListener listener;
    
    public FarmerAdapter(OnFarmerClickListener listener) {
        super(DIFF_CALLBACK);
        this.listener = listener;
    }
    
    private static final DiffUtil.ItemCallback<Farmer> DIFF_CALLBACK = 
        new DiffUtil.ItemCallback<Farmer>() {
            @Override
            public boolean areItemsTheSame(@NonNull Farmer oldItem, @NonNull Farmer newItem) {
                return oldItem.getId() != null && oldItem.getId().equals(newItem.getId());
            }
            
            @Override
            public boolean areContentsTheSame(@NonNull Farmer oldItem, @NonNull Farmer newItem) {
                return oldItem.getName().equals(newItem.getName()) && 
                       oldItem.getBalance() == newItem.getBalance();
            }
        };
    
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemFarmerBinding binding = ItemFarmerBinding.inflate(
            LayoutInflater.from(parent.getContext()), parent, false);
        return new ViewHolder(binding);
    }
    
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        holder.bind(getItem(position));
    }
    
    class ViewHolder extends RecyclerView.ViewHolder {
        private final ItemFarmerBinding binding;
        
        ViewHolder(ItemFarmerBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }
        
        void bind(Farmer farmer) {
            binding.tvName.setText(farmer.getName());
            binding.tvMobile.setText(farmer.getMobile());
            binding.tvBalance.setText("Balance: " + CurrencyFormatter.format(farmer.getBalance()));
            
            // Color-code balance (red if negative, green if positive)
            if (farmer.getBalance() < 0) {
                binding.tvBalance.setTextColor(Color.parseColor("#B00020")); // Error color
            } else if (farmer.getBalance() > 0) {
                binding.tvBalance.setTextColor(Color.parseColor("#00C853")); // Success color
            } else {
                // Reset to theme color
                binding.tvBalance.setTextColor(binding.tvName.getCurrentTextColor());
            }
            
            // Show placeholder icon
            binding.ivFarmerPhoto.setImageResource(R.drawable.ic_person);
            
            // Card click
            binding.cardFarmer.setOnClickListener(v -> listener.onFarmerClick(farmer));
            
            // Menu button
            binding.btnMenu.setOnClickListener(v -> listener.onMenuClick(farmer, v));
        }
    }
    
    public interface OnFarmerClickListener {
        void onFarmerClick(Farmer farmer);
        void onMenuClick(Farmer farmer, android.view.View view);
    }
}
