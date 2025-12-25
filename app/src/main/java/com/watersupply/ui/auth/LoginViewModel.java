package com.watersupply.ui.auth;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.watersupply.data.repository.AuthRepository;

import javax.inject.Inject;

import dagger.hilt.android.lifecycle.HiltViewModel;

/**
 * ViewModel for login functionality
 */
@HiltViewModel
public class LoginViewModel extends ViewModel {
    private final AuthRepository authRepository;
    private final MutableLiveData<Boolean> loginSuccess = new MutableLiveData<>();
    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();
    
    @Inject
    public LoginViewModel(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }
    
    public LiveData<Boolean> getLoginSuccess() {
        return loginSuccess;
    }
    
    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }
    
    public void login(String email, String password) {
        authRepository.loginWithEmail(email, password, new AuthRepository.OnAuthListener() {
            @Override
            public void onAuthSuccess(String userId) {
                loginSuccess.postValue(true);
            }
            
            @Override
            public void onAuthFailure(String error) {
                loginSuccess.postValue(false);
                errorMessage.postValue(error);
            }
        });
    }
}
