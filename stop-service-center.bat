@echo off
title Service Center - Stop Services
color 0C

echo ========================================
echo   Service Center - Stopping Services
echo ========================================
echo.

:: Get current date and time
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set stoptime=%datetime:~8,2%:%datetime:~10,2%:%datetime:~12,2%
set stopdate=%datetime:~0,4%/%datetime:~4,2%/%datetime:~6,2%

echo [%stopdate% %stoptime%] Stopping Service Center services...
echo.

:: Kill Java processes (Spring Boot)
echo [INFO] Stopping Backend (Spring Boot)...
taskkill /FI "WINDOWTITLE eq Service Center - Backend*" /T /F >nul 2>&1
taskkill /FI "IMAGENAME eq java.exe" /FI "WINDOWTITLE eq *Backend*" /T /F >nul 2>&1
for /f "tokens=2" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo [%stopdate% %stoptime%] Backend: Stopped

:: Kill Node processes (React)
echo [INFO] Stopping Frontend (React)...
taskkill /FI "WINDOWTITLE eq Service Center - Frontend*" /T /F >nul 2>&1
taskkill /FI "IMAGENAME eq node.exe" /FI "WINDOWTITLE eq *Frontend*" /T /F >nul 2>&1
for /f "tokens=2" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo [%stopdate% %stoptime%] Frontend: Stopped

echo.
echo ========================================
echo   Services Stopped Successfully!
echo ========================================
echo.
echo [%stopdate% %stoptime%] Status: All services stopped.
echo.
pause


