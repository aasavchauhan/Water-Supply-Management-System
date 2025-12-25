@echo off
echo ==========================================
echo   Water Supply Management - GitHub Setup
echo ==========================================
echo.

:: Check if git is available
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Git is not found in your PATH.
    echo Please verify installation and restart your terminal/PC.
    pause
    exit /b
)

echo 1. Initializing new repository...
git init

echo.
echo 2. Adding files to staging...
git add .

echo.
echo 3. Committing files...
git commit -m "Initial commit of Water Supply Management App"

echo.
echo 4. Renaming branch to 'main'...
git branch -M main

echo.
echo ==========================================
echo IMPORTANT: You need a GitHub Repository to continue.
echo Go to https://github.com/new and create a repository named 'WaterSupplyManagement'.
echo ==========================================
echo.

set /p REPO_URL="Enter your new Repository URL (e.g., https://github.com/aasavchauhan/WaterSupplyManagement.git): "

echo.
echo 5. Linking remote repository...
git remote add origin %REPO_URL%

echo.
echo 6. Pushing code to GitHub...
git push -u origin main

echo.
echo ==========================================
echo                 DONE!
echo ==========================================
pause
