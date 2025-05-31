#!/bin/bash

echo "🚀 TasteBite - Установка и настройка"
echo "===================================="

# Проверка Node.js
if ! command -v node &> /dev/null
then
    echo "❌ Node.js не установлен. Пожалуйста, установите Node.js версии 16 или выше."
    exit 1
fi

echo "✅ Node.js найден: $(node -v)"

# Backend setup
echo ""
echo "📦 Установка зависимостей Backend..."
cd backend
npm install

echo ""
echo "🔧 Настройка окружения Backend..."
if [ ! -f .env ]; then
    cp .env.example .env 2>/dev/null || echo "⚠️  Файл .env уже существует или .env.example не найден"
fi

echo ""
echo "📊 Запуск миграций и заполнение БД..."
echo "⚠️  Убедитесь, что PostgreSQL запущен и база данных 'tastebite_db' создана"
echo "Нажмите Enter для продолжения или Ctrl+C для отмены..."
read

npm run seed

# Frontend setup
echo ""
echo "📦 Установка зависимостей Frontend..."
cd ../frontend
npm install

echo ""
echo "✅ Установка завершена!"
echo ""
echo "🎯 Для запуска приложения:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "📧 Тестовые аккаунты:"
echo "Администратор: admin@tastebite.com / admin123"
echo "Сотрудник: staff@tastebite.com / staff123"
echo "Клиент: client@tastebite.com / client123"
