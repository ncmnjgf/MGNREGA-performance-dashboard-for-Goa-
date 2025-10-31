@echo off
REM Railway Deployment Helper Script for MGNREGA Goa Dashboard (Windows)
REM This script helps prepare and deploy the application to Railway

setlocal enabledelayedexpansion

REM Colors (Windows 10+)
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "BLUE=[94m"
set "NC=[0m"

:MENU
cls
echo.
echo ===============================================
echo   MGNREGA Goa Dashboard - Railway Deployment
echo ===============================================
echo.
echo Select an option:
echo.
echo 1) Full setup and deploy (recommended)
echo 2) Install dependencies only
echo 3) Test backend locally
echo 4) Commit changes to Git
echo 5) Deploy to Railway (manual)
echo 6) Show deployment checklist
echo 7) Exit
echo.
set /p choice="Enter your choice [1-7]: "

if "%choice%"=="1" goto FULL_SETUP
if "%choice%"=="2" goto INSTALL_DEPS
if "%choice%"=="3" goto TEST_BACKEND
if "%choice%"=="4" goto COMMIT_CHANGES
if "%choice%"=="5" goto DEPLOY_RAILWAY
if "%choice%"=="6" goto CHECKLIST
if "%choice%"=="7" goto EXIT
goto MENU

:FULL_SETUP
echo.
echo ===============================================
echo   Full Setup and Deployment
echo ===============================================
echo.
call :CHECK_NODE
call :CHECK_GIT
call :INSTALL_DEPENDENCIES
call :TEST_BACKEND_FUNC
call :COMMIT_GIT
call :DEPLOY_INFO
call :SHOW_CHECKLIST
pause
goto MENU

:INSTALL_DEPS
echo.
echo ===============================================
echo   Installing Dependencies
echo ===============================================
echo.
call :CHECK_NODE
call :INSTALL_DEPENDENCIES
pause
goto MENU

:TEST_BACKEND
echo.
echo ===============================================
echo   Testing Backend Locally
echo ===============================================
echo.
call :CHECK_NODE
call :TEST_BACKEND_FUNC
pause
goto MENU

:COMMIT_CHANGES
echo.
echo ===============================================
echo   Committing Changes to Git
echo ===============================================
echo.
call :CHECK_GIT
call :COMMIT_GIT
pause
goto MENU

:DEPLOY_RAILWAY
echo.
echo ===============================================
echo   Deploy to Railway
echo ===============================================
echo.
call :DEPLOY_INFO
pause
goto MENU

:CHECKLIST
echo.
call :SHOW_CHECKLIST
pause
goto MENU

:EXIT
echo.
echo Goodbye!
timeout /t 2 >nul
exit /b 0

REM ====================
REM FUNCTIONS
REM ====================

:CHECK_NODE
echo Checking Node.js installation...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% Node.js is not installed!
    echo Please install Node.js 18 or higher from https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo %GREEN%[SUCCESS]%NC% Node.js %NODE_VERSION% detected
exit /b 0

:CHECK_GIT
echo Checking Git installation...
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% Git is not installed!
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)
echo %GREEN%[SUCCESS]%NC% Git is installed

if not exist ".git" (
    echo %YELLOW%[WARNING]%NC% Git repository not initialized
    echo Initializing Git repository...
    git init
    echo %GREEN%[SUCCESS]%NC% Git repository initialized
) else (
    echo %GREEN%[SUCCESS]%NC% Git repository found
)
exit /b 0

:INSTALL_DEPENDENCIES
echo.
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% Failed to install backend dependencies
    cd ..
    exit /b 1
)
cd ..
echo %GREEN%[SUCCESS]%NC% Backend dependencies installed

echo.
echo Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% Failed to install frontend dependencies
    cd ..
    exit /b 1
)
cd ..
echo %GREEN%[SUCCESS]%NC% Frontend dependencies installed
exit /b 0

:TEST_BACKEND_FUNC
echo.
echo Testing backend...
cd backend

REM Check if .env exists
if not exist ".env" (
    echo %YELLOW%[WARNING]%NC% .env file not found, creating temporary one...
    (
        echo NODE_ENV=development
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/mgnrega-goa-dashboard
        echo CORS_ORIGIN=http://localhost:3000
    ) > .env
    echo %GREEN%[SUCCESS]%NC% Temporary .env created
)

echo.
echo Starting backend server...
echo You can test it at http://localhost:5000/health
echo Press Ctrl+C to stop the server when done testing
echo.
node src/server.js
cd ..
exit /b 0

:COMMIT_GIT
echo.
echo Creating .gitignore if needed...
if not exist ".gitignore" (
    (
        echo # Dependencies
        echo node_modules/
        echo package-lock.json
        echo.
        echo # Environment variables
        echo .env
        echo .env.local
        echo .env.production
        echo .env.*.local
        echo.
        echo # Build outputs
        echo dist/
        echo build/
        echo *.log
        echo.
        echo # IDE
        echo .vscode/
        echo .idea/
        echo *.swp
        echo *.swo
        echo.
        echo # OS
        echo .DS_Store
        echo Thumbs.db
        echo.
        echo # Testing
        echo coverage/
        echo.
        echo # Railway
        echo .railway/
    ) > .gitignore
    echo %GREEN%[SUCCESS]%NC% .gitignore created
)

echo.
echo Adding files to Git...
git add .

echo.
echo Committing changes...
git commit -m "Prepare for Railway deployment"
if %errorlevel% equ 0 (
    echo %GREEN%[SUCCESS]%NC% Changes committed
) else (
    echo %YELLOW%[INFO]%NC% Nothing to commit or commit failed
)
exit /b 0

:DEPLOY_INFO
echo.
echo ===============================================
echo   Railway Deployment Instructions
echo ===============================================
echo.
echo STEP 1: Push your code to GitHub
echo   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
echo   git branch -M main
echo   git push -u origin main
echo.
echo STEP 2: Go to Railway Dashboard
echo   Visit: https://railway.app/
echo   Sign in with your GitHub account
echo.
echo STEP 3: Create New Project
echo   - Click "New Project"
echo   - Select "Deploy from GitHub repo"
echo   - Choose your repository
echo.
echo STEP 4: Set up BACKEND Service
echo   - Go to Service Settings
echo   - Set Root Directory: /backend
echo   - Add Environment Variables:
echo     NODE_ENV=production
echo     MONGODB_URI=your_mongodb_connection_string
echo     CORS_ORIGIN=https://your-frontend-url.railway.app
echo.
echo STEP 5: Set up FRONTEND Service
echo   - Click "New" in your project
echo   - Select same GitHub repository
echo   - Set Root Directory: /frontend
echo   - Add Environment Variables:
echo     NODE_ENV=production
echo     VITE_API_URL=https://your-backend-url.railway.app
echo.
echo STEP 6: Deploy and Test
echo   - Both services will deploy automatically
echo   - Test backend: https://your-backend.railway.app/health
echo   - Test frontend: https://your-frontend.railway.app
echo.
exit /b 0

:SHOW_CHECKLIST
echo.
echo ===============================================
echo   Post-Deployment Checklist
echo ===============================================
echo.
echo Backend Environment Variables:
echo   [_] NODE_ENV=production
echo   [_] MONGODB_URI=^<your-mongodb-uri^>
echo   [_] CORS_ORIGIN=^<frontend-url^>
echo.
echo Frontend Environment Variables:
echo   [_] NODE_ENV=production
echo   [_] VITE_API_URL=^<backend-url^>
echo.
echo Testing:
echo   [_] Backend health endpoint responds: /health
echo   [_] Frontend loads successfully
echo   [_] API calls work from frontend to backend
echo   [_] District selection updates data
echo   [_] Charts render correctly
echo   [_] Mobile responsive design works
echo   [_] No console errors
echo.
echo Deployment URLs:
echo   Backend:  https://your-backend.railway.app
echo   Frontend: https://your-frontend.railway.app
echo.
echo Need help? Check RAILWAY_DEPLOYMENT.md for detailed guide
echo.
exit /b 0
