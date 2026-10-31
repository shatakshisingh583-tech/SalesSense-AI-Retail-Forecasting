@echo off
setlocal
cd /d "%~dp0"

echo ========================================================
echo   SalesSense AI - Retail Sales Forecasting & Analytics
echo   CSE3141 Predictive Analytics Mini Project
echo   Manipal University Jaipur (MUJ)
echo ========================================================
echo Current Directory: %CD%
echo.

echo [1/2] Starting Python Flask REST API on http://127.0.0.1:5000 ...
start "SalesSense Backend (Flask)" cmd /k "cd /d "%~dp0" && python backend\app.py"

echo Waiting for backend to initialize...
timeout /t 3 /nobreak >nul

echo [2/2] Starting React + Vite Frontend on http://localhost:3000 ...
start "SalesSense Frontend (Vite React)" cmd /k "cd /d "%~dp0\frontend" && npm run dev"

echo.
echo ========================================================
echo   Both servers are launching in two separate windows!
echo   Wait a few seconds for Vite to say "ready in ... ms"
echo   Then open your browser at:
echo   --^> http://localhost:3000
echo ========================================================
echo.
pause
