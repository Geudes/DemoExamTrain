# MusicLesson API

REST API для демонстрационного экзамена «МузыкаУрок»: аутентификация, профили, каталог преподавателей, заявки на уроки и справочник инструментов.

Стек: Express, SQLite, Sequelize, JWT.

## Установка и запуск

```bash
cd backend
npm install
npm run migrate
npm run seed
npm start
```

Сервер: **http://localhost:3010** (или `PORT` из `.env`).

## Тестовые пользователи

| Роль | Email | Пароль |
|------|-------|--------|
| Преподаватель | teacher@mail.ru | Teacher123 |
| Ученик | student@mail.ru | NewStudent123 |

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

### Преподаватели
- `GET /teachers?instrumentId=&studentLevels=&sortBy=rating&sortOrder=desc&limit=20&offset=0`
- `GET /teachers/:id` — профиль преподавателя

### Заявки на уроки
- `GET /lessons?search=` — список заявок (ученик/преподаватель)
- `POST /lessons` — `{ teacherId, date, time, comment }` (ученик)
- `PATCH /lessons/:id` — `{ status: "cancelled" | "accepted" | "rejected" }`

### Инструменты
- `GET /instruments?search=` — список инструментов
- `POST /instruments` — `{ name }` (преподаватель)
- `POST /instrument/selected` — `{ instrumentIds: [1, 2] }` (преподаватель)
- `DELETE /instrument/selected` — `{ instrumentIds: [1] }` (преподаватель)

## Уровни учеников

Значения для поля `studentLevels`: `beginner`, `advanced`, `professional`, `online`.

## Статусы заявок

`pending`, `accepted`, `rejected`, `cancelled`
