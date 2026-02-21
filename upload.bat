@echo off
title Mansoor Channa Photo Uploader
color 0A

echo ================================================
echo     🖼️  MANSOOR CHANNA PHOTOGRAPHY UPLOADER
echo ================================================
echo.

:: Check if D: drive exists
if not exist D:\ (
    echo ❌ ERROR: D: drive not found!
    echo.
    echo Please make sure you have a D: drive.
    echo.
    pause
    exit
)

:: Create folder if it doesn't exist
if not exist "D:\Mansoor-Photos\" (
    echo 📁 Creating folder D:\Mansoor-Photos\...
    mkdir "D:\Mansoor-Photos\"
)

echo 📂 Source folder: %CD%
echo 📂 Destination: D:\Mansoor-Photos\
echo.

:: Count files before copying
set count=0
for %%f in (*.jpg *.jpeg *.png *.gif *.mp4 *.mov *.avi) do set /a count+=1

if %count%==0 (
    echo ⚠️  No photos or videos found in this folder!
    echo.
    echo Please put your files in: %CD%
    echo.
    pause
    exit
)

echo Found %count% files to upload...
echo.
echo Copying files... (please wait)
echo.

:: Copy photos
echo 📷 Photos:
copy "*.jpg" "D:\Mansoor-Photos\" >nul 2>&1 && echo   ✅ JPG files copied
copy "*.jpeg" "D:\Mansoor-Photos\" >nul 2>&1 && echo   ✅ JPEG files copied
copy "*.png" "D:\Mansoor-Photos\" >nul 2>&1 && echo   ✅ PNG files copied
copy "*.gif" "D:\Mansoor-Photos\" >nul 2>&1 && echo   ✅ GIF files copied

:: Copy videos
echo.
echo 🎥 Videos:
copy "*.mp4" "D:\Mansoor-Photos\" >nul 2>&1 && echo   ✅ MP4 files copied
copy "*.mov" "D:\Mansoor-Photos\" >nul 2>&1 && echo   ✅ MOV files copied
copy "*.avi" "D:\Mansoor-Photos\" >nul 2>&1 && echo   ✅ AVI files copied

echo.
echo ================================================
echo ✅ UPLOAD COMPLETE!
echo ================================================
echo.
echo Files saved to: D:\Mansoor-Photos\
echo.
dir "D:\Mansoor-Photos\" /b | find /c /v "" > temp.txt
set /p total=<temp.txt
del temp.txt
echo Total files in destination: %total%
echo.
echo Press any key to open the destination folder...
pause >nul

:: Open the folder
explorer "D:\Mansoor-Photos\"

exit