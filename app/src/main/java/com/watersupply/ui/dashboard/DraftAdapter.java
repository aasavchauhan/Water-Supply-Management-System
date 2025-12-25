package com.watersupply.ui.dashboard;

import android.view.LayoutInflater;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.ListAdapter;
import androidx.recyclerview.widget.RecyclerView;
import com.watersupply.data.models.SupplyEntry;
import com.watersupply.databinding.ItemDraftSupplyBinding;

public class DraftAdapter extends ListAdapter<SupplyEntry, DraftAdapter.DraftViewHolder> {

    private final OnDraftClickListener listener;

    public interface OnDraftClickListener {
        void onResumeClick(SupplyEntry entry);
    }

    public DraftAdapter(OnDraftClickListener listener) {
        super(new DiffUtil.ItemCallback<SupplyEntry>() {
            @Override
            public boolean areItemsTheSame(@NonNull SupplyEntry oldItem, @NonNull SupplyEntry newItem) {
                return oldItem.getId().equals(newItem.getId());
            }

            @Override
            public boolean areContentsTheSame(@NonNull SupplyEntry oldItem, @NonNull SupplyEntry newItem) {
                return oldItem.getUpdatedAt().equals(newItem.getUpdatedAt());
            }
        });
        this.listener = listener;
    }

    @NonNull
    @Override
    public DraftViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemDraftSupplyBinding binding = ItemDraftSupplyBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false);
        return new DraftViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull DraftViewHolder holder, int position) {
        holder.bind(getItem(position));
    }

    class DraftViewHolder extends RecyclerView.ViewHolder {
        private final ItemDraftSupplyBinding binding;

        public DraftViewHolder(ItemDraftSupplyBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
            
            binding.getRoot().setOnClickListener(v -> {
                int position = getAdapterPosition();
                if (position != RecyclerView.NO_POSITION) {
                    listener.onResumeClick(getItem(position));
                }
            });
            
            binding.btnResume.setOnClickListener(v -> {
                int position = getAdapterPosition();
                if (position != RecyclerView.NO_POSITION) {
                    listener.onResumeClick(getItem(position));
                }
            });
        }

        public void bind(SupplyEntry entry) {
            binding.tvFarmerName.setText(entry.getFarmerName() != null ? entry.getFarmerName() : "Unknown Farmer");
            
            String details;
            if ("time".equals(entry.getBillingMethod())) {
                details = "Time-based • Started: " + (entry.getStartTime() != null ? entry.getStartTime() : "N/A");
            } else {
                details = "Meter-based • Start: " + (entry.getMeterReadingStart() != null ? String.format(java.util.Locale.getDefault(), "%.2f", entry.getMeterReadingStart() / 100.0) : "N/A");
            }
            binding.tvDraftDetails.setText(details);
            
            // Pulsing animation for red dot
            android.animation.ObjectAnimator animator = android.animation.ObjectAnimator.ofFloat(binding.viewLiveDot, "alpha", 1f, 0.2f);
            animator.setDuration(800);
            animator.setRepeatCount(android.animation.ValueAnimator.INFINITE);
            animator.setRepeatMode(android.animation.ValueAnimator.REVERSE);
            animator.start();
        }
    }
}
