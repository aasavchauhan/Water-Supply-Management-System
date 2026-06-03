package com.watersupply.ui.settlement;

import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.ListAdapter;
import androidx.recyclerview.widget.RecyclerView;

import com.watersupply.R;
import com.watersupply.data.models.Settlement;
import com.watersupply.databinding.ItemSettlementBinding;
import com.watersupply.utils.CurrencyFormatter;
import com.watersupply.utils.DateFormatter;

/**
 * Adapter for displaying settlement history in RecyclerView
 */
public class SettlementAdapter extends ListAdapter<Settlement, SettlementAdapter.ViewHolder> {

    private final OnSettlementClickListener listener;
    private boolean isDetailMode = false;

    public SettlementAdapter(OnSettlementClickListener listener) {
        super(DIFF_CALLBACK);
        this.listener = listener;
    }

    public void setDetailMode(boolean isDetailMode) {
        this.isDetailMode = isDetailMode;
    }

    private static final DiffUtil.ItemCallback<Settlement> DIFF_CALLBACK =
        new DiffUtil.ItemCallback<Settlement>() {
            @Override
            public boolean areItemsTheSame(@NonNull Settlement oldItem, @NonNull Settlement newItem) {
                return oldItem.getId() != null && oldItem.getId().equals(newItem.getId());
            }

            @Override
            public boolean areContentsTheSame(@NonNull Settlement oldItem, @NonNull Settlement newItem) {
                return oldItem.getAmountReceived() == newItem.getAmountReceived()
                    && oldItem.getTotalCharges() == newItem.getTotalCharges();
            }
        };

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemSettlementBinding binding = ItemSettlementBinding.inflate(
            LayoutInflater.from(parent.getContext()), parent, false);
        return new ViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        holder.bind(getItem(position));
    }

    class ViewHolder extends RecyclerView.ViewHolder {
        private final ItemSettlementBinding binding;

        ViewHolder(ItemSettlementBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        void bind(Settlement settlement) {
            // Farmer name
            if (isDetailMode) {
                binding.tvFarmerName.setVisibility(android.view.View.GONE);
            } else {
                binding.tvFarmerName.setVisibility(android.view.View.VISIBLE);
                binding.tvFarmerName.setText(settlement.getFarmerName() != null 
                    ? settlement.getFarmerName() : "Unknown");
            }

            // Date
            binding.tvDate.setText(DateFormatter.format(settlement.getSettlementDate()));

            // Amount received
            binding.tvAmountReceived.setText(CurrencyFormatter.format(settlement.getAmountReceived()));

            // Charges and paid
            binding.tvCharges.setText(CurrencyFormatter.format(settlement.getOutstandingAmount()));
            binding.tvPaid.setText(CurrencyFormatter.format(settlement.getAmountReceived()));

            // Adjustment
            String adjustmentType = settlement.getAdjustmentType();
            double adjustmentAmt = settlement.getAdjustmentAmount();

            if ("EXACT".equals(adjustmentType)) {
                binding.tvAdjustmentBadge.setText("Exact");
                binding.tvAdjustmentBadge.setBackgroundResource(R.drawable.bg_badge_success);
                binding.tvAdjustmentBadge.setTextColor(
                    binding.getRoot().getContext().getColor(R.color.success));
                binding.tvAdjustmentLabel.setText("Adjustment");
                binding.tvAdjustmentAmount.setText("₹0");
                binding.tvAdjustmentAmount.setTextColor(
                    binding.getRoot().getContext().getColor(R.color.success));
            } else if ("WRITEOFF".equals(adjustmentType)) {
                binding.tvAdjustmentBadge.setText("Write-off");
                binding.tvAdjustmentBadge.setBackgroundResource(R.drawable.bg_badge_warning);
                binding.tvAdjustmentBadge.setTextColor(
                    binding.getRoot().getContext().getColor(R.color.warning));
                binding.tvAdjustmentLabel.setText("Write-off");
                binding.tvAdjustmentAmount.setText(CurrencyFormatter.format(adjustmentAmt));
                binding.tvAdjustmentAmount.setTextColor(
                    binding.getRoot().getContext().getColor(R.color.warning));
            } else if ("OVERPAYMENT".equals(adjustmentType)) {
                binding.tvAdjustmentBadge.setText("Overpaid");
                binding.tvAdjustmentBadge.setBackgroundResource(R.drawable.bg_badge_info);
                binding.tvAdjustmentBadge.setTextColor(
                    binding.getRoot().getContext().getColor(R.color.brand_primary));
                binding.tvAdjustmentLabel.setText("Overpaid");
                binding.tvAdjustmentAmount.setText("+" + CurrencyFormatter.format(adjustmentAmt));
                binding.tvAdjustmentAmount.setTextColor(
                    binding.getRoot().getContext().getColor(R.color.brand_primary));
            }

            // Click listener
            binding.cardSettlement.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onSettlementClick(settlement);
                }
            });
        }
    }

    public interface OnSettlementClickListener {
        void onSettlementClick(Settlement settlement);
    }
}
