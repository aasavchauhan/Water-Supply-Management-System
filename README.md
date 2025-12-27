# 💧 Water Supply Management System
> **A robust, offline-first Android solution for modern water distribution management.**

![Build Status](https://github.com/aasavchauhan/Water-Supply-Management-System/actions/workflows/build_release.yml/badge.svg)
![Latest Release](https://img.shields.io/github/v/release/aasavchauhan/Water-Supply-Management-System?label=Latest%20Version&style=flat-square&color=2ea44f)
![License](https://img.shields.io/github/license/aasavchauhan/Water-Supply-Management-System?style=flat-square&color=0056b3)
![Platform](https://img.shields.io/badge/Platform-Android-3DDC84?style=flat-square&logo=android)

<div align="center">
  <br>
  <img src="https://raw.githubusercontent.com/aasavchauhan/Water-Supply-Management-System/main/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png" alt="App Icon" width="120" height="120" style="border-radius: 24px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
  <h3 style="margin-top: 20px;">Streamline. Track. Manage.</h3>
  <p>Efficiently manage farmer supplies, payments, and billing with precision.</p>
  
  <a href="https://github.com/aasavchauhan/Water-Supply-Management-System/releases/latest">
    <img src="https://img.shields.io/badge/Download_Latest_APK-blue?style=for-the-badge&logo=android&logoColor=white" alt="Download APK" height="40">
  </a>
</div>

---

## 🚀 Overview

**Water Supply Management** is a professional-grade native Android application designed to digitize the water distribution workflow for agricultural cooperatives and private suppliers. Engineered for reliability in rural connectivity environments, it features a robust **offline-first architecture** synchronized with **Firebase Cloud**.

It simplifies complex billing scenarios with support for both **meter-based** and **time-based** water usage, automated PDF reporting, and integrated financial tracking.

---

## ✨ Key Features

### 👥 Farmer Management
*   **Centralized Directory**: Maintain detailed profiles of all farmers.
*   **Quick Search**: Instantly locate farmers by name or ID.
*   **Balance Tracking**: Real-time view of outstanding dues and credit limits.

### ⏱️ Supply Tracking
*   **Dual Billing Modes**:
    *   **Time-Based**: Auto-calculated costs based on pump run hours.
    *   **Meter-Based**: Precise billing using start/stop meter readings.
*   **Live Drafts**: Start a supply session and let it run in the background (even if the app closes).
*   **Pause/Resume**: Handle interruptions effortlessly without losing data.

### 💰 Financials & Payments
*   **Transaction Logs**: Securely record all payments (Cash/UPI/Bank Transfer).
*   **Revenue Dashboard**: Visual insights into total revenue, pending collections, and monthly trends.
*   **Invoice Generation**: Auto-calculate bills based on configurable rates.

### 📊 Reporting & Analytics
*   **PDF Exports**: Generate professional invoices and statements sharing via WhatsApp/Email.
*   **Dynamic filtering**: Filter reports by date range, farmer, or payment status.
*   **Dashboard Charts**: Interactive graphs powered by *MPAndroidChart*.

### 🔒 Security & Performance
*   **Biometric Login**: Secure app access using fingerprint authentication.
*   **Cloud Sync**: Real-time data synchronization with Firebase Firestore.
*   **Offline Capability**: Full functionality without internet; syncs automatically when online.

---

## 📱 Screenshots

| **Dashboard** | **Farmer Profile** | **Supply Entry** | **Reports** |
|:---:|:---:|:---:|:---:|
| <img src="docs/screenshots/dashboard.png" alt="Dashboard" width="200"/> | <img src="docs/screenshots/profile.png" alt="Profile" width="200"/> | <img src="docs/screenshots/supply.png" alt="Supply" width="200"/> | <img src="docs/screenshots/report.png" alt="Reports" width="200"/> |

*(Note: Screenshots to be added in `docs/screenshots/`)*

---

## 🛠️ Technology Stack

Built with modern Android development standards for performance and maintainability.

*   **Language**: [Java 11+](https://docs.oracle.com/en/java/)
*   **Architecture**: MVVM (Model-View-ViewModel)
*   **UI Toolkit**: Material Design 3 (XML + ViewBinding)
*   **Dependency Injection**: [Hilt (Dagger)](https://dagger.dev/hilt/)
*   **Cloud Backend**: [Firebase Firestore](https://firebase.google.com/docs/firestore) & Auth
*   **Asynchronous Processing**: RxJava / LiveData
*   **PDF Generation**: Native `android.graphics.pdf`
*   **Charting**: [MPAndroidChart](https://github.com/PhilJay/MPAndroidChart)

---

## ⚙️ Installation

### Option 1: Install APK directly
Download the latest signed APK from the [Releases Page](https://github.com/aasavchauhan/Water-Supply-Management-System/releases).

### Option 2: Build from Source
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/aasavchauhan/Water-Supply-Management-System.git
    ```
2.  **Open in Android Studio** (Hedgehog or newer).
3.  **Add `google-services.json`**:
    *   Create a project in [Firebase Console](https://console.firebase.google.com/).
    *   Add an Android app with package `com.watersupply`.
    *   Download `google-services.json` and place it in the `/app` folder.
4.  **Build & Run**:
    ```bash
    ./gradlew assembleDebug
    ```

---

## 📦 Automated Workflows

This repository utilizes **GitHub Actions** for robust CI/CD:

1.  **Build Validation**: Every push to `main` is compiled to ensure code integrity.
2.  **Release Automation**: Pushing a tag (e.g., `v1.0.4`) automatically:
    *   Builds a release APK.
    *   Generates release notes.
    *   Publishes it to GitHub Releases.

---

## 🤝 Contribution

Contributions are welcome! We follow the "Fork-and-Pull" Git workflow.

1.  **Fork** the repo on GitHub.
2.  **Clone** your fork locally.
3.  **Create** a new branch (`git checkout -b feature/amazing-feature`).
4.  **Commit** your changes.
5.  **Push** to your fork.
6.  Submit a **Pull Request**.

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Developed with ❤️ by <b>Aasav Chauhan</b></p>
  <p>
    <a href="https://github.com/aasavchauhan">GitHub</a> • 
    <a href="mailto:aasavchauhan@gmail.com">Contact</a>
  </p>
  <p>© 2025 Water Supply Management System</p>
</div>
