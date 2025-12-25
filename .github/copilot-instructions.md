# 📱 Water Supply Management - Mobile App Development Guide

## 🎯 Project Vision

**Native Android App** for water supply management with offline-first architecture, optimized for field workers and rural connectivity.

## 🏗️ Architecture Overview

**Native Android Application with MVVM Architecture**

### Core Stack
- **Language**: Java 11+ (Android SDK)
- **Architecture**: MVVM (Model-View-ViewModel)
- **Navigation**: Android Navigation Component (FragmentContainerView)
- **Database**: Room Persistence Library (SQLite wrapper)
- **UI Components**: Material Design 3 (com.google.android.material)
- **Async**: LiveData + ViewModel + Coroutines (optional)
- **Dependency Injection**: Hilt (Dagger 2)
- **Image Loading**: Glide
- **Charts**: MPAndroidChart
- **Auth**: BiometricPrompt API + SharedPreferences

### Platform Details
- **Target**: Android 8.0+ (API 26+)
- **Build**: Android Studio Hedgehog+ with Gradle 8.2+
- **Testing**: JUnit 4 + Espresso + Mockito
- **Code Quality**: Android Lint + CheckStyle

### Storage Strategy (Phase 1: Local-First)
```
User Actions → Room Database (Immediate Write via Repository)
              ↓
          LiveData (Observable)
              ↓
          ViewModel (Business Logic)
              ↓
          Activity/Fragment (UI Updates)

Future Phase 2: Cloud Sync
Room DB ↔ WorkManager (Background Sync) ↔ Retrofit API (Cloud)
```

## 📂 Native Android Project Structure

```
WaterSupplyApp/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/watersupply/
│   │   │   │   ├── MainActivity.java              # Main entry point
│   │   │   │   ├── WaterSupplyApplication.java    # Application class (Hilt)
│   │   │   │   ├── ui/
│   │   │   │   │   ├── auth/
│   │   │   │   │   │   ├── LoginActivity.java     # Biometric + PIN login
│   │   │   │   │   │   ├── LoginViewModel.java
│   │   │   │   │   │   └── RegisterActivity.java
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   │   ├── DashboardFragment.java # Home with cards
│   │   │   │   │   │   ├── DashboardViewModel.java
│   │   │   │   │   │   └── adapters/
│   │   │   │   │   │       └── StatCardAdapter.java
│   │   │   │   │   ├── farmers/
│   │   │   │   │   │   ├── FarmerListFragment.java      # RecyclerView list
│   │   │   │   │   │   ├── FarmerListViewModel.java
│   │   │   │   │   │   ├── FarmerDetailFragment.java
│   │   │   │   │   │   ├── AddFarmerActivity.java       # Form with camera
│   │   │   │   │   │   └── adapters/
│   │   │   │   │   │       └── FarmerAdapter.java       # RecyclerView adapter
│   │   │   │   │   ├── supply/
│   │   │   │   │   │   ├── SupplyListFragment.java      # Supply history
│   │   │   │   │   │   ├── SupplyListViewModel.java
│   │   │   │   │   │   ├── NewSupplyActivity.java       # Dual billing form
│   │   │   │   │   │   ├── NewSupplyViewModel.java
│   │   │   │   │   │   └── dialogs/
│   │   │   │   │   │       └── MeterInputDialog.java    # Bottom sheet
│   │   │   │   │   ├── payments/
│   │   │   │   │   │   ├── PaymentListFragment.java
│   │   │   │   │   │   ├── PaymentListViewModel.java
│   │   │   │   │   │   ├── NewPaymentActivity.java
│   │   │   │   │   │   └── ReceiptActivity.java         # Printable receipt
│   │   │   │   │   ├── reports/
│   │   │   │   │   │   ├── ReportsFragment.java
│   │   │   │   │   │   ├── ReportsViewModel.java
│   │   │   │   │   │   └── charts/
│   │   │   │   │   │       └── ChartView.java           # MPAndroidChart
│   │   │   │   │   └── common/
│   │   │   │   │       ├── BaseActivity.java
│   │   │   │   │       ├── BaseFragment.java
│   │   │   │   │       └── LoadingDialog.java
│   │   │   │   ├── data/
│   │   │   │   │   ├── database/
│   │   │   │   │   │   ├── AppDatabase.java             # Room database
│   │   │   │   │   │   ├── DatabaseMigrations.java
│   │   │   │   │   │   ├── dao/
│   │   │   │   │   │   │   ├── FarmerDao.java           # Farmer CRUD
│   │   │   │   │   │   │   ├── SupplyEntryDao.java
│   │   │   │   │   │   │   ├── PaymentDao.java
│   │   │   │   │   │   │   └── UserDao.java
│   │   │   │   │   │   └── entities/
│   │   │   │   │   │       ├── Farmer.java              # @Entity
│   │   │   │   │   │       ├── SupplyEntry.java
│   │   │   │   │   │       ├── Payment.java
│   │   │   │   │   │       ├── User.java
│   │   │   │   │   │       └── Settings.java
│   │   │   │   │   ├── repository/
│   │   │   │   │   │   ├── FarmerRepository.java        # Data layer
│   │   │   │   │   │   ├── SupplyRepository.java
│   │   │   │   │   │   ├── PaymentRepository.java
│   │   │   │   │   │   └── AuthRepository.java
│   │   │   │   │   └── models/
│   │   │   │   │       └── enums/
│   │   │   │   │           └── BillingMethod.java
│   │   │   │   ├── services/
│   │   │   │   │   ├── BiometricAuthService.java        # BiometricPrompt
│   │   │   │   │   ├── CameraService.java               # CameraX
│   │   │   │   │   ├── PrinterService.java              # Bluetooth printing
│   │   │   │   │   ├── BackupService.java               # Export/import
│   │   │   │   │   └── SyncService.java (future)        # WorkManager sync
│   │   │   │   ├── utils/
│   │   │   │   │   ├── BillingCalculator.java           # Billing logic
│   │   │   │   │   ├── DateFormatter.java
│   │   │   │   │   ├── CurrencyFormatter.java
│   │   │   │   │   ├── PermissionHelper.java
│   │   │   │   │   └── Constants.java
│   │   │   │   └── di/
│   │   │   │       ├── AppModule.java                   # Hilt modules
│   │   │   │       ├── DatabaseModule.java
│   │   │   │       └── RepositoryModule.java
│   │   │   ├── res/
│   │   │   │   ├── layout/
│   │   │   │   │   ├── activity_main.xml
│   │   │   │   │   ├── activity_login.xml
│   │   │   │   │   ├── fragment_dashboard.xml
│   │   │   │   │   ├── fragment_farmer_list.xml
│   │   │   │   │   ├── activity_add_farmer.xml
│   │   │   │   │   ├── activity_new_supply.xml
│   │   │   │   │   ├── item_farmer.xml                  # RecyclerView item
│   │   │   │   │   ├── item_supply.xml
│   │   │   │   │   ├── item_stat_card.xml
│   │   │   │   │   └── dialog_meter_input.xml
│   │   │   │   ├── values/
│   │   │   │   │   ├── colors.xml                       # Material Design 3
│   │   │   │   │   ├── strings.xml
│   │   │   │   │   ├── styles.xml
│   │   │   │   │   ├── themes.xml                       # MD3 theme
│   │   │   │   │   └── dimens.xml                       # 4dp spacing
│   │   │   │   ├── drawable/
│   │   │   │   │   ├── bg_card.xml
│   │   │   │   │   ├── bg_button_primary.xml
│   │   │   │   │   └── ic_*.xml                         # Vector icons
│   │   │   │   ├── navigation/
│   │   │   │   │   └── nav_graph.xml                    # Navigation graph
│   │   │   │   └── menu/
│   │   │   │       └── bottom_nav_menu.xml
│   │   │   └── AndroidManifest.xml
│   │   ├── test/                                        # Unit tests
│   │   │   └── java/com/watersupply/
│   │   └── androidTest/                                 # Instrumented tests
│   │       └── java/com/watersupply/
│   ├── build.gradle                                     # App-level gradle
│   └── proguard-rules.pro
├── gradle/
│   └── wrapper/
├── build.gradle                                         # Project-level gradle
├── settings.gradle
└── gradle.properties
```


## 🗄️ Room Database Schema

### Entities (Local Storage Phase 1)

```java
// User.java - Local authentication
@Entity(tableName = "users")
public class User {
    @PrimaryKey
    @NonNull
    public String id;
    
    @NonNull
    public String name;
    
    @ColumnInfo(name = "mobile")
    @NonNull
    public String mobile;
    
    @ColumnInfo(name = "pin_hash")
    @NonNull
    public String pinHash;
    
    @ColumnInfo(name = "biometric_enabled")
    public boolean biometricEnabled = false;
    
    @ColumnInfo(name = "created_at")
    public long createdAt;
    
    @ColumnInfo(name = "updated_at")
    public long updatedAt;
}

// Farmer.java
@Entity(tableName = "farmers",
        indices = {
            @Index(value = "user_id"),
            @Index(value = "mobile")
        },
        foreignKeys = @ForeignKey(
            entity = User.class,
            parentColumns = "id",
            childColumns = "user_id",
            onDelete = ForeignKey.CASCADE
        )
)
public class Farmer {
    @PrimaryKey
    @NonNull
    public String id;
    
    @ColumnInfo(name = "user_id")
    @NonNull
    public String userId;
    
    @NonNull
    public String name;
    
    @NonNull
    public String mobile;
    
    @ColumnInfo(name = "farm_location")
    public String farmLocation;
    
    @ColumnInfo(name = "default_rate")
    public double defaultRate;
    
    public double balance = 0.0;
    
    @ColumnInfo(name = "photo_uri")
    public String photoUri;
    
    @ColumnInfo(name = "is_active")
    public boolean isActive = true;
    
    @ColumnInfo(name = "created_at")
    public long createdAt;
    
    @ColumnInfo(name = "updated_at")
    public long updatedAt;
}

// SupplyEntry.java
@Entity(tableName = "supply_entries",
        indices = {
            @Index(value = "farmer_id"),
            @Index(value = "date")
        },
        foreignKeys = {
            @ForeignKey(entity = User.class, parentColumns = "id", childColumns = "user_id"),
            @ForeignKey(entity = Farmer.class, parentColumns = "id", childColumns = "farmer_id")
        }
)
public class SupplyEntry {
    @PrimaryKey
    @NonNull
    public String id;
    
    @ColumnInfo(name = "user_id")
    @NonNull
    public String userId;
    
    @ColumnInfo(name = "farmer_id")
    @NonNull
    public String farmerId;
    
    @NonNull
    public String date;
    
    @ColumnInfo(name = "billing_method")
    @NonNull
    public String billingMethod; // "time" or "meter"
    
    @ColumnInfo(name = "start_time")
    public String startTime;
    
    @ColumnInfo(name = "stop_time")
    public String stopTime;
    
    @ColumnInfo(name = "pause_duration")
    public double pauseDuration = 0.0;
    
    @ColumnInfo(name = "meter_reading_start")
    public Double meterReadingStart;
    
    @ColumnInfo(name = "meter_reading_end")
    public Double meterReadingEnd;
    
    @ColumnInfo(name = "total_time_used")
    public Double totalTimeUsed;
    
    @ColumnInfo(name = "total_water_used")
    public Double totalWaterUsed;
    
    public double rate;
    
    public double amount;
    
    public String remarks;
    
    @ColumnInfo(name = "created_at")
    public long createdAt;
    
    @ColumnInfo(name = "updated_at")
    public long updatedAt;
    
    public boolean synced = false;
}

// Payment.java
@Entity(tableName = "payments",
        indices = {
            @Index(value = "farmer_id"),
            @Index(value = "payment_date")
        }
)
public class Payment {
    @PrimaryKey
    @NonNull
    public String id;
    
    @ColumnInfo(name = "user_id")
    @NonNull
    public String userId;
    
    @ColumnInfo(name = "farmer_id")
    @NonNull
    public String farmerId;
    
    @ColumnInfo(name = "payment_date")
    @NonNull
    public String paymentDate;
    
    public double amount;
    
    @ColumnInfo(name = "payment_method")
    public String paymentMethod;
    
    @ColumnInfo(name = "transaction_id")
    public String transactionId;
    
    public String remarks;
    
    @ColumnInfo(name = "created_at")
    public long createdAt;
    
    @ColumnInfo(name = "updated_at")
    public long updatedAt;
    
    public boolean synced = false;
}

// AppSettings.java
@Entity(tableName = "settings")
public class AppSettings {
    @PrimaryKey
    @NonNull
    public String id;
    
    @ColumnInfo(name = "user_id")
    @NonNull
    public String userId;
    
    @ColumnInfo(name = "business_name")
    @NonNull
    public String businessName;
    
    @ColumnInfo(name = "business_address")
    public String businessAddress;
    
    @ColumnInfo(name = "business_phone")
    public String businessPhone;
    
    @ColumnInfo(name = "default_hourly_rate")
    public double defaultHourlyRate = 100.0;
    
    public String currency = "INR";
    
    @ColumnInfo(name = "currency_symbol")
    public String currencySymbol = "₹";
    
    public String language = "en";
    
    public String theme = "light";
    
    @ColumnInfo(name = "created_at")
    public long createdAt;
    
    @ColumnInfo(name = "updated_at")
    public long updatedAt;
}

// AppDatabase.java
@Database(
    entities = {
        User.class,
        Farmer.class,
        SupplyEntry.class,
        Payment.class,
        AppSettings.class
    },
    version = 1,
    exportSchema = false
)
public abstract class AppDatabase extends RoomDatabase {
    public abstract UserDao userDao();
    public abstract FarmerDao farmerDao();
    public abstract SupplyEntryDao supplyEntryDao();
    public abstract PaymentDao paymentDao();
    public abstract SettingsDao settingsDao();
    
    private static volatile AppDatabase INSTANCE;
    
    public static AppDatabase getDatabase(final Context context) {
        if (INSTANCE == null) {
            synchronized (AppDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(
                        context.getApplicationContext(),
                        AppDatabase.class,
                        "water_supply_database"
                    )
                    .fallbackToDestructiveMigration()
                    .build();
                }
            }
        }
        return INSTANCE;
    }
}
```


## 🎨 Material Design System

### Material Design 3 Theme (XML)

```xml
<!-- res/values/colors.xml -->
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Primary (Teal - Water Theme) -->
    <color name="md_theme_light_primary">#006A6A</color>
    <color name="md_theme_light_onPrimary">#FFFFFF</color>
    <color name="md_theme_light_primaryContainer">#6FF7F7</color>
    <color name="md_theme_light_onPrimaryContainer">#002020</color>
    
    <!-- Secondary -->
    <color name="md_theme_light_secondary">#4A6363</color>
    <color name="md_theme_light_onSecondary">#FFFFFF</color>
    <color name="md_theme_light_secondaryContainer">#CCE8E8</color>
    <color name="md_theme_light_onSecondaryContainer">#051F1F</color>
    
    <!-- Tertiary -->
    <color name="md_theme_light_tertiary">#4B607C</color>
    <color name="md_theme_light_onTertiary">#FFFFFF</color>
    <color name="md_theme_light_tertiaryContainer">#D3E4FF</color>
    <color name="md_theme_light_onTertiaryContainer">#041C35</color>
    
    <!-- Error -->
    <color name="md_theme_light_error">#BA1A1A</color>
    <color name="md_theme_light_onError">#FFFFFF</color>
    <color name="md_theme_light_errorContainer">#FFDAD6</color>
    <color name="md_theme_light_onErrorContainer">#410002</color>
    
    <!-- Background & Surface -->
    <color name="md_theme_light_background">#FAFDFD</color>
    <color name="md_theme_light_onBackground">#191C1C</color>
    <color name="md_theme_light_surface">#FAFDFD</color>
    <color name="md_theme_light_onSurface">#191C1C</color>
    <color name="md_theme_light_surfaceVariant">#DAE5E4</color>
    <color name="md_theme_light_onSurfaceVariant">#3F4948</color>
    
    <!-- Outline -->
    <color name="md_theme_light_outline">#6F7979</color>
    <color name="md_theme_light_outlineVariant">#BEC9C8</color>
    
    <!-- Dark theme -->
    <color name="md_theme_dark_primary">#4DDADA</color>
    <color name="md_theme_dark_onPrimary">#003737</color>
    <color name="md_theme_dark_primaryContainer">#004F4F</color>
    <color name="md_theme_dark_onPrimaryContainer">#6FF7F7</color>
</resources>

<!-- res/values/themes.xml -->
<resources>
    <style name="Theme.WaterSupply" parent="Theme.Material3.Light.NoActionBar">
        <item name="colorPrimary">@color/md_theme_light_primary</item>
        <item name="colorOnPrimary">@color/md_theme_light_onPrimary</item>
        <item name="colorPrimaryContainer">@color/md_theme_light_primaryContainer</item>
        <item name="colorOnPrimaryContainer">@color/md_theme_light_onPrimaryContainer</item>
        <item name="colorSecondary">@color/md_theme_light_secondary</item>
        <item name="colorOnSecondary">@color/md_theme_light_onSecondary</item>
        <item name="colorError">@color/md_theme_light_error</item>
        <item name="colorOnError">@color/md_theme_light_onError</item>
        <item name="android:colorBackground">@color/md_theme_light_background</item>
        <item name="colorOnBackground">@color/md_theme_light_onBackground</item>
        <item name="colorSurface">@color/md_theme_light_surface</item>
        <item name="colorOnSurface">@color/md_theme_light_onSurface</item>
    </style>
</resources>
```

### Spacing System (4dp grid)

```xml
<!-- res/values/dimens.xml -->
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Spacing (4dp grid) -->
    <dimen name="spacing_xxs">4dp</dimen>     <!-- Minimal gap -->
    <dimen name="spacing_xs">8dp</dimen>      <!-- Icon padding -->
    <dimen name="spacing_sm">12dp</dimen>     <!-- Small margins -->
    <dimen name="spacing_md">16dp</dimen>     <!-- Standard margin -->
    <dimen name="spacing_lg">24dp</dimen>     <!-- Section spacing -->
    <dimen name="spacing_xl">32dp</dimen>     <!-- Screen padding -->
    <dimen name="spacing_xxl">48dp</dimen>    <!-- Large gaps -->
    
    <!-- Common dimensions -->
    <dimen name="card_elevation">2dp</dimen>
    <dimen name="card_corner_radius">12dp</dimen>
    <dimen name="button_corner_radius">8dp</dimen>
    <dimen name="icon_size">24dp</dimen>
    <dimen name="avatar_size">48dp</dimen>
</resources>
```

### Typography Scale

```xml
<!-- res/values/styles.xml -->
<resources>
    <style name="TextAppearance.WaterSupply.DisplayLarge" parent="TextAppearance.Material3.DisplayLarge">
        <item name="fontFamily">sans-serif</item>
        <item name="android:textSize">57sp</item>
        <item name="android:lineHeight">64sp</item>
    </style>
    
    <style name="TextAppearance.WaterSupply.HeadlineLarge" parent="TextAppearance.Material3.HeadlineLarge">
        <item name="fontFamily">sans-serif</item>
        <item name="android:textSize">32sp</item>
        <item name="android:lineHeight">40sp</item>
    </style>
    
    <style name="TextAppearance.WaterSupply.TitleLarge" parent="TextAppearance.Material3.TitleLarge">
        <item name="fontFamily">sans-serif-medium</item>
        <item name="android:textSize">22sp</item>
        <item name="android:lineHeight">28sp</item>
    </style>
    
    <style name="TextAppearance.WaterSupply.BodyLarge" parent="TextAppearance.Material3.BodyLarge">
        <item name="fontFamily">sans-serif</item>
        <item name="android:textSize">16sp</item>
        <item name="android:lineHeight">24sp</item>
    </style>
    
    <style name="TextAppearance.WaterSupply.LabelLarge" parent="TextAppearance.Material3.LabelLarge">
        <item name="fontFamily">sans-serif-medium</item>
        <item name="android:textSize">14sp</item>
        <item name="android:lineHeight">20sp</item>
    </style>
</resources>
```

### Component Patterns

```xml
<!-- Screen layout with consistent padding (fragment_dashboard.xml) -->
<androidx.coordinatorlayout.widget.CoordinatorLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    
    <com.google.android.material.appbar.AppBarLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content">
        
        <com.google.android.material.appbar.MaterialToolbar
            android:id="@+id/toolbar"
            android:layout_width="match_parent"
            android:layout_height="?attr/actionBarSize"
            app:title="Dashboard" />
    </com.google.android.material.appbar.AppBarLayout>
    
    <androidx.core.widget.NestedScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_behavior="@string/appbar_scrolling_view_behavior">
        
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="@dimen/spacing_md">
            <!-- Content here -->
        </LinearLayout>
    </androidx.core.widget.NestedScrollView>
</androidx.coordinatorlayout.widget.CoordinatorLayout>

<!-- Card component for list items (item_farmer.xml) -->
<com.google.android.material.card.MaterialCardView
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_margin="@dimen/spacing_sm"
    app:cardElevation="@dimen/card_elevation"
    app:cardCornerRadius="@dimen/card_corner_radius">
    
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:padding="@dimen/spacing_md"
        android:gravity="center_vertical">
        
        <com.google.android.material.imageview.ShapeableImageView
            android:id="@+id/farmerAvatar"
            android:layout_width="@dimen/avatar_size"
            android:layout_height="@dimen/avatar_size"
            app:shapeAppearanceOverlay="@style/ShapeAppearance.Material3.Corner.Full" />
        
        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:orientation="vertical"
            android:layout_marginStart="@dimen/spacing_md">
            
            <TextView
                android:id="@+id/farmerName"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:textAppearance="@style/TextAppearance.WaterSupply.TitleLarge" />
            
            <TextView
                android:id="@+id/farmerMobile"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:textAppearance="@style/TextAppearance.WaterSupply.BodyLarge" />
        </LinearLayout>
    </LinearLayout>
</com.google.android.material.card.MaterialCardView>

<!-- Bottom sheet for forms (dialog_meter_input.xml) -->
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:padding="@dimen/spacing_lg">
    
    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="New Supply Entry"
        android:textAppearance="@style/TextAppearance.WaterSupply.HeadlineLarge" />
    
    <com.google.android.material.textfield.TextInputLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="@dimen/spacing_md"
        android:hint="Meter Start">
        
        <com.google.android.material.textfield.TextInputEditText
            android:id="@+id/meterStart"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:inputType="numberDecimal" />
    </com.google.android.material.textfield.TextInputLayout>
    
    <com.google.android.material.button.MaterialButton
        android:id="@+id/btnSave"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="@dimen/spacing_md"
        android:text="Save" />
</LinearLayout>
```


## 📱 Critical Mobile Workflows

### App Initialization
```java
// WaterSupplyApplication.java
@HiltAndroidApp
public class WaterSupplyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        // Database is initialized automatically via Hilt
    }
}

// MainActivity.java
@AndroidEntryPoint
public class MainActivity extends AppCompatActivity {
    private ActivityMainBinding binding;
    private BiometricAuthService biometricService;
    
    @Inject
    UserRepository userRepository;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        biometricService = new BiometricAuthService(this);
        
        // Check if user is logged in
        checkUserSession();
    }
    
    private void checkUserSession() {
        SharedPreferences prefs = getSharedPreferences("user_session", MODE_PRIVATE);
        String userId = prefs.getString("user_id", null);
        
        if (userId != null) {
            // User is logged in, navigate to dashboard
            NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment);
            navController.navigate(R.id.dashboardFragment);
        } else {
            // Navigate to login
            NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment);
            navController.navigate(R.id.loginActivity);
        }
    }
}
```

### Farmer Management (Offline-First with Room)
```java
// FarmerRepository.java
@Singleton
public class FarmerRepository {
    private final FarmerDao farmerDao;
    private final LiveData<List<Farmer>> allFarmers;
    
    @Inject
    public FarmerRepository(AppDatabase database) {
        this.farmerDao = database.farmerDao();
        this.allFarmers = farmerDao.getAllFarmers();
    }
    
    public LiveData<List<Farmer>> getAllFarmers() {
        return allFarmers;
    }
    
    public void addFarmer(Farmer farmer) {
        new Thread(() -> {
            farmer.id = String.valueOf(System.currentTimeMillis());
            farmer.createdAt = System.currentTimeMillis();
            farmer.updatedAt = System.currentTimeMillis();
            farmerDao.insert(farmer);
        }).start();
    }
    
    public void updateFarmerBalance(String farmerId, double amount) {
        new Thread(() -> {
            Farmer farmer = farmerDao.getFarmerById(farmerId);
            if (farmer != null) {
                farmer.balance -= amount;
                farmer.updatedAt = System.currentTimeMillis();
                farmerDao.update(farmer);
            }
        }).start();
    }
}

// FarmerListViewModel.java
@HiltViewModel
public class FarmerListViewModel extends ViewModel {
    private final FarmerRepository farmerRepository;
    private final LiveData<List<Farmer>> farmers;
    
    @Inject
    public FarmerListViewModel(FarmerRepository farmerRepository) {
        this.farmerRepository = farmerRepository;
        this.farmers = farmerRepository.getAllFarmers();
    }
    
    public LiveData<List<Farmer>> getFarmers() {
        return farmers;
    }
    
    public void addFarmer(Farmer farmer) {
        farmerRepository.addFarmer(farmer);
    }
}

// FarmerListFragment.java
@AndroidEntryPoint
public class FarmerListFragment extends Fragment {
    private FragmentFarmerListBinding binding;
    private FarmerListViewModel viewModel;
    private FarmerAdapter adapter;
    
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentFarmerListBinding.inflate(inflater, container, false);
        viewModel = new ViewModelProvider(this).get(FarmerListViewModel.class);
        
        setupRecyclerView();
        observeFarmers();
        
        return binding.getRoot();
    }
    
    private void setupRecyclerView() {
        adapter = new FarmerAdapter(farmer -> {
            // Navigate to farmer detail
            Bundle args = new Bundle();
            args.putString("farmerId", farmer.id);
            NavController navController = Navigation.findNavController(requireView());
            navController.navigate(R.id.farmerDetailFragment, args);
        });
        
        binding.farmerRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        binding.farmerRecyclerView.setAdapter(adapter);
    }
    
    private void observeFarmers() {
        viewModel.getFarmers().observe(getViewLifecycleOwner(), farmers -> {
            adapter.submitList(farmers);
        });
    }
}
```

### Supply Entry Form (Dual Billing)
```java
// NewSupplyActivity.java
@AndroidEntryPoint
public class NewSupplyActivity extends AppCompatActivity {
    private ActivityNewSupplyBinding binding;
    private NewSupplyViewModel viewModel;
    private String farmerId;
    private String billingMethod = "meter";
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityNewSupplyBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        viewModel = new ViewModelProvider(this).get(NewSupplyViewModel.class);
        farmerId = getIntent().getStringExtra("farmerId");
        
        setupBillingMethodToggle();
        setupFormListeners();
        setupSaveButton();
    }
    
    private void setupBillingMethodToggle() {
        binding.billingMethodGroup.addOnButtonCheckedListener((group, checkedId, isChecked) -> {
            if (checkedId == R.id.btnMeter) {
                billingMethod = "meter";
                binding.meterInputsLayout.setVisibility(View.VISIBLE);
                binding.timeInputsLayout.setVisibility(View.GONE);
            } else {
                billingMethod = "time";
                binding.meterInputsLayout.setVisibility(View.GONE);
                binding.timeInputsLayout.setVisibility(View.VISIBLE);
            }
        });
    }
    
    private void setupFormListeners() {
        // Real-time calculation on text change
        TextWatcher calculationWatcher = new TextWatcher() {
            @Override
            public void afterTextChanged(Editable s) {
                calculateAmount();
            }
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}
        };
        
        binding.etMeterStart.addTextChangedListener(calculationWatcher);
        binding.etMeterEnd.addTextChangedListener(calculationWatcher);
        binding.etRate.addTextChangedListener(calculationWatcher);
    }
    
    private void calculateAmount() {
        try {
            if (billingMethod.equals("meter")) {
                double start = BillingCalculator.convertMeterToHours(
                    Double.parseDouble(binding.etMeterStart.getText().toString())
                );
                double end = BillingCalculator.convertMeterToHours(
                    Double.parseDouble(binding.etMeterEnd.getText().toString())
                );
                double hours = end - start;
                double rate = Double.parseDouble(binding.etRate.getText().toString());
                double amount = hours * rate;
                
                binding.tvCalculatedHours.setText(String.format("%.2f hours", hours));
                binding.tvCalculatedAmount.setText(String.format("₹%.2f", amount));
            }
        } catch (NumberFormatException e) {
            // Invalid input, ignore
        }
    }
    
    private void setupSaveButton() {
        binding.btnSave.setOnClickListener(v -> {
            SupplyEntry entry = new SupplyEntry();
            entry.id = String.valueOf(System.currentTimeMillis());
            entry.farmerId = farmerId;
            entry.date = DateFormatter.getCurrentDate();
            entry.billingMethod = billingMethod;
            entry.createdAt = System.currentTimeMillis();
            entry.updatedAt = System.currentTimeMillis();
            
            if (billingMethod.equals("meter")) {
                entry.meterReadingStart = Double.parseDouble(binding.etMeterStart.getText().toString());
                entry.meterReadingEnd = Double.parseDouble(binding.etMeterEnd.getText().toString());
                entry.rate = Double.parseDouble(binding.etRate.getText().toString());
                double hours = BillingCalculator.convertMeterToHours(entry.meterReadingEnd) - 
                              BillingCalculator.convertMeterToHours(entry.meterReadingStart);
                entry.totalTimeUsed = hours;
                entry.amount = hours * entry.rate;
            }
            
            viewModel.saveSupplyEntry(entry);
            
            Toast.makeText(this, "Supply entry saved", Toast.LENGTH_SHORT).show();
            finish();
        });
    }
}
```

### Camera Integration (Farmer Photos)
```java
// CameraService.java
public class CameraService {
    private final Context context;
    private Uri photoUri;
    
    public CameraService(Context context) {
        this.context = context;
    }
    
    public Intent createCameraIntent() {
        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        
        // Create file to save photo
        File photoFile = createImageFile();
        if (photoFile != null) {
            photoUri = FileProvider.getUriForFile(context,
                "com.watersupply.fileprovider",
                photoFile);
            takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoUri);
        }
        
        return takePictureIntent;
    }
    
    private File createImageFile() {
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(new Date());
        String imageFileName = "FARMER_" + timeStamp + ".jpg";
        File storageDir = context.getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        
        try {
            return File.createTempFile(imageFileName, ".jpg", storageDir);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
    
    public Uri getPhotoUri() {
        return photoUri;
    }
}

// Usage in AddFarmerActivity
private static final int REQUEST_IMAGE_CAPTURE = 1;
private CameraService cameraService;
private Uri farmerPhotoUri;

binding.btnTakePhoto.setOnClickListener(v -> {
    cameraService = new CameraService(this);
    Intent cameraIntent = cameraService.createCameraIntent();
    startActivityForResult(cameraIntent, REQUEST_IMAGE_CAPTURE);
});

@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == REQUEST_IMAGE_CAPTURE && resultCode == RESULT_OK) {
        farmerPhotoUri = cameraService.getPhotoUri();
        Glide.with(this)
            .load(farmerPhotoUri)
            .circleCrop()
            .into(binding.farmerPhotoPreview);
    }
}
```

### Biometric Authentication
```java
// BiometricAuthService.java
public class BiometricAuthService {
    private final FragmentActivity activity;
    private BiometricPrompt biometricPrompt;
    
    public BiometricAuthService(FragmentActivity activity) {
        this.activity = activity;
        setupBiometricPrompt();
    }
    
    private void setupBiometricPrompt() {
        Executor executor = ContextCompat.getMainExecutor(activity);
        
        biometricPrompt = new BiometricPrompt(activity, executor,
            new BiometricPrompt.AuthenticationCallback() {
                @Override
                public void onAuthenticationSucceeded(
                    BiometricPrompt.AuthenticationResult result) {
                    super.onAuthenticationSucceeded(result);
                    onAuthSuccess();
                }
                
                @Override
                public void onAuthenticationError(int errorCode, CharSequence errString) {
                    super.onAuthenticationError(errorCode, errString);
                    onAuthFailed(errString.toString());
                }
            });
    }
    
    public void authenticate(Runnable onSuccess, Consumer<String> onError) {
        BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
            .setTitle("Verify your identity")
            .setSubtitle("Use biometric to login")
            .setNegativeButtonText("Use PIN")
            .build();
        
        biometricPrompt.authenticate(promptInfo);
    }
    
    public static boolean isBiometricAvailable(Context context) {
        BiometricManager biometricManager = BiometricManager.from(context);
        return biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG) 
            == BiometricManager.BIOMETRIC_SUCCESS;
    }
}
```

### Receipt Printing (Bluetooth)
```java
// PrinterService.java
public class PrinterService {
    private BluetoothAdapter bluetoothAdapter;
    private BluetoothSocket bluetoothSocket;
    private OutputStream outputStream;
    
    public PrinterService() {
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    }
    
    public void printReceipt(Farmer farmer, SupplyEntry entry, AppSettings settings) {
        try {
            // Connect to paired printer (you need to pair first)
            BluetoothDevice printer = findPairedPrinter();
            if (printer != null) {
                connectToPrinter(printer);
                
                // Build receipt content
                StringBuilder receipt = new StringBuilder();
                receipt.append("\n");
                receipt.append(centerText(settings.businessName)).append("\n");
                receipt.append("================================\n");
                receipt.append(String.format("Farmer: %s\n", farmer.name));
                receipt.append(String.format("Mobile: %s\n", farmer.mobile));
                receipt.append(String.format("Date: %s\n", DateFormatter.format(entry.date)));
                receipt.append("--------------------------------\n");
                receipt.append(String.format("Time Used: %.2fh\n", entry.totalTimeUsed));
                receipt.append(String.format("Rate: %s%.2f/hr\n", settings.currencySymbol, entry.rate));
                receipt.append(String.format("Amount: %s%.2f\n", settings.currencySymbol, entry.amount));
                receipt.append("--------------------------------\n");
                receipt.append(String.format("Balance: %s%.2f\n", settings.currencySymbol, farmer.balance));
                receipt.append("\n\n\n");
                
                // Send to printer
                outputStream.write(receipt.toString().getBytes());
                outputStream.flush();
                
                disconnect();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    private BluetoothDevice findPairedPrinter() {
        Set<BluetoothDevice> pairedDevices = bluetoothAdapter.getBondedDevices();
        for (BluetoothDevice device : pairedDevices) {
            if (device.getName().contains("Printer")) {
                return device;
            }
        }
        return null;
    }
    
    private void connectToPrinter(BluetoothDevice printer) throws IOException {
        UUID uuid = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
        bluetoothSocket = printer.createRfcommSocketToServiceRecord(uuid);
        bluetoothSocket.connect();
        outputStream = bluetoothSocket.getOutputStream();
    }
    
    private void disconnect() throws IOException {
        if (outputStream != null) outputStream.close();
        if (bluetoothSocket != null) bluetoothSocket.close();
    }
    
    private String centerText(String text) {
        int width = 32;
        int padding = (width - text.length()) / 2;
        return " ".repeat(Math.max(0, padding)) + text;
    }
}
```


## 🎯 Project-Specific Conventions

### Component Organization
- **Activities**: Full-screen views in `ui/` (LoginActivity, MainActivity, AddFarmerActivity)
- **Fragments**: Screen content in `ui/*/` folders (DashboardFragment, FarmerListFragment)
- **Adapters**: RecyclerView adapters in `ui/*/adapters/` (FarmerAdapter, SupplyAdapter)
- **ViewModels**: Business logic in `ui/*/` (FarmerListViewModel, NewSupplyViewModel)
- **Layouts**: XML layouts in `res/layout/` (activity_*, fragment_*, item_*)

### Navigation Pattern
Android Navigation Component with Safe Args:
```java
// Navigate with arguments
Bundle args = new Bundle();
args.putString("farmerId", "123");
NavController navController = Navigation.findNavController(requireView());
navController.navigate(R.id.farmerDetailFragment, args);

// Receive arguments
String farmerId = getArguments().getString("farmerId");
```

### State Management
Use Room LiveData with ViewModels (MVVM pattern):
```java
// ViewModel exposes LiveData
public class FarmerListViewModel extends ViewModel {
    private final LiveData<List<Farmer>> farmers;
    
    public FarmerListViewModel(FarmerRepository repository) {
        this.farmers = repository.getAllFarmers();
    }
    
    public LiveData<List<Farmer>> getFarmers() {
        return farmers;
    }
}

// Fragment observes LiveData
viewModel.getFarmers().observe(getViewLifecycleOwner(), farmers -> {
    adapter.submitList(farmers);
});
```

### ID Generation
All entities use timestamp-based IDs for offline-first:
```java
String id = String.valueOf(System.currentTimeMillis());
// or with prefix:
String id = "farmer_" + System.currentTimeMillis();
```

### Balance Calculation
Farmer balance updates are embedded in transaction operations:
```java
// After supply entry
double newBalance = currentBalance - entryAmount;
farmer.balance = newBalance;
farmerDao.update(farmer);

// After payment
double newBalance = currentBalance + paymentAmount;
farmer.balance = newBalance;
farmerDao.update(farmer);
```

### Date Handling
```java
// Storage: ISO string or timestamp
String date = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault()).format(new Date());
long createdAt = System.currentTimeMillis();

// Display: Localized format
import com.watersupply.utils.DateFormatter;
String formatted = DateFormatter.format(date, "dd MMM yyyy");
```

### Currency Formatting
```java
// utils/CurrencyFormatter.java
public class CurrencyFormatter {
    public static String format(double amount, String symbol) {
        return String.format("%s%.2f", symbol, amount);
    }
    
    public static String format(double amount) {
        return format(amount, "₹");
    }
}
```


## 🚀 Development Setup

### Prerequisites
- **Android Studio Hedgehog+** (2023.1.1 or later)
- **Java JDK 11+** (OpenJDK recommended)
- **Android SDK 26+** (Android 8.0 Oreo)
- **VS Code** with GitHub Copilot extension (optional, for AI assistance)
- **Git** for version control

### Initial Setup (Blank Project Already Created)
Since you've already created a blank Java Android project in Android Studio:

#### 1. Add Dependencies to `app/build.gradle`
```gradle
dependencies {
    // Material Design 3
    implementation 'com.google.android.material:material:1.11.0'
    
    // Room Database
    def room_version = "2.6.1"
    implementation "androidx.room:room-runtime:$room_version"
    annotationProcessor "androidx.room:room-compiler:$room_version"
    
    // Lifecycle (ViewModel + LiveData)
    def lifecycle_version = "2.7.0"
    implementation "androidx.lifecycle:lifecycle-viewmodel:$lifecycle_version"
    implementation "androidx.lifecycle:lifecycle-livedata:$lifecycle_version"
    
    // Navigation Component
    def nav_version = "2.7.6"
    implementation "androidx.navigation:navigation-fragment:$nav_version"
    implementation "androidx.navigation:navigation-ui:$nav_version"
    
    // Hilt (Dependency Injection)
    def hilt_version = "2.50"
    implementation "com.google.dagger:hilt-android:$hilt_version"
    annotationProcessor "com.google.dagger:hilt-compiler:$hilt_version"
    
    // Glide (Image Loading)
    implementation 'com.github.bumptech.glide:glide:4.16.0'
    annotationProcessor 'com.github.bumptech.glide:compiler:4.16.0'
    
    // MPAndroidChart (Charts)
    implementation 'com.github.PhilJay:MPAndroidChart:v3.1.0'
    
    // Biometric Authentication
    implementation "androidx.biometric:biometric:1.2.0-alpha05"
    
    // Testing
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
}
```

#### 2. Update `build.gradle` (Project-level)
```gradle
buildscript {
    dependencies {
        classpath 'com.google.dagger:hilt-android-gradle-plugin:2.50'
    }
}
```

#### 3. Enable View Binding in `app/build.gradle`
```gradle
android {
    ...
    buildFeatures {
        viewBinding true
    }
}
```

#### 4. Update `AndroidManifest.xml` Permissions
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />
    <uses-permission android:name="android.permission.BLUETOOTH" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
    
    <application
        android:name=".WaterSupplyApplication"
        android:theme="@style/Theme.WaterSupply"
        ...>
        
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="com.watersupply.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>
        
    </application>
</manifest>
```

#### 5. Create FileProvider Path (`res/xml/file_paths.xml`)
```xml
<?xml version="1.0" encoding="utf-8"?>
<paths>
    <external-files-path name="pictures" path="Pictures/" />
</paths>
```

### Running the App
```bash
# In Android Studio:
# 1. Click "Sync Project with Gradle Files" button
# 2. Connect Android device via USB (enable USB debugging) or start emulator
# 3. Click "Run" (green play button) or Shift+F10

# Via Command Line:
cd YourProjectFolder
./gradlew assembleDebug  # Build APK
./gradlew installDebug   # Install on connected device
```

### Database Initialization
```java
// WaterSupplyApplication.java
@HiltAndroidApp
public class WaterSupplyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        // Database is automatically initialized via Room when first accessed
    }
}

// First access in MainActivity or LoginActivity triggers DB creation
AppDatabase db = AppDatabase.getDatabase(getApplicationContext());
```


## 📱 UI Patterns & Best Practices

### Activity/Fragment Layout
Every screen should follow this structure:
```java
// DashboardFragment.java
@AndroidEntryPoint
public class DashboardFragment extends Fragment {
    private FragmentDashboardBinding binding;
    private DashboardViewModel viewModel;
    
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentDashboardBinding.inflate(inflater, container, false);
        viewModel = new ViewModelProvider(this).get(DashboardViewModel.class);
        
        setupToolbar();
        observeData();
        
        return binding.getRoot();
    }
    
    private void setupToolbar() {
        binding.toolbar.setTitle("Dashboard");
        binding.toolbar.setNavigationOnClickListener(v -> requireActivity().onBackPressed());
    }
    
    private void observeData() {
        viewModel.getStats().observe(getViewLifecycleOwner(), stats -> {
            // Update UI with stats
        });
    }
    
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
```

### List Rendering (Optimized)
Use RecyclerView with DiffUtil for large datasets:
```java
// FarmerAdapter.java
public class FarmerAdapter extends ListAdapter<Farmer, FarmerAdapter.ViewHolder> {
    private final OnFarmerClickListener listener;
    
    public FarmerAdapter(OnFarmerClickListener listener) {
        super(DIFF_CALLBACK);
        this.listener = listener;
    }
    
    private static final DiffUtil.ItemCallback<Farmer> DIFF_CALLBACK = 
        new DiffUtil.ItemCallback<Farmer>() {
            @Override
            public boolean areItemsTheSame(@NonNull Farmer oldItem, @NonNull Farmer newItem) {
                return oldItem.id.equals(newItem.id);
            }
            
            @Override
            public boolean areContentsTheSame(@NonNull Farmer oldItem, @NonNull Farmer newItem) {
                return oldItem.name.equals(newItem.name) && 
                       oldItem.balance == newItem.balance;
            }
        };
    
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemFarmerBinding binding = ItemFarmerBinding.inflate(
            LayoutInflater.from(parent.getContext()), parent, false);
        return new ViewHolder(binding);
    }
    
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        holder.bind(getItem(position));
    }
    
    class ViewHolder extends RecyclerView.ViewHolder {
        private final ItemFarmerBinding binding;
        
        ViewHolder(ItemFarmerBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }
        
        void bind(Farmer farmer) {
            binding.farmerName.setText(farmer.name);
            binding.farmerMobile.setText(farmer.mobile);
            binding.getRoot().setOnClickListener(v -> listener.onFarmerClick(farmer));
            
            Glide.with(binding.farmerAvatar)
                .load(farmer.photoUri)
                .circleCrop()
                .placeholder(R.drawable.ic_person)
                .into(binding.farmerAvatar);
        }
    }
    
    public interface OnFarmerClickListener {
        void onFarmerClick(Farmer farmer);
    }
}
```

### Form Handling
Use TextInputLayout for Material Design forms:
```java
// AddFarmerActivity.java
private void setupForm() {
    binding.etName.addTextChangedListener(new TextWatcher() {
        @Override
        public void afterTextChanged(Editable s) {
            validateName(s.toString());
        }
        @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
        @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}
    });
    
    binding.btnSave.setOnClickListener(v -> handleSave());
}

private boolean validateName(String name) {
    if (name.length() < 2) {
        binding.tilName.setError("Name must be at least 2 characters");
        return false;
    }
    binding.tilName.setError(null);
    return true;
}

private void handleSave() {
    String name = binding.etName.getText().toString();
    String mobile = binding.etMobile.getText().toString();
    
    if (!validateName(name) || !validateMobile(mobile)) {
        return;
    }
    
    Farmer farmer = new Farmer();
    farmer.name = name;
    farmer.mobile = mobile;
    
    viewModel.addFarmer(farmer);
    finish();
}
```

### Bottom Sheet Dialogs
For forms and quick actions:
```java
// In Fragment or Activity
private void showMeterInputDialog() {
    BottomSheetDialog dialog = new BottomSheetDialog(requireContext());
    DialogMeterInputBinding dialogBinding = DialogMeterInputBinding.inflate(getLayoutInflater());
    dialog.setContentView(dialogBinding.getRoot());
    
    dialogBinding.btnSave.setOnClickListener(v -> {
        String start = dialogBinding.meterStart.getText().toString();
        String end = dialogBinding.meterEnd.getText().toString();
        
        // Process input
        saveMeterReading(start, end);
        dialog.dismiss();
    });
    
    dialog.show();
}
```

### Loading States
Show shimmer placeholders while loading:
```xml
<!-- Use Shimmer library or custom skeleton -->
<com.facebook.shimmer.ShimmerFrameLayout
    android:id="@+id/shimmerLayout"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">
    
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical">
        <!-- Skeleton views -->
    </LinearLayout>
</com.facebook.shimmer.ShimmerFrameLayout>
```

```java
// In Fragment/Activity
private void showLoading(boolean show) {
    if (show) {
        binding.shimmerLayout.setVisibility(View.VISIBLE);
        binding.shimmerLayout.startShimmer();
        binding.recyclerView.setVisibility(View.GONE);
    } else {
        binding.shimmerLayout.stopShimmer();
        binding.shimmerLayout.setVisibility(View.GONE);
        binding.recyclerView.setVisibility(View.VISIBLE);
    }
}
```

### Toast Notifications
Use Material Snackbar or Toast:
```java
// Success message
Snackbar.make(binding.getRoot(), "Farmer added successfully", Snackbar.LENGTH_SHORT)
    .setBackgroundTint(getResources().getColor(R.color.md_theme_light_primary))
    .show();

// Error message
Snackbar.make(binding.getRoot(), "Failed to save", Snackbar.LENGTH_LONG)
    .setBackgroundTint(getResources().getColor(R.color.md_theme_light_error))
    .setAction("Retry", v -> retry())
    .show();

// Simple toast
Toast.makeText(requireContext(), "Supply entry saved", Toast.LENGTH_SHORT).show();
```

### Theme Access
Access theme colors programmatically:
```java
// Get theme color
TypedValue typedValue = new TypedValue();
getTheme().resolveAttribute(R.attr.colorPrimary, typedValue, true);
int primaryColor = typedValue.data;

// Apply to view
view.setBackgroundColor(primaryColor);
```
