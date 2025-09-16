@echo off
echo Finding your computer's IP address...
echo.
echo Your IP addresses:
ipconfig | findstr "IPv4"
echo.
echo Use one of these IPs with port 5173 to access from mobile:
echo Example: http://192.168.1.100:5173
echo.
pause
