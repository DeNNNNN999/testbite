@echo off
echo 🚀 TasteBite - Установка и настройка
echo ====================================

REM Проверка Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js не установлен. Пожалуйста, установите Node.js версии 16 или выше.
    pause
    exit /b 1
)

echo ✅ Node.js найден:
node -v

REM Backend setup
echo.
echo 📦 Установка зависимостей Backend...
cd backend
call npm install

echo.
echo 🔧 Настройка окружения Backend...
if not exist .env (
    echo Создаем файл .env...
    echo ⚠️  Не забудьте настроить параметры подключения к БД в файле backend\.env
)

echo.
echo 📊 Запуск миграций и заполнение БД...
echo ⚠️  Убедитесь, что PostgreSQL запущен и база данных 'tastebite_db' создана
echo Нажмите любую клавишу для продолжения или закройте окно для отмены...
pause >nul

call npm run seed

REM Frontend setup
echo.
echo 📦 Установка зависимостей Frontend...
cd ..\frontend
call npm install

echo.
echo ✅ Установка завершена!
echo.
echo 🎯 Для запуска приложения откройте два терминала:
echo 1. Backend: cd backend и npm run dev
echo 2. Frontend: cd frontend и npm run dev
echo.
echo 📧 Тестовые аккаунты:
echo Администратор: admin@tastebite.com / admin123
echo Сотрудник: staff@tastebite.com / staff123
echo Клиент: client@tastebite.com / client123
echo.
pause
