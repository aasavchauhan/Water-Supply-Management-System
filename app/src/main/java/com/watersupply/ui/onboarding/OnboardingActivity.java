package com.watersupply.ui.onboarding;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;
import androidx.viewpager2.widget.ViewPager2;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;
import com.watersupply.R;
import com.watersupply.databinding.ActivityOnboardingBinding;
import com.watersupply.ui.auth.LoginActivity;

public class OnboardingActivity extends AppCompatActivity {
    private ActivityOnboardingBinding binding;
    private OnboardingAdapter adapter;
    private SharedPreferences prefs;
    
    private static final String PREFS_NAME = "onboarding_prefs";
    private static final String KEY_ONBOARDING_COMPLETED = "onboarding_completed";
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityOnboardingBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        
        // Check if onboarding is already completed
        if (prefs.getBoolean(KEY_ONBOARDING_COMPLETED, false)) {
            navigateToLogin();
            return;
        }
        
        setupViewPager();
        setupButtons();
    }
    
    private void setupViewPager() {
        adapter = new OnboardingAdapter(this);
        binding.viewPager.setAdapter(adapter);
        
        // Attach tab dots to ViewPager2
        new TabLayoutMediator(binding.tabDots, binding.viewPager,
            (tab, position) -> {
                // Dots are automatically created
            }
        ).attach();
        
        // Update button visibility based on page
        binding.viewPager.registerOnPageChangeCallback(new ViewPager2.OnPageChangeCallback() {
            @Override
            public void onPageSelected(int position) {
                super.onPageSelected(position);
                updateButtonVisibility(position);
            }
        });
    }
    
    private void setupButtons() {
        binding.btnSkip.setOnClickListener(v -> completeOnboarding());
        
        binding.btnNext.setOnClickListener(v -> {
            int currentItem = binding.viewPager.getCurrentItem();
            if (currentItem < adapter.getItemCount() - 1) {
                binding.viewPager.setCurrentItem(currentItem + 1, true);
            }
        });
        
        binding.btnGetStarted.setOnClickListener(v -> completeOnboarding());
    }
    
    private void updateButtonVisibility(int position) {
        boolean isLastPage = position == adapter.getItemCount() - 1;
        
        binding.btnSkip.setVisibility(isLastPage ? View.GONE : View.VISIBLE);
        binding.btnNext.setVisibility(isLastPage ? View.GONE : View.VISIBLE);
        binding.btnGetStarted.setVisibility(isLastPage ? View.VISIBLE : View.GONE);
    }
    
    private void completeOnboarding() {
        // Mark onboarding as completed
        prefs.edit().putBoolean(KEY_ONBOARDING_COMPLETED, true).apply();
        
        // Navigate to business setup
        Intent intent = new Intent(this, BusinessSetupActivity.class);
        startActivity(intent);
        finish();
    }
    
    private void navigateToLogin() {
        Intent intent = new Intent(this, LoginActivity.class);
        startActivity(intent);
        finish();
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        binding = null;
    }
}
