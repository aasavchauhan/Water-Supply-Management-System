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
    private boolean isOtpSent = false;
    private String verificationId;
    private com.google.firebase.auth.PhoneAuthProvider.ForceResendingToken resendToken;
    
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
                .requestIdToken(getString(R.string.default_web_client_id))
                .requestEmail()
                .build();
        googleSignInClient = GoogleSignIn.getClient(this, gso);
    }
    
    private void setupToggle() {
        binding.toggleRegisterMethod.addOnButtonCheckedListener((group, checkedId, isChecked) -> {
            if (isChecked) {
                if (checkedId == R.id.btnMethodEmail) {
                    isEmailRegister = true;
                    isOtpSent = false;
                    binding.tilMobile.setVisibility(View.GONE);
                    binding.tilEmail.setVisibility(View.VISIBLE);
                    binding.tilPin.setVisibility(View.VISIBLE);
                    binding.tilConfirmPin.setVisibility(View.VISIBLE);
                    binding.tilPin.setHint("Password");
                    binding.tilConfirmPin.setHint("Confirm Password");
                    binding.etPin.setText("");
                    binding.etConfirmPin.setText("");
                    binding.etPin.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
                    binding.etConfirmPin.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
                    binding.etPin.setFilters(new android.text.InputFilter[]{});
                    binding.etConfirmPin.setFilters(new android.text.InputFilter[]{});
                    binding.btnRegister.setText("Register");
                } else {
                    isEmailRegister = false;
                    isOtpSent = false;
                    binding.tilMobile.setVisibility(View.VISIBLE);
                    binding.tilEmail.setVisibility(View.GONE);
                    // Hide PIN fields initially for Mobile
                    binding.tilPin.setVisibility(View.GONE);
                    binding.tilConfirmPin.setVisibility(View.GONE);
                    
                    binding.etPin.setText("");
                    binding.tilPin.setHint(getString(R.string.enter_otp));
                    binding.etPin.setInputType(InputType.TYPE_CLASS_NUMBER);
                    binding.etPin.setFilters(new android.text.InputFilter[]{new android.text.InputFilter.LengthFilter(6)});
                    
                    binding.btnRegister.setText(getString(R.string.send_otp));
                }
            }
        });
    }
    
    private void setupClickListeners() {
        binding.btnRegister.setOnClickListener(v -> {
            String name = binding.etName.getText().toString().trim();
            
            if (isEmailRegister) {
                String email = binding.etEmail.getText().toString().trim();
                String password = binding.etPin.getText().toString().trim();
                String confirmPin = binding.etConfirmPin.getText().toString().trim();
                
                if (validateEmailInput(name, email, password, confirmPin)) {
                    registerWithEmail(name, email, password);
                }
            } else {
                handleMobileRegister(name);
            }
        });
        
        binding.btnGoogle.setOnClickListener(v -> signInWithGoogle());
        
        binding.tvLogin.setOnClickListener(v -> finish());
    }
    
    private void handleMobileRegister(String name) {
        String mobile = binding.etMobile.getText().toString().trim();
        
        if (name.isEmpty()) {
            binding.tilName.setError("Name is required");
            return;
        }
        if (mobile.isEmpty() || mobile.length() != 10) {
            binding.tilMobile.setError("Valid 10-digit mobile number required");
            return;
        }
        binding.tilName.setError(null);
        binding.tilMobile.setError(null);
        
        if (!isOtpSent) {
            sendOtp(mobile);
        } else {
            String otp = binding.etPin.getText().toString().trim();
            if (otp.isEmpty() || otp.length() < 6) {
                binding.tilPin.setError(getString(R.string.invalid_otp));
                return;
            }
            if (verificationId == null) {
                Toast.makeText(this, "Error: Verification ID missing. Resend OTP.", Toast.LENGTH_SHORT).show();
                return;
            }
            verifyOtp(verificationId, otp, name);
        }
    }
    
    private void sendOtp(String mobile) {
        showLoading(true);
        binding.btnRegister.setText("Sending...");
        
        authRepository.sendOtp(this, mobile, new com.google.firebase.auth.PhoneAuthProvider.OnVerificationStateChangedCallbacks() {
            @Override
            public void onVerificationCompleted(@androidx.annotation.NonNull com.google.firebase.auth.PhoneAuthCredential credential) {
                String code = credential.getSmsCode();
                if (code != null) {
                    binding.etPin.setText(code);
                    String name = binding.etName.getText().toString().trim();
                    verifyOtp(verificationId, code, name);
                }
            }

            @Override
            public void onVerificationFailed(@androidx.annotation.NonNull com.google.firebase.FirebaseException e) {
                showLoading(false);
                binding.btnRegister.setText(getString(R.string.send_otp));
                Toast.makeText(RegisterActivity.this, "Verification Failed: " + e.getMessage(), Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onCodeSent(@androidx.annotation.NonNull String s, @androidx.annotation.NonNull com.google.firebase.auth.PhoneAuthProvider.ForceResendingToken token) {
                showLoading(false);
                verificationId = s;
                resendToken = token;
                
                isOtpSent = true;
                binding.tilPin.setVisibility(View.VISIBLE); // Show OTP input
                binding.etPin.requestFocus();
                binding.btnRegister.setText(getString(R.string.verify_otp));
                Toast.makeText(RegisterActivity.this, getString(R.string.otp_sent), Toast.LENGTH_SHORT).show();
            }
        });
    }
    
    private void verifyOtp(String vId, String code, String name) {
        showLoading(true);
        binding.btnRegister.setText(getString(R.string.verifying));
        
        authRepository.verifyOtp(vId, code, new AuthRepository.OnAuthListener() {
            @Override
            public void onAuthSuccess(String userId) {
                // User verified and created/signed in. Now update Name.
                authRepository.updateUserName(userId, name, new AuthRepository.OnAuthListener() {
                    @Override
                    public void onAuthSuccess(String userId) {
                         showLoading(false);
                         Toast.makeText(RegisterActivity.this, "Registration successful!", Toast.LENGTH_SHORT).show();
                         Intent intent = new Intent(RegisterActivity.this, com.watersupply.ui.dashboard.DashboardActivity.class);
                         intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                         startActivity(intent);
                         finish();
                    }
                    
                    @Override
                    public void onAuthFailure(String error) {
                        showLoading(false);
                        Toast.makeText(RegisterActivity.this, "Failed to update profile: " + error, Toast.LENGTH_SHORT).show();
                    }
                });
            }

            @Override
            public void onAuthFailure(String error) {
                showLoading(false);
                binding.btnRegister.setText(getString(R.string.verify_otp));
                Toast.makeText(RegisterActivity.this, "Verification failed: " + error, Toast.LENGTH_SHORT).show();
            }
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
