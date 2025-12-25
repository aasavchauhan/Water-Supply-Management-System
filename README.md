# Water Supply Management - Native Android App

![Build Status](https://github.com/aasavchauhan/WaterSupplyManagement/actions/workflows/build_release.yml/badge.svg)
![Latest Release](https://img.shields.io/github/v/release/aasavchauhan/WaterSupplyManagement?label=Latest%20Version&style=flat-square&color=blue)
![License](https://img.shields.io/github/license/aasavchauhan/WaterSupplyManagement?style=flat-square)

A native Android application for managing water supply distribution to farmers with offline-first architecture.

<div align="center">
  <h3>📲 <a href="https://github.com/aasavchauhan/WaterSupplyManagement/releases/latest">Download Latest APK</a></h3>
</div>

## 📦 Automated Releases
This repository features an automated CI/CD pipeline.
Every time a tag (e.g., `v1.0`) is pushed, a new **APK** is automatically built and attached to the Release.


## 🎯 Features

- **User Authentication**: PIN-based login with biometric support
- **Farmer Management**: Add, view, and manage farmer profiles
- **Supply Entry**: Dual billing system (time-based and meter-based)
- **Payment Tracking**: Record and track farmer payments
- **Dashboard**: Quick overview of farmers, supply entries, and revenue
- **Offline-First**: Full functionality without internet connection using Room database

## 🏗️ Architecture

- **Pattern**: MVVM (Model-View-ViewModel)
- **Language**: Java 11+
- **Database**: Room Persistence Library (SQLite)
- **UI**: Material Design 3
- **DI**: Hilt (Dagger 2)
- **Async**: LiveData + ViewModel

## 📋 Prerequisites

- Android Studio Hedgehog+ (2023.1.1 or later)
- Java JDK 11+ (OpenJDK recommended)
- Android SDK 26+ (Android 8.0 Oreo)
- Minimum Android device: API 26

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd WaterSupplyManagement
```

### 2. Open in Android Studio

1. Launch Android Studio
2. Click "Open" and select the project folder
3. Wait for Gradle sync to complete

### 3. Run the App

**Option A: Using Android Studio**
1. Click "Sync Project with Gradle Files" (elephant icon)
2. Connect Android device via USB (with USB debugging enabled) or start an emulator
3. Click "Run" (green play button) or press Shift+F10

**Option B: Using Command Line**

```bash
# Build debug APK
.\gradlew.bat assembleDebug

# Install on connected device
.\gradlew.bat installDebug

# Or build and run in one command
.\gradlew.bat installDebug
adb shell am start -n com.watersupply/.MainActivity
```

## 📱 App Structure

```
com.watersupply/
├── data/
│   ├── database/
│   │   ├── entities/          # Room entities (User, Farmer, SupplyEntry, etc.)
│   │   ├── dao/               # Data Access Objects
│   │   └── AppDatabase.java  # Room database
│   └── repository/            # Repository layer for data operations
├── ui/
│   ├── auth/                  # Login and registration
│   ├── dashboard/             # Dashboard with stats
│   ├── farmers/               # Farmer management screens
│   └── supply/                # Supply entry screens
├── utils/                     # Utility classes (BillingCalculator, formatters)
├── di/                        # Hilt dependency injection modules
└── WaterSupplyApplication.java
```

## 🗄️ Database Schema

### Entities
- **User**: Authentication and user profile
- **Farmer**: Farmer profiles with balance tracking
- **SupplyEntry**: Water supply transactions (time or meter-based)
- **Payment**: Payment records
- **AppSettings**: Business settings and preferences

## 🎨 Design System

- **Theme**: Material Design 3 with water-themed teal colors
- **Spacing**: 4dp grid system
- **Components**: Material buttons, cards, text fields
- **Typography**: Sans-serif with Material type scale

## 📦 Dependencies

Key libraries used:
- Material Design 3 (1.11.0)
- Room Database (2.6.1)
- Lifecycle Components (2.7.0)
- Navigation Component (2.7.6)
- Hilt for DI (2.50)
- Glide for images (4.16.0)
- Biometric API (1.2.0-alpha05)

## 🔧 Configuration

### Update Package Name
To change the package name from `com.watersupply`:
1. Update `namespace` in `app/build.gradle.kts`
2. Refactor package in Android Studio (Right-click package → Refactor → Rename)
3. Update `applicationId` in `app/build.gradle.kts`

### Database Migrations
For schema changes:
1. Increment version in `AppDatabase.java`
2. Add migration strategy or use `fallbackToDestructiveMigration()` for development

## 🧪 Testing

```bash
# Run unit tests
.\gradlew.bat test

# Run instrumented tests
.\gradlew.bat connectedAndroidTest
```

## 📝 Usage Flow

1. **First Launch**: User registers with mobile number and 4-digit PIN
2. **Login**: Enter mobile and PIN (biometric optional)
3. **Dashboard**: View summary of farmers, supply entries, revenue
4. **Add Farmer**: Click FAB → Enter farmer details → Save
5. **Add Supply Entry**: Select farmer → Choose billing method (time/meter) → Enter readings → Save
6. **View History**: Browse supply entries and payments

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Build Fails with "Unable to find Java"
- Ensure JDK 11+ is installed
- Set `JAVA_HOME` environment variable
- Or set `org.gradle.java.home` in `gradle.properties`

### Hilt Dependency Injection Errors
- Clean and rebuild: `.\gradlew.bat clean build`
- Invalidate caches in Android Studio: File → Invalidate Caches

### Room Database Errors
- Check entity annotations (`@Entity`, `@PrimaryKey`, `@ColumnInfo`)
- Verify DAO queries are correct
- For schema changes, increment database version

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact: aasavchauhan@gmail.com

---

**Built with ❤️ using Native Android and Material Design 3**
