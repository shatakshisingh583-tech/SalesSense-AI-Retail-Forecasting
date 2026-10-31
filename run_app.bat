@echo off
echo ========================================================
echo   SalesSense AI - Retail Sales Forecasting & Analytics
echo   CSE3141 Predictive Analytics Mini Project
echo   Manipal University Jaipur (MUJ)
echo ========================================================
echo.

echo [1/2] Starting Python Flask REST API on http://127.0.0.1:5000 ...
start "SalesSense Backend" cmd /k "python backend\app.py"

timeout /t 3 /nobreak >nul

echo [2/2] Starting React + Vite Frontend on http://localhost:3000 ...
start "SalesSense Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo   Both services launched successfully!
echo   Open your browser at: http://localhost:3000
echo ========================================================
