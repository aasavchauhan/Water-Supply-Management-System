@echo off
echo ============================================
echo   Final Cleanup for Professional Repo
echo ============================================

echo 1. Removing your Secret helper file...
if exist secret_code.txt del secret_code.txt

echo 2. Removing Maintenance Scripts...
if exist release_v1.0.bat del release_v1.0.bat
if exist release_v1.1.bat del release_v1.1.bat
if exist release_v1.2.bat del release_v1.2.bat
if exist release_v1.3.bat del release_v1.3.bat
if exist reset_tags.bat del reset_tags.bat

echo 3. Removing this script...
(goto) 2>nul & del "%~f0"
