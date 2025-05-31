#!/bin/bash

echo "🚀 Запуск TasteBite..."
echo ""

# Функция для запуска сервера в новом терминале
start_server() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        osascript -e "tell app \"Terminal\" to do script \"cd $1 && $2\""
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal -- bash -c "cd $1 && $2; exec bash"
        elif command -v xterm &> /dev/null; then
            xterm -e "cd $1 && $2; exec bash" &
        else
            echo "⚠️  Не найден подходящий терминал. Запустите серверы вручную:"
            echo "   Backend: cd backend && npm run dev"
            echo "   Frontend: cd frontend && npm run dev"
            exit 1
        fi
    fi
}

echo "📦 Запуск Backend сервера..."
start_server "$(pwd)/backend" "npm run dev"

echo "🎨 Запуск Frontend приложения..."
start_server "$(pwd)/frontend" "npm run dev"

echo ""
echo "✅ Приложение запущено!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo ""
echo "Для остановки закройте окна терминалов."
