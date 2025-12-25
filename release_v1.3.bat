@echo off
echo ============================================
echo   Updating Release to v1.3 (Fixed Java Path)
echo ============================================

set GIT_CMD=git
if exist "C:\Program Files\Git\cmd\git.exe" set GIT_CMD="C:\Program Files\Git\cmd\git.exe"

echo 1. Pushing gradle.properties fixes...
%GIT_CMD% add gradle.properties
%GIT_CMD% commit -m "Fix: Remove hardcoded Windows Java path for Linux build"
%GIT_CMD% push origin main

echo.
echo 2. Creating Tag v1.3...
%GIT_CMD% tag v1.3

echo.
echo 3. Pushing Tag v1.3 to GitHub...
%GIT_CMD% push origin v1.3

echo.
echo ============================================
echo   DONE!
echo   Go to GitHub > Actions.
echo   Check "v1.3". This should DEFINITELY succeed.
echo ============================================
pause
