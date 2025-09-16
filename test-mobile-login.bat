@echo off
echo ========================================
echo    MOBILE LOGIN TEST SCRIPT
echo ========================================
echo.

echo 1. Finding your computer's IP address:
echo ----------------------------------------
ipconfig | findstr "IPv4"
echo.

echo 2. Testing Backend API (from your computer):
echo ---------------------------------------------
echo Testing login endpoint...
curl -X POST http://localhost:8080/api/users/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
echo.
echo.

echo 3. Testing CORS with mobile IP simulation:
echo -------------------------------------------
echo Testing with Origin header...
curl -X POST http://localhost:8080/api/users/login -H "Content-Type: application/json" -H "Origin: http://192.168.1.100:5173" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
echo.
echo.

echo 4. Instructions for mobile testing:
echo -----------------------------------
echo 1. Make sure both servers are running:
echo    - Backend: cd backend && mvn spring-boot:run
echo    - Frontend: cd frontendd && npm run dev
echo.
echo 2. On your mobile device, open browser and go to:
echo    http://YOUR_IP:5173
echo    (Replace YOUR_IP with one of the IPs shown above)
echo.
echo 3. Try to login with:
echo    Email: test@example.com
echo    Password: password123
echo.
echo 4. If login still fails, check browser developer tools:
echo    - Open browser dev tools (F12)
echo    - Go to Network tab
echo    - Try login again
echo    - Look for CORS errors in console
echo.

echo 5. Alternative test - Create new user:
echo --------------------------------------
echo Testing signup endpoint...
curl -X POST http://localhost:8080/api/users/signup -H "Content-Type: application/json" -d "{\"name\":\"Mobile Test User\",\"email\":\"mobile@test.com\",\"password\":\"test123\",\"phoneNumber\":\"9876543210\",\"isAdmin\":false}"
echo.
echo.

pause
