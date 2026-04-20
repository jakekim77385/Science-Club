@echo off
echo.
echo  ====================================
echo   Balboa Academy Science Club
echo   Starting local server on port 7020
echo  ====================================
echo.
cd /d "%~dp0"
start http://localhost:7020
node server.js
pause
