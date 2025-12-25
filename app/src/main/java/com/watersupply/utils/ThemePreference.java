package com.watersupply.utils;

import android.content.Context;
import android.content.SharedPreferences;
import androidx.appcompat.app.AppCompatDelegate;

public class ThemePreference {
    private static final String PREF_NAME = "theme_preferences";
    private static final String KEY_THEME_MODE = "theme_mode";
    
    // Theme mode constants
    public static final String MODE_LIGHT = "light";
    public static final String MODE_DARK = "dark";
    public static final String MODE_SYSTEM = "system";
    
    private final SharedPreferences preferences;
    
    public ThemePreference(Context context) {
        preferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }
    
    /**
     * Save theme mode preference
     * @param mode One of MODE_LIGHT, MODE_DARK, or MODE_SYSTEM
     */
    public void saveThemeMode(String mode) {
        preferences.edit().putString(KEY_THEME_MODE, mode).apply();
    }
    
    /**
     * Get current theme mode
     * @return One of MODE_LIGHT, MODE_DARK, or MODE_SYSTEM (defaults to MODE_SYSTEM)
     */
    public String getThemeMode() {
        return preferences.getString(KEY_THEME_MODE, MODE_SYSTEM);
    }
    
    /**
     * Apply the saved theme to the application
     * This should be called in Application.onCreate() or Activity.onCreate()
     */
    public void applyTheme() {
        String mode = getThemeMode();
        int nightMode;
        
        switch (mode) {
            case MODE_LIGHT:
                nightMode = AppCompatDelegate.MODE_NIGHT_NO;
                break;
            case MODE_DARK:
                nightMode = AppCompatDelegate.MODE_NIGHT_YES;
                break;
            case MODE_SYSTEM:
            default:
                nightMode = AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM;
                break;
        }
        
        AppCompatDelegate.setDefaultNightMode(nightMode);
    }
    
    /**
     * Get AppCompatDelegate night mode constant from theme mode string
     * @param mode One of MODE_LIGHT, MODE_DARK, or MODE_SYSTEM
     * @return AppCompatDelegate night mode constant
     */
    public static int getNightModeFromString(String mode) {
        switch (mode) {
            case MODE_LIGHT:
                return AppCompatDelegate.MODE_NIGHT_NO;
            case MODE_DARK:
                return AppCompatDelegate.MODE_NIGHT_YES;
            case MODE_SYSTEM:
            default:
                return AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM;
        }
    }
}
