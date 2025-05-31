# TasteBite Backend

## Описание
Backend для системы управления рестораном TasteBite на Express.js + Sequelize + PostgreSQL.

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте базу данных PostgreSQL:
```sql
CREATE DATABASE tastebite_db;
```

3. Настройте переменные окружения в файле `.env` (уже создан)

4. Запустите миграции и заполните БД тестовыми данными:
```bash
npm run seed
```

5. Запустите сервер:
```bash
npm run dev
```

## API Endpoints

### Аутентификация
- POST `/api/auth/register` - Регистрация
- POST `/api/auth/login` - Вход
- GET `/api/auth/profile` - Профиль (требует токен)
- PUT `/api/auth/profile` - Обновить профиль

### Категории
- GET `/api/categories` - Все категории
- GET `/api/categories/:id` - Категория с блюдами
- POST `/api/categories` - Создать (admin)
- PUT `/api/categories/:id` - Обновить (admin)
- DELETE `/api/categories/:id` - Удалить (admin)

### Меню
- GET `/api/menu` - Все блюда
- GET `/api/menu/:id` - Одно блюдо
- POST `/api/menu` - Создать (staff/admin)
- PUT `/api/menu/:id` - Обновить (staff/admin)
- PATCH `/api/menu/:id/availability` - Изменить доступность
- DELETE `/api/menu/:id` - Удалить (admin)

### Заказы
- GET `/api/orders/my` - Мои заказы
- GET `/api/orders` - Все заказы (staff/admin)
- GET `/api/orders/:id` - Один заказ
- POST `/api/orders` - Создать заказ
- PATCH `/api/orders/:id/status` - Изменить статус (staff/admin)
- POST `/api/orders/:id/cancel` - Отменить заказ

### Бронирования
- GET `/api/bookings/my` - Мои бронирования
- GET `/api/bookings` - Все бронирования (staff/admin)
- GET `/api/bookings/:id` - Одно бронирование
- POST `/api/bookings` - Создать бронирование
- PATCH `/api/bookings/:id/status` - Изменить статус (staff/admin)
- POST `/api/bookings/:id/cancel` - Отменить бронирование
- GET `/api/bookings/available-times` - Доступное время

### Пользователи (admin)
- GET `/api/users` - Все пользователи
- GET `/api/users/stats` - Статистика
- GET `/api/users/:id` - Один пользователь
- PATCH `/api/users/:id/role` - Изменить роль
- PATCH `/api/users/:id/status` - Изменить статус
- POST `/api/users/:id/bonus-points` - Добавить баллы

### Статистика (admin)
- GET `/api/stats/sales` - Статистика продаж
- GET `/api/stats/popular-items` - Популярные блюда
- GET `/api/stats/categories` - По категориям
- GET `/api/stats/customers` - По клиентам
- GET `/api/stats/order-times` - По времени заказов

## Тестовые аккаунты
- Администратор: admin@tastebite.com / admin123
- Сотрудник: staff@tastebite.com / staff123
- Клиент: client@tastebite.com / client123
