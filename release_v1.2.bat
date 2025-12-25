@echo off
echo ============================================
echo   Updating Release to v1.2 (Debug Info)
echo ============================================

set GIT_CMD=git
if exist "C:\Program Files\Git\cmd\git.exe" set GIT_CMD="C:\Program Files\Git\cmd\git.exe"

echo 1. Pushing workflow fixes...
%GIT_CMD% add .github/workflows/build_release.yml
%GIT_CMD% commit -m "Fix: Enhance build logging and secret decoding"
%GIT_CMD% push origin main

echo.
echo 2. Creating Tag v1.2...
%GIT_CMD% tag v1.2

echo.
echo 3. Pushing Tag v1.2 to GitHub...
%GIT_CMD% push origin v1.2

echo.
echo ============================================
echo   DONE!
echo   Go to GitHub > Actions.
echo   Check "v1.2". It will now show DETAILED
echo   logs if it fails.
echo ============================================
pause
