# HomeRent API

REST API для демонстрационного задания «Сервис аренды жилья»: аутентификация, профили, каталог объектов, бронирования.

Стек: Express, SQLite, Sequelize, JWT.

## Установка и запуск

```bash
cd DE2/backend
npm install
npm run migrate
npm run seed
npm start
```

Сервер: **http://localhost:3020** (или `PORT` из `.env`).

## Тестовые пользователи

| Роль | Email | Пароль |
|------|-------|--------|
| Владелец | owner@mail.ru | Owner123 |
| Арендатор | tenant@mail.ru | Tenant123 |

## Авторизация

Для защищённых маршрутов передавайте JWT access-токен в заголовке:

```
Authorization: Bearer <accessToken>
```

Токены выдаются при регистрации и входе. Access-токен живёт 15 минут (настраивается в `.env`), refresh-токен — 7 дней.

---

## Эндпоинты

### Служебные

#### `GET /health`

Проверка работоспособности сервера.

**Доступ:** все  
**Заголовки:** не требуются

**Ответ `200`:**
```json
{ "status": "ok" }
```

---

#### `GET /`

Список доступных групп эндпоинтов.

**Доступ:** все

**Ответ `200`:**
```json
{
  "message": "HomeRent API",
  "endpoints": { ... }
}
```

---

### Auth — `/auth`

#### `POST /auth/register`

Регистрация нового пользователя.

**Доступ:** guest (неавторизованный)  
**Content-Type:** `application/json`

**Тело запроса:**

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `email` | string | да | Email, формат `user@mail.ru` |
| `password` | string | да | От 6 до 12 символов |
| `name` | string | да | От 5 до 20 символов |
| `role` | string | да | `tenant` или `owner` |

**Пример запроса:**
```json
{
  "email": "newuser@mail.ru",
  "password": "Pass1234",
  "name": "ПётрАрендатор",
  "role": "tenant"
}
```

**Ответ `201`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 3,
    "email": "newuser@mail.ru",
    "name": "ПётрАрендатор",
    "role": "tenant"
  }
}
```

**Ошибки:**
- `400` — невалидные данные, email уже занят
- `500` — внутренняя ошибка

---

#### `POST /auth/login`

Вход в систему.

**Доступ:** guest  
**Content-Type:** `application/json`

**Тело запроса:**

| Поле | Тип | Обязательно |
|------|-----|-------------|
| `email` | string | да |
| `password` | string | да |

**Пример запроса:**
```json
{
  "email": "tenant@mail.ru",
  "password": "Tenant123"
}
```

**Ответ `200`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 2,
    "email": "tenant@mail.ru",
    "name": "АннаАрендатор",
    "role": "tenant"
  }
}
```

**Ошибки:**
- `400` — не переданы email/password
- `401` — неверный логин или пароль (`{ "error": "Invalid credentials" }`)

---

#### `GET /auth/refresh`

Обновление access-токена по refresh-токену.

**Доступ:** tenant, owner  
**Refresh-токен** передаётся одним из способов:
- query: `?refreshToken=<token>`
- body: `{ "refreshToken": "<token>" }`
- заголовок: `Authorization: Bearer <refreshToken>`

**Ответ `200`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Ошибки:**
- `400` — refresh-токен не передан
- `401` — токен недействителен или истёк

---

#### `POST /auth/refresh`

Аналог `GET /auth/refresh`, удобнее для Postman (тело JSON).

**Тело запроса:**
```json
{ "refreshToken": "eyJhbGciOiJIUzI1NiIs..." }
```

---

#### `POST /auth/logout`

Выход из системы (удаление всех refresh-токенов пользователя).

**Доступ:** tenant, owner  
**Заголовки:** `Authorization: Bearer <accessToken>`

**Ответ `200`:**
```json
{ "message": "Logged out successfully" }
```

---

### Профиль — `/profile`

Все маршруты требуют `Authorization: Bearer <accessToken>`.

#### `GET /profile/me`

Получить профиль текущего пользователя.

**Доступ:** tenant, owner

**Ответ `200` (tenant):**
```json
{
  "id": 2,
  "email": "tenant@mail.ru",
  "name": "АннаАрендатор",
  "role": "tenant"
}
```

**Ответ `200` (owner):**
```json
{
  "id": 1,
  "email": "owner@mail.ru",
  "name": "ИванВладелец",
  "role": "owner",
  "phone": "+7 (999) 111-22-33",
  "description": "Сдаю уютное жильё...",
  "avatar": "https://images.unsplash.com/..."
}
```

---

#### `PUT /profile/me`

Обновить профиль. Передаются только изменяемые поля.

**Доступ:** tenant, owner  
**Content-Type:** `application/json`

**Поля для tenant:**

| Поле | Тип | Валидация |
|------|-----|-----------|
| `name` | string | 5–20 символов |
| `email` | string | уникальный email |
| `password` | string | 6–12 символов (пустая строка — не менять) |

**Дополнительные поля для owner:**

| Поле | Тип | Описание |
|------|-----|----------|
| `phone` | string | Телефон |
| `description` | string | Описание владельца |
| `avatar` | string | URL аватара |

**Пример (owner):**
```json
{
  "name": "ИванВладелец",
  "email": "owner@mail.ru",
  "phone": "+7 (999) 000-00-00",
  "description": "Надёжный арендодатель",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Ответ `200`:** обновлённый объект пользователя (как в `GET /profile/me`).

---

#### `DELETE /profile/:id`

Удалить аккаунт. Можно удалить только свой (`id` = id текущего пользователя).

**Доступ:** tenant, owner  
**Параметры пути:** `id` — числовой id пользователя

**Ответ `200`:**
```json
{ "message": "Account deleted successfully" }
```

**Ошибки:**
- `403` — попытка удалить чужой аккаунт
- `400` — невалидный id

---

### Объекты жилья — `/apartments`

#### `GET /apartments`

Каталог объектов с фильтрацией и сортировкой.

**Доступ:** все (для `mine=true` нужен owner + JWT)

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `city` | string | Точное совпадение города |
| `type` | string | `apartment`, `studio`, `house`, `room` |
| `rooms` | number | Количество комнат |
| `priceMin` | number | Минимальная цена за ночь |
| `priceMax` | number | Максимальная цена за ночь |
| `sortBy` | string | `price` или `rating` |
| `sortOrder` | string | `asc` или `desc` (по умолчанию `asc` для price, `desc` для rating) |
| `limit` | number | 1–20, по умолчанию 20 |
| `offset` | number | Смещение для пагинации |
| `search` | string | Поиск по названию |
| `mine` | string | `true` — все объявления текущего owner (включая черновики) |

**Пример:** `GET /apartments?city=Москва&type=apartment&sortBy=price&sortOrder=asc&limit=10`

**Ответ `200`:**
```json
{
  "items": [
    {
      "id": 1,
      "title": "Светлая квартира у метро",
      "city": "Москва",
      "type": "apartment",
      "pricePerNight": 4500,
      "rating": 4.8,
      "shortDescription": "Двухкомнатная квартира рядом с метро",
      "photo": "https://images.unsplash.com/...",
      "photos": ["https://..."],
      "rooms": 2,
      "maxGuests": 4,
      "published": true
    }
  ],
  "total": 4,
  "limit": 20,
  "offset": 0
}
```

> Без `mine=true` возвращаются только опубликованные объявления (`published: true`).

---

#### `GET /apartments/:id`

Детальная информация об объекте.

**Доступ:** все  
**Параметры пути:** `id` — id объекта

**Ответ `200`:**
```json
{
  "id": 1,
  "title": "Светлая квартира у метро",
  "type": "apartment",
  "city": "Москва",
  "address": "ул. Тверская, 12",
  "description": "Просторная двухкомнатная квартира...",
  "pricePerNight": 4500,
  "rooms": 2,
  "maxGuests": 4,
  "amenities": ["Wi-Fi", "Кухня", "Стиральная машина"],
  "photos": ["https://..."],
  "published": true,
  "rating": 4.8,
  "owner": {
    "id": 1,
    "name": "ИванВладелец",
    "email": "owner@mail.ru",
    "phone": "+7 (999) 111-22-33",
    "description": "Сдаю уютное жильё...",
    "avatar": "https://..."
  },
  "ownerId": 1,
  "createdAt": "2026-06-08T10:16:36.820Z",
  "updatedAt": "2026-06-08T10:16:36.820Z"
}
```

**Ошибки:**
- `404` — объект не найден или не опубликован (для чужих пользователей)

---

#### `POST /apartments`

Создать объявление.

**Доступ:** owner  
**Заголовки:** `Authorization: Bearer <accessToken>`  
**Content-Type:** `application/json`

**Тело запроса:**

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `title` | string | да | Название |
| `type` | string | да | `apartment` / `studio` / `house` / `room` |
| `city` | string | да | Город |
| `address` | string | да | Адрес |
| `description` | string | да | Полное описание |
| `pricePerNight` | number | да | Цена за ночь (> 0) |
| `rooms` | number | да | Комнаты (целое > 0) |
| `maxGuests` | number | да | Макс. гостей (целое > 0) |
| `shortDescription` | string | нет | Краткое описание для карточки |
| `amenities` | string[] | нет | Удобства |
| `photos` | string[] | нет | URL фотографий |
| `published` | boolean | нет | Статус публикации (по умолчанию `true`) |
| `rating` | number | нет | Рейтинг (по умолчанию `0`) |

**Пример:**
```json
{
  "title": "Новая квартира",
  "type": "apartment",
  "city": "Москва",
  "address": "ул. Примерная, 1",
  "description": "Описание объекта",
  "pricePerNight": 5000,
  "rooms": 2,
  "maxGuests": 4,
  "amenities": ["Wi-Fi", "Кухня"],
  "photos": ["https://example.com/photo.jpg"],
  "published": true
}
```

**Ответ `201`:** объект как в `GET /apartments/:id`.

---

#### `PUT /apartments/:id`

Обновить объявление. Можно менять только свои объекты.

**Доступ:** owner  
**Параметры пути:** `id` — id объекта  
**Тело:** те же поля, что при создании (все опциональны)

**Ответ `200`:** обновлённый объект.

**Ошибки:**
- `403` — чужое объявление
- `404` — не найдено

---

#### `DELETE /apartments/:id`

Удалить объявление.

**Доступ:** owner  

**Ответ `200`:**
```json
{ "message": "Apartment deleted successfully" }
```

---

### Бронирования — `/bookings`

Все маршруты требуют `Authorization: Bearer <accessToken>`.

#### `GET /bookings`

Список бронирований.

**Доступ:** tenant, owner

**Query-параметры:**

| Параметр | Описание |
|----------|----------|
| `search` | tenant — поиск по названию объекта; owner — по имени арендатора или названию объекта |

**Поведение по ролям:**
- **tenant** — только свои заявки
- **owner** — заявки на свои объекты

**Ответ `200`:**
```json
[
  {
    "id": 1,
    "checkIn": "2026-06-15",
    "checkOut": "2026-06-20",
    "guests": 2,
    "comment": "Приедем вечером",
    "status": "pending",
    "tenant": {
      "id": 2,
      "name": "АннаАрендатор",
      "email": "tenant@mail.ru"
    },
    "apartment": {
      "id": 1,
      "title": "Светлая квартира у метро",
      "city": "Москва"
    },
    "createdAt": "2026-06-08T10:16:36.825Z",
    "updatedAt": "2026-06-08T10:16:36.825Z"
  }
]
```

---

#### `POST /bookings`

Создать заявку на бронирование.

**Доступ:** tenant  
**Content-Type:** `application/json`

**Тело запроса:**

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `apartmentId` | number | да | id объекта |
| `checkIn` | string | да | Дата заезда `YYYY-MM-DD` |
| `checkOut` | string | да | Дата выезда `YYYY-MM-DD` |
| `guests` | number | да | Количество гостей (> 0) |
| `comment` | string | да | Комментарий |

**Пример:**
```json
{
  "apartmentId": 1,
  "checkIn": "2026-07-01",
  "checkOut": "2026-07-05",
  "guests": 2,
  "comment": "Приедем после 18:00"
}
```

**Ответ `201`:** созданное бронирование, статус `pending`.

**Ошибки:**
- `400` — дата выезда раньше заезда, превышен лимит гостей, бронирование своего объекта
- `404` — объект не найден или не опубликован

---

#### `PATCH /bookings/:id`

Изменить статус бронирования.

**Доступ:** tenant, owner  
**Параметры пути:** `id` — id бронирования

**Тело запроса:**
```json
{ "status": "cancelled" }
```

**Допустимые статусы по ролям:**

| Роль | Статус | Условие |
|------|--------|---------|
| tenant | `cancelled` | только свои, только если `pending` |
| owner | `confirmed` | заявки на свои объекты, только если `pending` |
| owner | `rejected` | заявки на свои объекты, только если `pending` |

**Ответ `200`:** обновлённое бронирование.

---

## Справочники

### Типы жилья (`type`)

| Значение | Описание |
|----------|----------|
| `apartment` | Квартира |
| `studio` | Студия |
| `house` | Дом |
| `room` | Комната |

### Статусы бронирований (`status`)

| Значение | UI | Описание |
|----------|-----|----------|
| `pending` | ожидание (оранжевый) | Новая заявка |
| `confirmed` | подтверждено (зелёный) | Подтверждено владельцем |
| `rejected` | отклонено (красный) | Отклонено владельцем |
| `cancelled` | — | Отменено арендатором |

---

## Postman

Импортируйте коллекцию из файла:

```
postman/HomeRent-API.postman_collection.json
```

### Переменные коллекции

| Переменная | Значение по умолчанию | Описание |
|------------|----------------------|----------|
| `baseUrl` | `http://localhost:3020` | Базовый URL API |
| `accessToken` | — | Заполняется после Login / Register |
| `refreshToken` | — | Заполняется после Login / Register |

### Порядок тестирования

1. Запустите сервер (`npm start`).
2. Импортируйте коллекцию в Postman.
3. Выполните **Auth → Login (Tenant)** или **Login (Owner)** — токены сохранятся автоматически.
4. Вызывайте защищённые запросы — заголовок `Authorization` подставится из `{{accessToken}}`.

### Структура коллекции

```
HomeRent API
├── Auth
│   ├── Register (Tenant)
│   ├── Register (Owner)
│   ├── Login (Tenant)
│   ├── Login (Owner)
│   ├── Refresh Token
│   └── Logout
├── Profile
│   ├── Get Me
│   ├── Update Me (Tenant)
│   ├── Update Me (Owner)
│   └── Delete Account
├── Apartments
│   ├── List (Catalog)
│   ├── List (Owner Mine)
│   ├── Get By Id
│   ├── Create
│   ├── Update
│   └── Delete
└── Bookings
    ├── List (Tenant)
    ├── List (Owner)
    ├── Create
    ├── Confirm (Owner)
    ├── Reject (Owner)
    └── Cancel (Tenant)
```
