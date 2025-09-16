@echo off
echo ========================================
echo    DETAILED LOGIN TEST
echo ========================================
echo.

echo 1. Testing backend health:
echo ---------------------------
curl -X GET http://localhost:8080/api/users -v
echo.
echo.

echo 2. Testing login with verbose output:
echo -------------------------------------
curl -X POST http://localhost:8080/api/users/login -H "Content-Type: application/json" -H "Origin: http://localhost:5173" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}" -v
echo.
echo.

echo 3. Testing OPTIONS request (CORS preflight):
echo ---------------------------------------------
curl -X OPTIONS http://localhost:8080/api/users/login -H "Origin: http://localhost:5173" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: Content-Type" -v
echo.
echo.

echo 4. Checking if user exists:
echo ---------------------------
curl -X GET http://localhost:8080/api/users/email/test@example.com
echo.
echo.

echo 5. Creating a new test user:
echo -----------------------------
curl -X POST http://localhost:8080/api/users/signup -H "Content-Type: application/json" -d "{\"name\":\"PC Test User\",\"email\":\"pctest@example.com\",\"password\":\"test123\",\"phoneNumber\":\"1234567890\",\"isAdmin\":false}"
echo.
echo.

echo 6. Testing login with new user:
echo --------------------------------
curl -X POST http://localhost:8080/api/users/login -H "Content-Type: application/json" -H "Origin: http://localhost:5173" -d "{\"email\":\"pctest@example.com\",\"password\":\"test123\"}" -v
echo.
echo.

pause
