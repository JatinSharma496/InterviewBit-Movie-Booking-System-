@echo off
echo ========================================
echo    DEBUGGING LOGIN ISSUE
echo ========================================
echo.

echo 1. Checking if backend is running:
echo -----------------------------------
curl -s -o nul -w "Backend Status: %%{http_code}\n" http://localhost:8080/api/users
echo.

echo 2. Checking if frontend is running:
echo -----------------------------------
curl -s -o nul -w "Frontend Status: %%{http_code}\n" http://localhost:5173
echo.

echo 3. Testing API endpoints:
echo -------------------------
echo Testing login endpoint...
curl -X POST http://localhost:8080/api/users/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}" 2>nul
echo.
echo.

echo 4. Testing CORS with different origins:
echo ---------------------------------------
echo Testing with localhost:5173 origin...
curl -X POST http://localhost:8080/api/users/login -H "Content-Type: application/json" -H "Origin: http://localhost:5173" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}" 2>nul
echo.
echo.

echo 5. Instructions for browser testing:
echo ------------------------------------
echo 1. Open browser and go to: http://localhost:5173
echo 2. Open Developer Tools (F12)
echo 3. Go to Console tab
echo 4. Try to login
echo 5. Check for any error messages in console
echo 6. Go to Network tab and check if the login request is being made
echo.

echo 6. Alternative test - Open test file:
echo -------------------------------------
echo Open test-frontend-api.html in your browser to test API directly
echo.

pause
