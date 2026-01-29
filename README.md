# 👶 Baby Diary App

Мультипользовательское веб-приложение для ведения дневника малыша с поддержкой Docker и Portainer.

## 📋 Возможности

- 🔐 Многопользовательская система с уникальными ID
- 📝 Ведение дневника событий
- 💾 Автоматическое сохранение данных
- 🌐 Веб-интерфейс на HTML/CSS/JS
- 🐳 Полная поддержка Docker и Portainer
- 📁 Персональное хранилище данных для каждого пользователя

## 🚀 Быстрый старт

### Локально (без Docker)

```bash
python3 server.py
```

Откройте в браузере: http://localhost:8000

### С Docker

```bash
docker-compose up -d
```

Приложение запустится на: http://localhost:8000

### В Portainer

1. Перейдите в **Stacks → Add stack**
2. Выберите вкладку **Repository**
3. Введите:
   - Repository URL: `https://github.com/Mitsich/baby-diary`
   - Repository reference: `main`
   - Compose path: `docker-compose.yml`
4. Нажмите **Deploy**

## 📁 Структура проекта

```
.
├── server.py              # Python сервер (обработка запросов)
├── app.js                 # JavaScript логика приложения
├── components.js          # Компоненты интерфейса
├── index.html             # HTML шаблон
├── styles.css             # Стили
├── Dockerfile             # Конфигурация Docker образа
├── docker-compose.yml     # Конфигурация контейнера
├── requirements.txt       # Python зависимости
├── .dockerignore          # Файлы для исключения из образа
└── data/                  # Папка с данными пользователей
    └── {userId}/diary.json
```

## 🔧 API endpoints

| Метод | Endpoint | Описание |
|-------|----------|---------|
| POST | `/save` | Сохранить данные пользователя |
| POST | `/load` | Загрузить данные пользователя |
| POST | `/delete` | Удалить аккаунт пользователя |

## 📦 Требования

- Python 3.11+ (для локального запуска)
- Docker и Docker Compose (для контейнеризации)

## 💾 Хранилище данных

Все данные хранятся в папке `data/` с структурой:
```
data/
├── user-id-1/
│   └── diary.json
├── user-id-2/
│   └── diary.json
```

При запуске в Docker папка монтируется как volume для сохранения данных.

## 🐳 Docker переменные окружения

- `PYTHONUNBUFFERED=1` - Отключение буферизации вывода Python

## 📝 Лицензия

MIT
