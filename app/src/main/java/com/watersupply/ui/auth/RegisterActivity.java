package com.watersupply.ui.auth;

import android.content.Intent;
import android.os.Bundle;
import android.text.InputType;
import android.view.View;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;
import com.watersupply.R;
import com.watersupply.databinding.ActivityRegisterBinding;
import com.watersupply.data.repository.AuthRepository;

import javax.inject.Inject;

import dagger.hilt.android.AndroidEntryPoint;

/**
 * Registration screen for new users with Firebase
 */
@AndroidEntryPoint
public class RegisterActivity extends AppCompatActivity {
    
    private ActivityRegisterBinding binding;
    private GoogleSignInClient googleSignInClient;
    private boolean isEmailRegister = false;
    
    @Inject
    AuthRepository authRepository;
    
    private final ActivityResultLauncher<Intent> googleSignInLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK) {
                    Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(result.getData());
                    handleGoogleSignInResult(task);
                }
            }
    );
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityRegisterBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        setupGoogleSignIn();
        setupClickListeners();
        setupToggle();
    }
    
    private void setupGoogleSignIn() {
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(getString(R.string.google_server_client_id))
                .requestEmail()
                .build();
        googleSignInClient = GoogleSignIn.getClient(this, gso);
    }
    
    private void setupToggle() {
        binding.toggleRegisterMethod.addOnButtonCheckedListener((group, checkedId, isChecked) -> {
            if (isChecked) {
                if (checkedId == R.id.btnMethodEmail) {
                    isEmailRegister = true;
                    binding.tilMobile.setVisibility(View.GONE);
                    binding.tilEmail.setVisibility(View.VISIBLE);
                    binding.tilPin.setHint("Password");
                    binding.tilConfirmPin.setHint("Confirm Password");
                    binding.etPin.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
                    binding.etConfirmPin.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
                    binding.etPin.setFilters(new android.text.InputFilter[]{});
                    binding.etConfirmPin.setFilters(new android.text.InputFilter[]{});
                } else {
                    isEmailRegister = false;
                    binding.tilMobile.setVisibility(View.VISIBLE);
                    binding.tilEmail.setVisibility(View.GONE);
                    binding.tilPin.setHint("4-Digit PIN");
                    binding.tilConfirmPin.setHint("Confirm PIN");
                    binding.etPin.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_VARIATION_PASSWORD);
                    binding.etConfirmPin.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_VARIATION_PASSWORD);
                    binding.etPin.setFilters(new android.text.InputFilter[]{new android.text.InputFilter.LengthFilter(4)});
                    binding.etConfirmPin.setFilters(new android.text.InputFilter[]{new android.text.InputFilter.LengthFilter(4)});
                }
            }
        });
    }
    
    private void setupClickListeners() {
        binding.btnRegister.setOnClickListener(v -> {
            String name = binding.etName.getText().toString().trim();
            String pin = binding.etPin.getText().toString().trim();
            String confirmPin = binding.etConfirmPin.getText().toString().trim();
            
            if (isEmailRegister) {
                String email = binding.etEmail.getText().toString().trim();
                if (validateEmailInput(name, email, pin, confirmPin)) {
                    registerWithEmail(name, email, pin);
                }
            } else {
                String mobile = binding.etMobile.getText().toString().trim();
                if (validateMobileInput(name, mobile, pin, confirmPin)) {
                    registerWithMobile(name, mobile, pin);
                }
            }
        });
        
        binding.btnGoogle.setOnClickListener(v -> signInWithGoogle());
        
        binding.tvLogin.setOnClickListener(v -> finish());
    }
    
    private void signInWithGoogle() {
        Intent signInIntent = googleSignInClient.getSignInIntent();
        googleSignInLauncher.launch(signInIntent);
    }
    
    private void handleGoogleSignInResult(Task<GoogleSignInAccount> completedTask) {
        try {
            GoogleSignInAccount account = completedTask.getResult(ApiException.class);
            firebaseAuthWithGoogle(account.getIdToken());
        } catch (ApiException e) {
            Toast.makeText(this, "Google Sign-Up failed: " + e.getStatusCode(), Toast.LENGTH_SHORT).show();
        }
    }
    
    private void firebaseAuthWithGoogle(String idToken) {
        showLoading(true);
        authRepository.loginWithGoogle(idToken, new AuthRepository.OnAuthListener() {
            @Override
            public void onAuthSuccess(String userId) {
                showLoading(false);
                Toast.makeText(RegisterActivity.this, "Registration successful", Toast.LENGTH_SHORT).show();
                // Navigate to Dashboard or finish
                Intent intent = new Intent(RegisterActivity.this, com.watersupply.ui.dashboard.DashboardActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                startActivity(intent);
                finish();
            }
            
            @Override
            public void onAuthFailure(String error) {
                showLoading(false);
                Toast.makeText(RegisterActivity.this, "Registration failed: " + error, Toast.LENGTH_SHORT).show();
            }
        });
    }
    
    private boolean validateMobileInput(String name, String mobile, String pin, String confirmPin) {
        if (name.isEmpty()) {
            binding.tilName.setError("Name is required");
            return false;
        }
        if (mobile.isEmpty() || mobile.length() != 10) {
            binding.tilMobile.setError("Valid 10-digit mobile number required");
            return false;
        }
        if (pin.isEmpty() || pin.length() != 4) {
            binding.tilPin.setError("4-digit PIN required");
            return false;
        }
        if (!pin.equals(confirmPin)) {
            binding.tilConfirmPin.setError("PINs do not match");
            return false;
        }
        binding.tilName.setError(null);
        binding.tilMobile.setError(null);
        binding.tilPin.setError(null);
        binding.tilConfirmPin.setError(null);
        return true;
    }
    
    private boolean validateEmailInput(String name, String email, String password, String confirmPassword) {
        if (name.isEmpty()) {
            binding.tilName.setError("Name is required");
            return false;
        }
        if (email.isEmpty()) {
            binding.tilEmail.setError("Email is required");
            return false;
        }
        if (password.isEmpty()) {
            binding.tilPin.setError("Password is required");
            return false;
        }
        if (!password.equals(confirmPassword)) {
            binding.tilConfirmPin.setError("Passwords do not match");
            return false;
        }
        binding.tilName.setError(null);
        binding.tilEmail.setError(null);
        binding.tilPin.setError(null);
        binding.tilConfirmPin.setError(null);
        return true;
    }
    
    private void registerWithMobile(String name, String mobile, String pin) {
        showLoading(true);
        // Pseudo-mobile registration
        String email = mobile + "@watersupply.app";
        String password = pin + mobile;
        
        authRepository.registerWithEmail(email, password, name, mobile, 
            new AuthRepository.OnAuthListener() {
                @Override
                public void onAuthSuccess(String userId) {
                    showLoading(false);
                    Toast.makeText(RegisterActivity.this, 
                        "Registration successful! Please login", Toast.LENGTH_SHORT).show();
                    finish();
                }
                
                @Override
                public void onAuthFailure(String error) {
                    showLoading(false);
                    Toast.makeText(RegisterActivity.this, 
                        "Registration failed: " + error, Toast.LENGTH_SHORT).show();
                }
            });
    }
    
    private void registerWithEmail(String name, String email, String password) {
        showLoading(true);
        // Pass null for mobile if registering with email
        authRepository.registerWithEmail(email, password, name, null, 
            new AuthRepository.OnAuthListener() {
                @Override
                public void onAuthSuccess(String userId) {
                    showLoading(false);
                    Toast.makeText(RegisterActivity.this, 
                        "Registration successful! Please login", Toast.LENGTH_SHORT).show();
                    finish();
                }
                
                @Override
                public void onAuthFailure(String error) {
                    showLoading(false);
                    Toast.makeText(RegisterActivity.this, 
                        "Registration failed: " + error, Toast.LENGTH_SHORT).show();
                }
            });
    }
    
    private void showLoading(boolean show) {
        binding.btnRegister.setEnabled(!show);
        binding.btnGoogle.setEnabled(!show);
        binding.progressBar.setVisibility(show ? View.VISIBLE : View.GONE);
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        binding = null;
    }
}
