# Baby Diary Application - Docker Deployment

## Описание
Многопользовательское приложение для ведения дневника ребенка с поддержкой отслеживания событий (сон, пробуждение, кормление, покупки) и заметок.

## Требования для TrueNAS

### 1. Через приложения TrueNAS Apps (рекомендуется)
TrueNAS имеет встроенную поддержку контейнеризации через Apps. Следуйте инструкциям:

#### Способ 1: Через официальное приложение Docker
1. В TrueNAS откройте **Apps** → **Available Applications**
2. Найдите или загрузите **Docker**
3. Установите его, если еще не установлен
4. После установки откройте **Installed Applications** → **Docker**

#### Способ 2: Ручное развертывание через Shell

```bash
# Подключитесь к TrueNAS через SSH
ssh root@your-truenas-ip

# Навигируйте в папку с приложением
cd /path/to/baby-diary

# Скопируйте все файлы приложения на TrueNAS (с вашего компьютера)
scp -r * root@your-truenas-ip:/mnt/pool-name/apps/baby-diary/

# Зайдите на сервер
ssh root@your-truenas-ip

# Перейдите в директорию
cd /mnt/pool-name/apps/baby-diary

# Создайте контейнер
docker-compose up -d
```

### 2. Быстрая установка (Docker Compose)

Если Docker уже установлен на TrueNAS:

```bash
# 1. Скопируйте файлы на TrueNAS
scp -r /path/to/baby-diary/* root@your-truenas-ip:/mnt/tank/apps/baby-diary/

# 2. Подключитесь по SSH
ssh root@your-truenas-ip

# 3. Перейдите в директорию
cd /mnt/tank/apps/baby-diary

# 4. Запустите приложение
docker-compose up -d

# 5. Проверьте статус
docker ps
```

## Структура файлов
```
baby-diary/
├── Dockerfile           # Конфигурация образа контейнера
├── docker-compose.yml   # Конфигурация для запуска
├── .dockerignore        # Исключаемые файлы
├── index.html          # Основной файл приложения
├── styles.css          # Стили
├── app.js              # Логика приложения
├── components.js       # Компоненты UI
├── server.py           # Python сервер
└── data/               # Папка для сохранения данных (создается автоматически)
```

## Доступ к приложению

После развертывания:
- **URL**: `http://your-truenas-ip:8000`
- **Замените** `your-truenas-ip` на IP вашего TrueNAS сервера

Например: `http://192.168.1.100:8000`

## Основные команды

### Просмотр логов контейнера
```bash
docker-compose logs -f baby-diary
```

### Остановка приложения
```bash
docker-compose down
```

### Перезагрузка приложения
```bash
docker-compose restart baby-diary
```

### Пересборка образа (если изменили файлы)
```bash
docker-compose up -d --build
```

## Сохранение данных

Все данные пользователей хранятся в томе `diary-data`, который автоматически создается Docker.

На TrueNAS данные обычно сохраняются в:
```
/var/lib/docker/volumes/baby-diary-app_diary-data/_data
```

Или вы можете указать конкретный путь на диске в `docker-compose.yml`:
```yaml
volumes:
  diary-data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/tank/baby-diary-data  # Замените на ваш путь
```

## Резервное копирование данных

### Скопировать данные с контейнера на хост
```bash
docker cp baby-diary-app:/app/data /mnt/tank/backups/baby-diary-backup-$(date +%Y%m%d)
```

### Восстановить данные
```bash
docker cp /mnt/tank/backups/baby-diary-backup-20260128/data baby-diary-app:/app/
```

## Удаление приложения

```bash
docker-compose down -v  # -v удаляет также томы с данными
```

## Кастомизация портов

Если порт 8000 занят, измените в `docker-compose.yml`:
```yaml
ports:
  - "9000:8000"  # Порт хоста:порт контейнера
```

Затем доступ будет по URL: `http://your-truenas-ip:9000`

## Поддержка и проблемы

### Контейнер не запускается
1. Проверьте логи: `docker-compose logs`
2. Убедитесь, что Python доступен в контейнере
3. Проверьте, что порт 8000 не занят другим приложением

### Данные не сохраняются
1. Проверьте права доступа к папке `/app/data`
2. Убедитесь, что том `diary-data` создан: `docker volume ls`

### Доступ запрещен при копировании файлов
Используйте `sudo` при копировании на TrueNAS:
```bash
scp -r /path/to/baby-diary/* root@your-truenas-ip:/mnt/tank/apps/baby-diary/
```

## Альтернативное развертывание: Systemd Service

Если вы хотите запускать приложение как сервис TrueNAS (без Docker):

```bash
# Установите Python 3.11+
# Скопируйте файлы
# Создайте systemd unit file
sudo nano /etc/systemd/system/baby-diary.service
```

Содержание файла:
```ini
[Unit]
Description=Baby Diary Application
After=network.target

[Service]
Type=simple
User=nobody
WorkingDirectory=/mnt/tank/baby-diary
ExecStart=/usr/local/bin/python /mnt/tank/baby-diary/server.py
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Затем:
```bash
sudo systemctl daemon-reload
sudo systemctl enable baby-diary
sudo systemctl start baby-diary
```

## Лицензия и использование
Это приложение предназначено для личного использования.
