@echo off
echo ============================================
echo   Removing Sensitive Files from Git History
echo ============================================

set GIT_CMD=git
if exist "C:\Program Files\Git\cmd\git.exe" set GIT_CMD="C:\Program Files\Git\cmd\git.exe"

%GIT_CMD% rm --cached app/google-services.json
%GIT_CMD% rm --cached local.properties
%GIT_CMD% rm --cached *.jks
%GIT_CMD% rm --cached *.keystore

echo.
echo Committing removal...
%GIT_CMD% commit -m "Security: Remove sensitive keys from repository"

echo.
echo Pushing changes...
%GIT_CMD% push origin main

echo.
echo ============================================
echo DONE. Your repo is now cleaner.
echo CHECK GITHUB: If you see google-services.json there,
echo you might need to force update history.
echo ============================================
pause
