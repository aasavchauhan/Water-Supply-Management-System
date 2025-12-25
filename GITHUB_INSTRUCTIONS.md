# How to Push Your Project to GitHub

Since `git` is not currently installed or recognized on your system, follow these steps to upload your project.

## Step 1: Install Git
1. Download Git for Windows from **[git-scm.com](https://git-scm.com/download/win)**.
2. Run the installer and click "Next" through the default options.
   - **Important**: Make sure "Git from the command line and also from 3rd-party software" is selected (it usually is by default).
3. After installation, close and reopen Android Studio or your terminal.

## Step 2: Initialize Repository
Open the Terminal in Android Studio (at the bottom) or use PowerShell in your project folder:

```powershell
# Initialize a new git repo
git init

# Check the status of your files
git status
```

## Step 3: Commit Your Files
We have already created a safe `.gitignore` file for you, so you won't upload sensitive build files.

```powershell
# Add all files to staging
git add .

# Commit them
git commit -m "Initial commit of Water Supply Management App"
```

## Step 4: Create a Repository on GitHub
1. Go to **[github.com/new](https://github.com/new)**.
2. Enter a name (e.g., `WaterSupplyManagement`).
3. Click **Create repository**.

## Step 5: Connect and Push
Copy the commands shown on the GitHub page under "…or push an existing repository from the command line" and run them in your terminal:

```powershell
# Replace URL with your actual new repo URL
git remote add origin https://github.com/YOUR_USERNAME/WaterSupplyManagement.git

# Rename branch to main (standard practice)
git branch -M main

# Push your code
git push -u origin main
```

## Step 6: Verify
Refresh your GitHub page, and you should see your code!

---
**Note:** If you encounter authentication prompts, you may need to use a Personal Access Token or sign in via the browser pop-up.
