# Git & Android Studio Best Practices

This guide explains how to manage your project professionally using Android Studio's built-in Version Control System (VCS) and best practices for GitHub.

---

## 🟢 1. Daily Workflow (Commit & Push)

You don't need the terminal! Use Android Studio's buttons.

### Step A: Saving Changes (Commit)
When you finish a task (e.g., "Added a new button"), save it:
1.  Press `Ctrl + K` (or click the **Commit** tab on the left).
2.  Select the files you changed.
3.  **Write a meaningful message**.
    - ❌ Bad: "Update"
    - ✅ Good: "Feat: Add download button to PDF report"
4.  Click **Commit**.

### Step B: Syncing to Cloud (Push)
1.  Press `Ctrl + Shift + K` (or go to **Git > Push**).
2.  Click **Push**.
3.  Your code is now safe on GitHub.

---

## 🏷️ 2. Releasing Updates (Releases)

Since we set up **Automated Actions**, releasing is easy. You don't build APKs manually anymore.

### How to Release v1.1, v1.2, etc.
1.  Make sure your latest code is pushed.
2.  In Android Studio, go to **Git > New Tag...**
3.  **Tag Name**: `v1.1` (Always use `v` followed by numbers).
4.  **Target**: `main` (or Leave empty for current head).
5.  Click **Create Tag**.
6.  **IMPORTANT**: You must PUSH the tag to GitHub.
    - Go to **Git > Push**.
    - Check the box **"Push Tags"** (bottom left of dialog).
    - Click **Push**.

**Result**: GitHub will see the tag, build the APK, and publish it on your Releases page automatically.

---

## 🌿 3. Branching (Working Safely)

Never work directly on `main` for big features. Use "Branches".

### Scenario: You want to add a "Dark Mode"
1.  Go to **Git > New Branch...**.
2.  Name it: `feature/dark-mode`.
3.  Work on your code for days. Even if it breaks the app, your `main` app is safe.
4.  When finished and tested:
    - Switch back to `main` (bottom right corner).
    - Go to **Git > Merge...** -> Select `feature/dark-mode`.
    - Push.

---

## 🛡️ 4. Safety Rules (Do's and Don'ts)

### ✅ DO:
- **Commit often**: Small changes are easier to fix than one huge change.
- **Pull before Push**: Always click "Update Project" (blue arrow down) before pushing to avoid conflicts.
- **Use .gitignore**: We already set this up. Never force-add files like `local.properties`.

### ❌ DON'T:
- **Upload Google Services Keys**: Keep `google-services.json` ignored. Use GitHub Secrets (we set this up).
- **Commit Build Folders**: Never commit `build/` or `.gradle/`.

---

## 🆘 Troubleshooting

**"Push Rejected" error?**
- Someone (or you) made changes on GitHub that you don't have.
- **Fix**: Press `Ctrl + T` (Update Project) to download changes first.

**"Build Failed on GitHub"?**
- Go to the **Actions** tab on browser.
- Click the failed run -> Click "Build with Gradle".
- Read the red error at the bottom.
