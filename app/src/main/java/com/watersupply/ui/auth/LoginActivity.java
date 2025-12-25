package com.watersupply.ui.auth;

import android.content.Intent;
import android.content.SharedPreferences;
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
import com.watersupply.databinding.ActivityLoginBinding;
import com.watersupply.data.repository.AuthRepository;
import com.watersupply.ui.dashboard.DashboardActivity;

import javax.inject.Inject;

import dagger.hilt.android.AndroidEntryPoint;

/**
 * Login screen with Firebase Authentication (Mobile, Email, Google)
 */
@AndroidEntryPoint
public class LoginActivity extends AppCompatActivity {
    
    private ActivityLoginBinding binding;
    private GoogleSignInClient googleSignInClient;
    private boolean isEmailLogin = false;
    
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
        binding = ActivityLoginBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        // Check if user is already logged in
        if (authRepository.isUserLoggedIn()) {
            navigateToDashboard();
            return;
        }
        
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
        binding.toggleLoginMethod.addOnButtonCheckedListener((group, checkedId, isChecked) -> {
            if (isChecked) {
                if (checkedId == R.id.btnMethodEmail) {
                    isEmailLogin = true;
                    binding.tilMobile.setVisibility(View.GONE);
                    binding.tilEmail.setVisibility(View.VISIBLE);
                    binding.tilPin.setHint("Password");
                    binding.etPin.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
                    binding.etPin.setFilters(new android.text.InputFilter[]{}); // Remove length filter
                } else {
                    isEmailLogin = false;
                    binding.tilMobile.setVisibility(View.VISIBLE);
                    binding.tilEmail.setVisibility(View.GONE);
                    binding.tilPin.setHint(getString(R.string.pin_code));
                    binding.etPin.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_VARIATION_PASSWORD);
                    binding.etPin.setFilters(new android.text.InputFilter[]{new android.text.InputFilter.LengthFilter(4)});
                }
            }
        });
    }
    
    private void setupClickListeners() {
        binding.btnLogin.setOnClickListener(v -> {
            if (isEmailLogin) {
                String email = binding.etEmail.getText().toString().trim();
                String password = binding.etPin.getText().toString().trim();
                if (validateEmailInput(email, password)) {
                    loginWithEmail(email, password);
                }
            } else {
                String mobile = binding.etMobile.getText().toString().trim();
                String pin = binding.etPin.getText().toString().trim();
                if (validateMobileInput(mobile, pin)) {
                    loginWithMobile(mobile, pin);
                }
            }
        });
        
        binding.btnGoogle.setOnClickListener(v -> signInWithGoogle());
        
        binding.tvRegister.setOnClickListener(v -> {
            Intent intent = new Intent(this, RegisterActivity.class);
            startActivity(intent);
        });
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
            Toast.makeText(this, "Google Sign-In failed: " + e.getStatusCode(), Toast.LENGTH_SHORT).show();
        }
    }
    
    private void firebaseAuthWithGoogle(String idToken) {
        showLoading(true);
        authRepository.loginWithGoogle(idToken, new AuthRepository.OnAuthListener() {
            @Override
            public void onAuthSuccess(String userId) {
                showLoading(false);
                Toast.makeText(LoginActivity.this, "Login successful", Toast.LENGTH_SHORT).show();
                navigateToDashboard();
            }
            
            @Override
            public void onAuthFailure(String error) {
                showLoading(false);
                Toast.makeText(LoginActivity.this, "Authentication failed: " + error, Toast.LENGTH_SHORT).show();
            }
        });
    }
    
    private boolean validateMobileInput(String mobile, String pin) {
        if (mobile.isEmpty()) {
            binding.tilMobile.setError("Mobile number is required");
            return false;
        }
        if (mobile.length() != 10) {
            binding.tilMobile.setError("Mobile number must be 10 digits");
            return false;
        }
        if (pin.isEmpty()) {
            binding.tilPin.setError("PIN is required");
            return false;
        }
        if (pin.length() != 4) {
            binding.tilPin.setError("PIN must be 4 digits");
            return false;
        }
        binding.tilMobile.setError(null);
        binding.tilPin.setError(null);
        return true;
    }
    
    private boolean validateEmailInput(String email, String password) {
        if (email.isEmpty()) {
            binding.tilEmail.setError("Email is required");
            return false;
        }
        if (password.isEmpty()) {
            binding.tilPin.setError("Password is required");
            return false;
        }
        binding.tilEmail.setError(null);
        binding.tilPin.setError(null);
        return true;
    }
    
    private void loginWithMobile(String mobile, String pin) {
        showLoading(true);
        // Pseudo-mobile login
        String email = mobile + "@watersupply.app";
        String password = pin + mobile;
        
        authRepository.loginWithEmail(email, password, new AuthRepository.OnAuthListener() {
            @Override
            public void onAuthSuccess(String userId) {
                showLoading(false);
                saveUserSession(userId, mobile);
                Toast.makeText(LoginActivity.this, "Login successful", Toast.LENGTH_SHORT).show();
                navigateToDashboard();
            }
            
            @Override
            public void onAuthFailure(String error) {
                showLoading(false);
                Toast.makeText(LoginActivity.this, "Login failed: " + error, Toast.LENGTH_SHORT).show();
            }
        });
    }
    
    private void loginWithEmail(String email, String password) {
        showLoading(true);
        authRepository.loginWithEmail(email, password, new AuthRepository.OnAuthListener() {
            @Override
            public void onAuthSuccess(String userId) {
                showLoading(false);
                saveUserSession(userId, null);
                Toast.makeText(LoginActivity.this, "Login successful", Toast.LENGTH_SHORT).show();
                navigateToDashboard();
            }
            
            @Override
            public void onAuthFailure(String error) {
                showLoading(false);
                Toast.makeText(LoginActivity.this, "Login failed: " + error, Toast.LENGTH_SHORT).show();
            }
        });
    }
    
    private void saveUserSession(String userId, String mobile) {
        SharedPreferences prefs = getSharedPreferences("user_session", MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit()
                .putString("user_id", userId)
                .putBoolean("is_logged_in", true);
        
        if (mobile != null) {
            editor.putString("user_mobile", mobile);
        }
        
        editor.apply();
    }
    
    private void navigateToDashboard() {
        Intent intent = new Intent(this, DashboardActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
    
    private void showLoading(boolean show) {
        binding.btnLogin.setEnabled(!show);
        binding.btnGoogle.setEnabled(!show);
        binding.progressBar.setVisibility(show ? View.VISIBLE : View.GONE);
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        binding = null;
    }
}
