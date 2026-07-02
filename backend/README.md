# MediBook API

REST API для демонстрационного задания «Система бронирования визитов к врачу»: аутентификация, профили, каталог врачей, записи на приём, специализации.

Стек: Express, SQLite, Sequelize, JWT.

## Установка и запуск

```bash
cd DE3/backend
npm install
npm run migrate
npm run seed
npm start
```

Сервер: **http://localhost:3030** (или `PORT` из `.env`).

## Тестовые пользователи

| Роль | Email | Пароль |
|------|-------|--------|
| Врач | doctor@mail.ru | Doctor123 |
| Пациент | patient@mail.ru | Patient123 |

## Авторизация

```
Authorization: Bearer <accessToken>
```

---

## Эндпоинты

### Auth — `/auth`

#### `POST /auth/register`
Регистрация. Поля: `email`, `password` (6–12), `name` (5–20), `role` (`patient` | `doctor`).

#### `POST /auth/login`
Вход. Поля: `email`, `password`.

#### `GET|POST /auth/refresh`
Обновление access-токена. Refresh-токен в query, body или Authorization.

#### `POST /auth/logout`
Выход. Требует JWT.

---

### Profile — `/profile`

#### `GET /profile/me`
Профиль текущего пользователя.

**Ответ (doctor):**
```json
{
  "id": 1,
  "email": "doctor@mail.ru",
  "name": "ИванПетров",
  "role": "doctor",
  "about": "...",
  "photo": "https://...",
  "price": 2500,
  "rating": 4.9,
  "contacts": "+7 (999) 123-45-67",
  "visitFormats": ["in_person", "online"],
  "specializations": [{ "id": 1, "name": "Терапевт" }]
}
```

#### `PUT /profile/me`
Обновление профиля. Для doctor дополнительно: `about`, `photo`, `price`, `rating`, `contacts`, `visitFormats`.

#### `DELETE /profile/:id`
Удаление своего аккаунта.

---

### Doctors — `/doctors`

#### `GET /doctors`
Каталог врачей с фильтрацией.

| Параметр | Описание |
|----------|----------|
| `specializationId` | ID специализации |
| `visitFormats` / `visitFormat` | `in_person`, `online` (через запятую) |
| `ratingMin` | Минимальный рейтинг |
| `priceMin`, `priceMax` | Диапазон стоимости |
| `sortBy` | `price` или `rating` |
| `sortOrder` | `asc` или `desc` |
| `limit` | 1–20 (по умолчанию 20) |
| `offset` | Пагинация |
| `search` | Поиск по ФИО |

**Ответ `200`:**
```json
{
  "items": [{
    "id": 1,
    "name": "ИванПетров",
    "photo": "https://...",
    "price": 2500,
    "rating": 4.9,
    "specialization": "Терапевт",
    "specializations": [{ "id": 1, "name": "Терапевт" }],
    "visitFormats": ["in_person", "online"],
    "about": "...",
    "contacts": "+7 (999) 123-45-67"
  }],
  "total": 2,
  "limit": 20,
  "offset": 0
}
```

#### `GET /doctors/:id`
Детальная информация о враче.

---

### Appointments — `/appointments`

Все маршруты требуют JWT.

#### `GET /appointments?search=`
- **patient** — свои записи, поиск по имени врача
- **doctor** — заявки на приём, поиск по имени пациента

#### `POST /appointments` (patient)
```json
{
  "doctorId": 1,
  "date": "2026-08-01",
  "time": "11:00",
  "format": "in_person",
  "comment": "Плановый осмотр"
}
```

#### `PATCH /appointments/:id`
| Роль | Статус | Условие |
|------|--------|---------|
| patient | `cancelled` | только `pending` |
| doctor | `confirmed` / `rejected` | только `pending` |

---

### Specializations — `/specializations`

#### `GET /specializations?search=`
Список специализаций. Для doctor — поле `selected: true/false`.

#### `POST /specializations` (doctor)
```json
{ "name": "Офтальмолог" }
```

#### `POST /specializations/selected` (doctor)
```json
{ "specializationIds": [1, 2] }
```

#### `DELETE /specializations/selected` (doctor)
```json
{ "specializationIds": [2] }
```

---

## Справочники

### Форматы приёма (`visitFormats`, `format`)
| Значение | Описание |
|----------|----------|
| `in_person` | Очно |
| `online` | Онлайн |

### Статусы записей (`status`)
| Значение | UI |
|----------|-----|
| `pending` | ожидание |
| `confirmed` | подтверждено |
| `rejected` | отклонено |
| `cancelled` | отменено пациентом |

---

## Postman

Импорт: `postman/MediBook-API.postman_collection.json`

Переменные: `baseUrl`, `accessToken`, `refreshToken` — токены сохраняются после Login.
