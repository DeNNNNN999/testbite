@echo off
echo 🚀 Запуск TasteBite...
echo.

echo 📦 Запуск Backend сервера...
cd backend
start cmd /k "npm run dev"

echo 🎨 Запуск Frontend приложения...
cd ../frontend
start cmd /k "npm run dev"

echo.
echo ✅ Приложение запущено!
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:5000
echo.
echo Для остановки закройте окна терминалов.
pause
