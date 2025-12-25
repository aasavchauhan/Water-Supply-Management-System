package com.watersupply;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.watersupply.ui.auth.LoginActivity;
import com.watersupply.ui.dashboard.DashboardActivity;

import dagger.hilt.android.AndroidEntryPoint;

/**
 * Main entry point - redirects to Login or Dashboard based on session
 */
@AndroidEntryPoint
public class MainActivity extends AppCompatActivity {
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Check if user is logged in
        SharedPreferences prefs = getSharedPreferences("user_session", MODE_PRIVATE);
        String userId = prefs.getString("user_id", null);
        
        Intent intent;
        if (userId != null) {
            // User is logged in, navigate to dashboard
            intent = new Intent(this, DashboardActivity.class);
        } else {
            // Navigate to login
            intent = new Intent(this, LoginActivity.class);
        }
        
        startActivity(intent);
        finish();
    }
}
