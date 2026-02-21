@echo off
echo Copying photos from Desktop to D: drive...
xcopy "%USERPROFILE%\Desktop\mansoor-website\*.jpg" "D:\Mansoor-Photos\" /y
xcopy "%USERPROFILE%\Desktop\mansoor-website\*.png" "D:\Mansoor-Photos\" /y
xcopy "%USERPROFILE%\Desktop\mansoor-website\*.mp4" "D:\Mansoor-Photos\" /y
echo Done!
pause