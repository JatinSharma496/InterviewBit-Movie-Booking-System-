@echo off
echo ========================================
echo    RESTARTING BACKEND SERVER
echo ========================================
echo.

echo Stopping any existing backend processes...
taskkill /f /im java.exe 2>nul

echo.
echo Starting backend server...
cd backend
mvn spring-boot:run

pause
