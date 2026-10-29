@echo off
chcp 65001 >nul
title DONG BO CODE LEN GITHUB VA NETLIFY

echo ========================================================
echo   DANG DONG BO VA DAY CODE LEN GITHUB / NETLIFY...
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Dang kiem tra va gom toan bo file da sua...
git add .

echo [2/3] Dang tao ban ghi commit kem ngay gio...
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value 2^>nul') do set dt=%%I
if defined dt (
    set commit_msg=Cap nhat code - %dt:~0,4%/%dt:~4,2%/%dt:~6,2% %dt:~8,2%:%dt:~10,2%:%dt:~12,2%
) else (
    set commit_msg=Cap nhat code - %date% %time%
)

git commit -m "%commit_msg%"

echo [3/3] Dang day len GitHub (Netlify se tu dong cap nhat)...
git push origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   THANH CONG! NETLIFY SE CAP NHAT WEB TRONG 15-30 GIAY!
    echo ========================================================
) else (
    echo ========================================================
    echo   CO LOI TRONG QUA TRINH DAY CODE! XIN KIEM TRA LAI.
    echo ========================================================
)
echo.
pause
