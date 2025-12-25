@echo off
echo Converting app/google-services.json to Base64...

if not exist "app\google-services.json" (
    echo Error: app\google-services.json not found!
    pause
    exit /b
)

certutil -encode "app\google-services.json" temp_b64.txt >nul
findstr /v /c:"---" temp_b64.txt > secret_code.txt
del temp_b64.txt

echo.
echo Success! The secret code is in 'secret_code.txt'.
echo Open that file, copy everything, and paste it into GitHub Secrets.
echo.
pause
