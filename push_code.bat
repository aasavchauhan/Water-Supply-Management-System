@echo off
echo ==========================================
echo   Water Supply Management - Auto Push
echo ==========================================
echo.

:: Try to find git automatically
set GIT_CMD=git
if exist "C:\Program Files\Git\cmd\git.exe" set GIT_CMD="C:\Program Files\Git\cmd\git.exe"
if exist "C:\Program Files\Git\bin\git.exe" set GIT_CMD="C:\Program Files\Git\bin\git.exe"

echo Using Git at: %GIT_CMD%

%GIT_CMD% init
%GIT_CMD% add .
%GIT_CMD% commit -m "Auto-commit from Assistant"
%GIT_CMD% branch -M main
%GIT_CMD% remote remove origin
%GIT_CMD% remote add origin https://github.com/aasavchauhan/WaterSupplyManagement.git
%GIT_CMD% push -u origin main

echo.
echo ==========================================
echo   Operation Complete.
echo   If you saw errors above, please check if the Repo exists on GitHub.
echo ==========================================
pause
