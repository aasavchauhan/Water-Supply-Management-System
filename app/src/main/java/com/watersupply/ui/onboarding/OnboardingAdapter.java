package com.watersupply.ui.onboarding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.watersupply.R;

public class OnboardingAdapter extends RecyclerView.Adapter<OnboardingAdapter.OnboardingViewHolder> {
    
    private final OnboardingItem[] onboardingItems = {
        new OnboardingItem(
            R.drawable.ic_onboarding_farmers,
            "Manage Farmers",
            "Add and organize farmer profiles with photos, contact details, and track their water usage effortlessly."
        ),
        new OnboardingItem(
            R.drawable.ic_onboarding_supply,
            "Track Water Supply",
            "Record water supply entries with dual billing methods - time-based or meter-based tracking for accurate billing."
        ),
        new OnboardingItem(
            R.drawable.ic_onboarding_payments,
            "Accept Payments",
            "Manage payments, track balances, and generate printable receipts for transparent transaction records."
        ),
        new OnboardingItem(
            R.drawable.ic_onboarding_analytics,
            "Analyze Business",
            "View insightful charts and reports to understand revenue trends, payment methods, and top customers."
        )
    };
    
    public OnboardingAdapter(OnboardingActivity activity) {
        // Constructor for future enhancements
    }
    
    @NonNull
    @Override
    public OnboardingViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
            .inflate(R.layout.item_onboarding, parent, false);
        return new OnboardingViewHolder(view);
    }
    
    @Override
    public void onBindViewHolder(@NonNull OnboardingViewHolder holder, int position) {
        OnboardingItem item = onboardingItems[position];
        holder.imageView.setImageResource(item.imageRes);
        holder.titleView.setText(item.title);
        holder.descriptionView.setText(item.description);
    }
    
    @Override
    public int getItemCount() {
        return onboardingItems.length;
    }
    
    static class OnboardingViewHolder extends RecyclerView.ViewHolder {
        ImageView imageView;
        TextView titleView;
        TextView descriptionView;
        
        OnboardingViewHolder(@NonNull View itemView) {
            super(itemView);
            imageView = itemView.findViewById(R.id.onboardingImage);
            titleView = itemView.findViewById(R.id.onboardingTitle);
            descriptionView = itemView.findViewById(R.id.onboardingDescription);
        }
    }
    
    static class OnboardingItem {
        int imageRes;
        String title;
        String description;
        
        OnboardingItem(int imageRes, String title, String description) {
            this.imageRes = imageRes;
            this.title = title;
            this.description = description;
        }
    }
}
