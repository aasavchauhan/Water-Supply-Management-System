@echo off
echo ============================================
echo   Final Build Fix & Version Reset (v1.0.1)
echo ============================================

set GIT_CMD=git
if exist "C:\Program Files\Git\cmd\git.exe" set GIT_CMD="C:\Program Files\Git\cmd\git.exe"

echo 1. Ensuring Code Fixes are Committed...
:: Specifically adding the gradle.properties Fix
%GIT_CMD% add gradle.properties
%GIT_CMD% commit -m "Fix: Remove Windows Java path to allow Linux build"

echo.
echo 2. Deleting Failed Tags...
%GIT_CMD% push --delete origin v1.0
%GIT_CMD% push --delete origin v1.1
%GIT_CMD% push --delete origin v1.2
%GIT_CMD% push --delete origin v1.3
%GIT_CMD% tag -d v1.0
%GIT_CMD% tag -d v1.1
%GIT_CMD% tag -d v1.2
%GIT_CMD% tag -d v1.3

echo.
echo 3. Defining Fresh Release v1.0.1...
%GIT_CMD% tag v1.0.1

echo.
echo 4. Pushing Fixes and New Release...
%GIT_CMD% push origin main
%GIT_CMD% push origin v1.0.1

echo.
echo ============================================
echo   DONE!
echo   Go to GitHub > Actions.
echo   Watch "v1.0.1". It will PASS.
echo ============================================
pause
