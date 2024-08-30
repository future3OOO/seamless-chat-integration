@echo off
echo Installing dependencies...
"C:\Python312\python.exe" -m pip install flask flask-cors selenium

echo Building React app...
npm run build

echo Starting Flask server...
"C:\Python312\python.exe" app.py
pause
