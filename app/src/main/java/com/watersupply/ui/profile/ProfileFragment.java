package com.watersupply.ui.profile;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.watersupply.R;
import com.watersupply.databinding.FragmentProfileBinding;
import com.watersupply.ui.auth.LoginActivity;
import com.watersupply.ui.settings.SettingsActivity;
import com.watersupply.data.repository.AuthRepository;
import javax.inject.Inject;

import dagger.hilt.android.AndroidEntryPoint;

import static android.content.Context.MODE_PRIVATE;

/**
 * Profile fragment showing user info and settings
 */
@AndroidEntryPoint
public class ProfileFragment extends Fragment {
    
    @Inject
    AuthRepository authRepository;
    
    private FragmentProfileBinding binding;
    
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentProfileBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }
    
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        loadUserInfo();
        setupClickListeners();
        
        // Set App Version
        try {
            String versionName = com.watersupply.BuildConfig.VERSION_NAME;
            binding.tvAppVersion.setText("Version " + versionName);
        } catch (Exception e) {
            binding.tvAppVersion.setText("Version 1.0");
        }
    }
    
    private void loadUserInfo() {
        SharedPreferences prefs = requireActivity().getSharedPreferences("user_session", MODE_PRIVATE);
        String userId = prefs.getString("user_id", null);
        
        // Load from cache first
        String cachedName = prefs.getString("user_name", "User");
        String cachedMobile = prefs.getString("user_mobile", "");
        
        binding.tvUserName.setText(cachedName);
        binding.tvUserMobile.setText(cachedMobile.isEmpty() ? "No Mobile Number" : cachedMobile);
        binding.tvUserRole.setText("Administrator");

        if (userId != null) {
            authRepository.getUser(userId).observe(getViewLifecycleOwner(), user -> {
                if (binding != null && user != null) {
                    String name = user.getName() != null ? user.getName() : "User";
                    String mobile = user.getMobile() != null ? user.getMobile() : "";
                    
                    binding.tvUserName.setText(name);
                    binding.tvUserMobile.setText(mobile.isEmpty() ? "No Mobile Number" : mobile);
                    binding.tvUserRole.setText("Administrator"); // Or user.getRole()
                    
                    // Also update SharedPreferences to keep it in sync
                    SharedPreferences.Editor editor = prefs.edit();
                    editor.putString("user_name", name);
                    editor.putString("user_mobile", mobile);
                    editor.apply();
                }
            });
        }
    }
    
    private void setupClickListeners() {
        binding.cardSettings.setOnClickListener(v -> {
            Intent intent = new Intent(requireContext(), SettingsActivity.class);
            startActivity(intent);
        });
        
        binding.cardTheme.setOnClickListener(v -> showThemeDialog());
        
        binding.cardLanguage.setOnClickListener(v -> {
            // TODO: Implement language selector
            android.widget.Toast.makeText(requireContext(), "Language settings coming soon", android.widget.Toast.LENGTH_SHORT).show();
        });
        
        binding.btnLogout.setOnClickListener(v -> logout());
        
        // Add edit profile capability
        binding.tvUserName.setOnClickListener(v -> showEditProfileDialog());
    }
    
    private void showEditProfileDialog() {
        android.app.AlertDialog.Builder builder = new android.app.AlertDialog.Builder(requireContext());
        builder.setTitle("Edit Profile");
        
        android.widget.LinearLayout layout = new android.widget.LinearLayout(requireContext());
        layout.setOrientation(android.widget.LinearLayout.VERTICAL);
        layout.setPadding(50, 40, 50, 10);
        
        final android.widget.EditText inputName = new android.widget.EditText(requireContext());
        inputName.setHint("Full Name");
        inputName.setText(binding.tvUserName.getText());
        layout.addView(inputName);
        
        final android.widget.EditText inputMobile = new android.widget.EditText(requireContext());
        inputMobile.setHint("Mobile Number");
        inputMobile.setInputType(android.text.InputType.TYPE_CLASS_PHONE);
        String currentMobile = binding.tvUserMobile.getText().toString();
        if (!currentMobile.equals("No Mobile Number")) {
            inputMobile.setText(currentMobile);
        }
        layout.addView(inputMobile);
        
        builder.setView(layout);
        
        builder.setPositiveButton("Save", (dialog, which) -> {
            String newName = inputName.getText().toString().trim();
            String newMobile = inputMobile.getText().toString().trim();
            
            if (newName.isEmpty()) {
                android.widget.Toast.makeText(requireContext(), "Name cannot be empty", android.widget.Toast.LENGTH_SHORT).show();
                return;
            }
            
            updateProfile(newName, newMobile);
        });
        
        builder.setNegativeButton("Cancel", (dialog, which) -> dialog.cancel());
        builder.show();
    }
    
    private void updateProfile(String name, String mobile) {
        String userId = authRepository.getCurrentUserId();
        if (userId == null) return;
        
        java.util.Map<String, Object> updates = new java.util.HashMap<>();
        updates.put("name", name);
        updates.put("mobile", mobile);
        updates.put("updatedAt", System.currentTimeMillis());
        
        // Update Firestore direct (we could use Repository but direct is fine for simple update)
        // Ideally we should add updateProfile to AuthRepository
        com.google.firebase.firestore.FirebaseFirestore.getInstance()
            .collection("users").document(userId)
            .update(updates)
            .addOnSuccessListener(aVoid -> {
                android.widget.Toast.makeText(requireContext(), "Profile updated", android.widget.Toast.LENGTH_SHORT).show();
                
                // Manually update UI to reflect changes immediately
                if (binding != null) {
                    binding.tvUserName.setText(name);
                    binding.tvUserMobile.setText(mobile);
                }
                
                // Update SharedPreferences
                SharedPreferences prefs = requireActivity().getSharedPreferences("user_session", MODE_PRIVATE);
                prefs.edit()
                    .putString("user_name", name)
                    .putString("user_mobile", mobile)
                    .apply();
            })
            .addOnFailureListener(e -> {
                android.widget.Toast.makeText(requireContext(), "Failed to update: " + e.getMessage(), android.widget.Toast.LENGTH_SHORT).show();
            });
    }
    
    private void showThemeDialog() {
        com.watersupply.utils.ThemePreference themePreference = new com.watersupply.utils.ThemePreference(requireContext());
        String currentTheme = themePreference.getThemeMode();
        int checkedItem = 2; // Default to System
        
        if (com.watersupply.utils.ThemePreference.MODE_LIGHT.equals(currentTheme)) {
            checkedItem = 0;
        } else if (com.watersupply.utils.ThemePreference.MODE_DARK.equals(currentTheme)) {
            checkedItem = 1;
        }
        
        String[] themes = {"Light", "Dark", "System Default"};
        
        new androidx.appcompat.app.AlertDialog.Builder(requireContext())
            .setTitle("Choose Theme")
            .setSingleChoiceItems(themes, checkedItem, (dialog, which) -> {
                String newTheme;
                if (which == 0) newTheme = com.watersupply.utils.ThemePreference.MODE_LIGHT;
                else if (which == 1) newTheme = com.watersupply.utils.ThemePreference.MODE_DARK;
                else newTheme = com.watersupply.utils.ThemePreference.MODE_SYSTEM;
                
                themePreference.saveThemeMode(newTheme);
                androidx.appcompat.app.AppCompatDelegate.setDefaultNightMode(
                    com.watersupply.utils.ThemePreference.getNightModeFromString(newTheme));
                
                dialog.dismiss();
            })
            .setNegativeButton("Cancel", null)
            .show();
    }
    
    private void logout() {
        authRepository.logout();
        
        Intent intent = new Intent(requireContext(), LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        requireActivity().finish();
    }
    
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
