@echo off
REM MGNREGA Goa Dashboard - Quick Start Script
REM Production Ready Version

color 0A
echo ========================================
echo   MGNREGA Goa Dashboard
echo   Quick Start - Production Ready
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js found
echo.

REM Start Backend
echo Starting Backend Server...
cd backend
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)
start "MGNREGA Backend" cmd /k "npm start"
cd ..
echo [OK] Backend starting on http://localhost:5000
echo.

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend
echo Starting Frontend...
cd frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)
start "MGNREGA Frontend" cmd /k "npm run dev"
cd ..
echo [OK] Frontend starting on http://localhost:3000
echo.

REM Wait for services to start
echo Waiting for services to start...
timeout /t 5 /nobreak >nul

REM Open browser
echo Opening browser...
start http://localhost:3000

echo.
echo ========================================
echo   Dashboard Started Successfully!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Press any key to view this window or close it
pause >nul
