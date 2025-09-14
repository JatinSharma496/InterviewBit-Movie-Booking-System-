@echo off
echo ========================================
echo Cinema Booking System - Quick Deploy
echo ========================================
echo.

echo Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker Desktop from https://docker.com
    pause
    exit /b 1
)

echo Docker found! Starting deployment...
echo.

echo Building and starting all services...
docker-compose up --build -d

if %errorlevel% neq 0 (
    echo ERROR: Failed to start services
    echo Check the logs with: docker-compose logs
    pause
    exit /b 1
)

echo.
echo Waiting for services to initialize...
timeout /t 45 /nobreak >nul

echo.
echo Checking service status...
docker-compose ps

echo.
echo ========================================
echo 🎉 Deployment Successful!
echo ========================================
echo.
echo Your Cinema Booking System is now running:
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8080/api
echo 🔌 WebSocket: ws://localhost:8080/ws
echo.
echo 📊 Sample Data:
echo    - 2 cinemas with multiple screens
echo    - 3 popular movies with showtimes
echo    - Admin user: admin@cinema.com / admin123
echo    - Regular user: user@cinema.com / user123
echo.
echo 📝 Useful Commands:
echo    - View logs: docker-compose logs -f
echo    - Stop services: docker-compose down
echo    - Restart: docker-compose restart
echo.
echo Press any key to open the application in your browser...
pause >nul

start http://localhost:3000

