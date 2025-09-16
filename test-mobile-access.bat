@echo off
echo Testing Mobile Access Setup...
echo.

echo 1. Finding your computer's IP address:
ipconfig | findstr "IPv4"
echo.

echo 2. Starting Frontend Development Server...
echo    Make sure to run this in a separate command prompt:
echo    cd frontendd
echo    npm run dev
echo.

echo 3. Starting Backend Server...
echo    Make sure to run this in another command prompt:
echo    cd backend
echo    mvn spring-boot:run
echo.

echo 4. Test URLs for mobile:
echo    Frontend: http://YOUR_IP:5173
echo    Backend API: http://YOUR_IP:8080/api/health
echo.

echo 5. Common IP addresses to try:
echo    - 192.168.1.xxx (most common)
echo    - 192.168.0.xxx
echo    - 10.0.0.xxx
echo.

pause
