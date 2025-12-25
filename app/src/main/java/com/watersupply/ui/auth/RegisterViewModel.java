package com.watersupply.ui.auth;

import androidx.lifecycle.ViewModel;

import com.watersupply.data.models.User;
import com.watersupply.data.repository.AuthRepository;

import javax.inject.Inject;

import dagger.hilt.android.lifecycle.HiltViewModel;

/**
 * ViewModel for registration
 */
@HiltViewModel
public class RegisterViewModel extends ViewModel {
    private final AuthRepository authRepository;
    
    @Inject
    public RegisterViewModel(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }
    
    public void register(User user, String pin) {
        authRepository.registerUser(user, pin);
    }
}
