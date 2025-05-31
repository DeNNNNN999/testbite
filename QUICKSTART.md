# 🚀 Быстрый старт TasteBite

## 📋 Требования
- Node.js 16+
- PostgreSQL 16
- Git

## 🛠 Установка за 5 минут

### 1. Создайте базу данных
```sql
CREATE DATABASE tastebite_db;
```

### 2. Клонируйте проект
```bash
cd C:\Users\admin\Desktop\mcp-workspace\projects\desktop
cd tastebite
```

### 3. Запустите установку

#### Windows:
```bash
setup.bat
```

#### Linux/Mac:
```bash
chmod +x setup.sh
./setup.sh
```

### 4. Запустите приложение

#### Windows:
```bash
start.bat
```

#### Linux/Mac:
```bash
chmod +x start.sh
./start.sh
```

## 🌐 Доступ к приложению

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 👤 Тестовые аккаунты

| Роль | Email | Пароль |
|------|-------|--------|
| Администратор | admin@tastebite.com | admin123 |
| Сотрудник | staff@tastebite.com | staff123 |
| Клиент | client@tastebite.com | client123 |

## 🎯 Что посмотреть в первую очередь

### Как клиент:
1. Зайдите в меню и добавьте блюда в корзину
2. Оформите заказ с доставкой
3. Забронируйте столик
4. Проверьте личный кабинет

### Как сотрудник:
1. Посмотрите панель управления
2. Измените статус заказа
3. Отметьте блюдо как недоступное
4. Подтвердите бронирование

### Как администратор:
1. Изучите дашборд с аналитикой
2. Добавьте нового сотрудника
3. Создайте промо-акцию
4. Посмотрите детальные отчеты

## ❓ Проблемы?

1. **База данных не подключается**
   - Проверьте настройки в `backend/.env`
   - Убедитесь, что PostgreSQL запущен

2. **Порты заняты**
   - Frontend: измените порт в `frontend/vite.config.js`
   - Backend: измените PORT в `backend/.env`

3. **npm install завис**
   - Удалите `node_modules` и `package-lock.json`
   - Запустите установку заново

## 📞 Поддержка

Создайте issue в репозитории или свяжитесь с автором.

---
**Приятного использования TasteBite! 🍽️**
