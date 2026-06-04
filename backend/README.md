# SportTrainer API

REST API для демонстрационного экзамена «СпортТренер»: аутентификация, профили, каталог тренеров, заявки на тренировки и специализации.

Стек: Express, SQLite, Sequelize, JWT.

## Установка и запуск

```bash
cd DE/backend
npm install
npm run migrate
npm run seed
npm start
```

Сервер: **http://localhost:3010** (или `PORT` из `.env`).

## Тестовые пользователи

| Роль | Email | Пароль |
|------|-------|--------|
| Тренер | trainer@mail.ru | Trainer123 |
| Клиент | client@mail.ru | NewClient123 |

## Эндпоинты

Заголовок для защищённых маршрутов: `Authorization: Bearer <accessToken>`.

### Auth
- `POST /auth/register` — `{ email, password, name, role? }`
- `POST /auth/login` — `{ email, password }`
- `GET /auth/refresh` — refresh-токен в query, body или Authorization
- `POST /auth/refresh` — `{ refreshToken }`
- `POST /auth/logout` — выход

### Профиль
- `GET /profile/me` — текущий пользователь
- `PUT /profile/me` — обновление профиля
- `DELETE /profile/:id` — удаление аккаунта

### Тренеры
- `GET /trainers?specializationId=&clientLevels=&sortBy=rating&sortOrder=desc&limit=20&offset=0`
- `GET /trainers/:id` — профиль тренера

### Заявки
- `GET /bookings?search=` — список заявок (клиент/тренер)
- `POST /bookings` — `{ trainerId, date, time, comment }` (клиент)
- `PATCH /bookings/:id` — `{ status: "cancelled" | "accepted" | "rejected" }`

### Специализации
- `GET /specializations?search=` — список специализаций
- `POST /specializations` — `{ name }` (тренер)
- `POST /specialization/selected` — `{ specializationIds: [1, 2] }` (тренер)
- `DELETE /specialization/selected` — `{ specializationIds: [1] }` (тренер)

## Уровни клиентов

Значения для поля `clientLevels`: `beginner`, `advanced`, `professional`, `online`.

## Статусы заявок

`pending`, `accepted`, `rejected`, `cancelled`
