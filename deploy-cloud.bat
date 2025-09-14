@echo off
echo ========================================
echo Cinema Booking System - Cloud Deployment
echo ========================================
echo.

echo This script will help you deploy to the cloud!
echo.

echo Step 1: Prepare your code for deployment
echo ========================================
echo.

echo Building backend...
cd backend
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Backend build failed
    pause
    exit /b 1
)
cd ..

echo.
echo Building frontend...
cd frontendd
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Build completed successfully!
echo ========================================
echo.

echo Next steps:
echo 1. Push your code to GitHub
echo 2. Follow the CLOUD-DEPLOYMENT.md guide
echo 3. Deploy backend to Railway
echo 4. Deploy frontend to Vercel
echo.

echo Opening deployment guide...
start CLOUD-DEPLOYMENT.md

echo.
echo Press any key to open GitHub...
pause >nul
start https://github.com

echo.
echo Deployment preparation complete!
echo Check CLOUD-DEPLOYMENT.md for detailed instructions.
pause

