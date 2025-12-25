@echo off
echo ============================================
echo   Creating Release v1.1 (Latest Code)
echo ============================================

set GIT_CMD=git
if exist "C:\Program Files\Git\cmd\git.exe" set GIT_CMD="C:\Program Files\Git\cmd\git.exe"

echo 1. Ensuring all changes are pushed...
%GIT_CMD% add .
%GIT_CMD% commit -m "Prepare for v1.1 release"
%GIT_CMD% push origin main

echo.
echo 2. Creating Tag v1.1 on the LATEST code...
%GIT_CMD% tag v1.1

echo.
echo 3. Pushing Tag v1.1 to GitHub...
%GIT_CMD% push origin v1.1

echo.
echo ============================================
echo   DONE!
echo   Go to GitHub > Actions.
echo   You should see "v1.1" running now.
echo ============================================
pause
