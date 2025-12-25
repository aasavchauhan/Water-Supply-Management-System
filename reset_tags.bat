@echo off
echo ============================================
echo   Resetting Release Version to v1.0.1
echo ============================================

set GIT_CMD=git
if exist "C:\Program Files\Git\cmd\git.exe" set GIT_CMD="C:\Program Files\Git\cmd\git.exe"

echo 1. Deleting old tags from Remote (GitHub)...
%GIT_CMD% push --delete origin v1.0
%GIT_CMD% push --delete origin v1.1
%GIT_CMD% push --delete origin v1.2
%GIT_CMD% push --delete origin v1.3

echo.
echo 2. Deleting old tags from Local...
%GIT_CMD% tag -d v1.0
%GIT_CMD% tag -d v1.1
%GIT_CMD% tag -d v1.2
%GIT_CMD% tag -d v1.3

echo.
echo 3. Creating Fresh v1.0.1 Tag...
%GIT_CMD% tag v1.0.1

echo.
echo 4. Pushing New Tag to GitHub...
%GIT_CMD% push origin v1.0.1

echo.
echo ============================================
echo   DONE!
echo   Go to GitHub > Actions.
echo   You should see "v1.0.1" running now.
echo ============================================
pause
