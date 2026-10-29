@echo off
chcp 65001 >nul
title DONG BO CODE LEN GITHUB VA NETLIFY (TU DONG DOI VERSION CHONG CACHE SAFARI)

echo ========================================================
echo   DANG DONG BO VA DAY CODE LEN GITHUB / NETLIFY...
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/4] Tu dong cap nhat ma phien ban (Version Query) vao file CSS/JS de chong cache Safari...
if exist "update_version.ps1" (
    powershell -NoProfile -ExecutionPolicy Bypass -File update_version.ps1
)

echo.
echo [2/4] Dang kiem tra va gom toan bo file da sua...
git add .

echo.
echo [3/4] Dang tao ban ghi commit kem ngay gio...
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value 2^>nul') do set dt=%%I
if defined dt (
    set commit_msg=Cap nhat code - %dt:~0,4%/%dt:~4,2%/%dt:~6,2% %dt:~8,2%:%dt:~10,2%:%dt:~12,2%
) else (
    set commit_msg=Cap nhat code - %date% %time%
)

git commit -m "%commit_msg%"

echo.
echo [4/4] Dang day len GitHub (Netlify se tu dong cap nhat)...
git push origin main

if %ERRORLEVEL% EQU 0 goto :success
goto :fail

:success
echo.
echo ========================================================
echo   THANH CONG! NETLIFY SE CAP NHAT WEB TRONG 15-30 GIAY!
echo   SAFARI SE TU DONG TAI FILE CSS VA JS MOI NHAT!
echo ========================================================
echo.
echo Cua so se tu dong dong sau 3 giay...
timeout /t 3 /nobreak >nul 2>nul || ping -n 4 127.0.0.1 >nul
exit /b 0

:fail
echo.
echo ========================================================
echo   CO LOI TRONG QUA TRINH DAY CODE! XIN KIEM TRA LAI.
echo ========================================================
echo.
pause
exit /b 1