@echo off
title Service Center - Startup Script
color 0A

echo ========================================
echo   Service Center - Starting Services
echo ========================================
echo.

:: Get current date and time
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set starttime=%datetime:~8,2%:%datetime:~10,2%:%datetime:~12,2%
set startdate=%datetime:~0,4%/%datetime:~4,2%/%datetime:~6,2%

echo [%startdate% %starttime%] Starting Service Center...
echo.

:: Check if Maven wrapper exists
if not exist "mvnw.cmd" (
    echo [ERROR] Maven wrapper (mvnw.cmd) not found!
    echo Please ensure you are running this from the project root directory.
    pause
    exit /b 1
)

:: Check if frontend directory exists
if not exist "src\frontend" (
    echo [ERROR] Frontend directory not found!
    echo Please ensure the frontend is in src\frontend directory.
    pause
    exit /b 1
)

:: Check if node_modules exists in frontend
if not exist "src\frontend\node_modules" (
    echo [WARNING] Frontend node_modules not found!
    echo Installing frontend dependencies...
    cd src\frontend
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install frontend dependencies!
        pause
        exit /b 1
    )
    cd ..\..
    echo [SUCCESS] Frontend dependencies installed.
    echo.
)

echo ========================================
echo   Starting Backend (Spring Boot)
echo ========================================
echo [%startdate% %starttime%] Backend: Starting Spring Boot application...
echo [INFO] Backend will run on: http://localhost:8080
echo.

:: Start backend in a new window
start "Service Center - Backend (Spring Boot)" cmd /k "echo [%date% %time%] Backend Starting... && echo. && .\mvnw.cmd spring-boot:run && echo. && echo [%date% %time%] Backend Stopped. && pause"

:: Wait a bit for backend to start
timeout /t 3 /nobreak >nul

echo ========================================
echo   Starting Frontend (React)
echo ========================================
echo [%startdate% %starttime%] Frontend: Starting React application...
echo [INFO] Frontend will run on: http://localhost:3000
echo.

:: Start frontend in a new window
cd src\frontend
start "Service Center - Frontend (React)" cmd /k "echo [%date% %time%] Frontend Starting... && echo. && npm start && echo. && echo [%date% %time%] Frontend Stopped. && pause"
cd ..\..

echo.
echo ========================================
echo   Services Started Successfully!
echo ========================================
echo.
echo [%startdate% %starttime%] Status: Both services are starting...
echo.
echo Backend URL:  http://localhost:8080
echo Frontend URL: http://localhost:3000
echo.
echo [INFO] Two separate windows have been opened:
echo        - Service Center - Backend (Spring Boot)
echo        - Service Center - Frontend (React)
echo.
echo [INFO] To stop services, close the respective windows.
echo.
echo Press any key to exit this window (services will continue running)...
pause >nul


