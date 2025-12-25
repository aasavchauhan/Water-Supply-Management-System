package com.watersupply.ui.payments.adapters;

import android.view.LayoutInflater;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.ListAdapter;
import androidx.recyclerview.widget.RecyclerView;
import com.watersupply.databinding.ItemPaymentBinding;
import com.watersupply.data.models.Payment;
import com.watersupply.utils.CurrencyFormatter;
import com.watersupply.utils.DateFormatter;

public class PaymentAdapter extends ListAdapter<Payment, PaymentAdapter.ViewHolder> {
    private final OnPaymentClickListener listener;
    private boolean isDetailMode = false;
    
    public PaymentAdapter(OnPaymentClickListener listener) {
        super(DIFF_CALLBACK);
        this.listener = listener;
    }
    
    public void setDetailMode(boolean isDetailMode) {
        this.isDetailMode = isDetailMode;
    }
    
    private static final DiffUtil.ItemCallback<Payment> DIFF_CALLBACK = 
        new DiffUtil.ItemCallback<Payment>() {
            @Override
            public boolean areItemsTheSame(@NonNull Payment oldItem, @NonNull Payment newItem) {
                return oldItem.getId() != null && oldItem.getId().equals(newItem.getId());
            }
            
            @Override
            public boolean areContentsTheSame(@NonNull Payment oldItem, @NonNull Payment newItem) {
                return oldItem.getAmount() == newItem.getAmount() &&
                       (oldItem.getPaymentDate() != null ? oldItem.getPaymentDate().equals(newItem.getPaymentDate()) : newItem.getPaymentDate() == null) &&
                       (oldItem.getPaymentMethod() != null ? oldItem.getPaymentMethod().equals(newItem.getPaymentMethod()) : newItem.getPaymentMethod() == null);
            }
        };
    
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemPaymentBinding binding = ItemPaymentBinding.inflate(
            LayoutInflater.from(parent.getContext()), parent, false);
        return new ViewHolder(binding);
    }
    
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        holder.bind(getItem(position));
    }
    
    private java.util.Map<String, String> farmerNameMap = new java.util.HashMap<>();
    
    public void setFarmerNameMap(java.util.Map<String, String> farmerNameMap) {
        this.farmerNameMap = farmerNameMap;
        notifyDataSetChanged();
    }
    
    class ViewHolder extends RecyclerView.ViewHolder {
        private final ItemPaymentBinding binding;
        
        ViewHolder(ItemPaymentBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }
        
        void bind(Payment payment) {
            if (isDetailMode) {
                binding.tvFarmerName.setVisibility(android.view.View.GONE);
            } else {
                binding.tvFarmerName.setVisibility(android.view.View.VISIBLE);
                
                String farmerName = payment.getFarmerName();
                // Fix: Fallback to map if name is missing in payment object
                if (farmerName == null || farmerName.isEmpty()) {
                    if (farmerNameMap != null && payment.getFarmerId() != null) {
                        farmerName = farmerNameMap.get(payment.getFarmerId());
                    }
                }
                
                if (farmerName != null && !farmerName.isEmpty()) {
                    binding.tvFarmerName.setText(farmerName);
                } else {
                    binding.tvFarmerName.setText("-"); // Changed from "Unknown Farmer" for cleaner look
                }
            }
            
            binding.tvPaymentDate.setText(DateFormatter.formatDate(payment.getPaymentDate()));
            binding.tvAmount.setText(CurrencyFormatter.format(payment.getAmount()));
            binding.tvPaymentMethod.setText(payment.getPaymentMethod());
            
            // Show transaction ID badge if present
            if (payment.getTransactionId() != null && !payment.getTransactionId().isEmpty()) {
                binding.tvTransactionId.setVisibility(android.view.View.VISIBLE);
                binding.tvTransactionId.setText(payment.getTransactionId());
            } else {
                binding.tvTransactionId.setVisibility(android.view.View.GONE);
            }
            
            // Card click - show detail dialog
            binding.cardPayment.setOnClickListener(v -> listener.onPaymentClick(payment));
        }
    }
    
    public interface OnPaymentClickListener {
        void onPaymentClick(Payment payment);
    }
}
