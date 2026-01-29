# 🚀 Быстрый старт: GitHub → TrueNAS

## ⚡ За 5 минут

### 1. На вашем компьютере (Windows/Mac/Linux)

```bash
# Откройте PowerShell в папке c:\Users\user\Desktop\web
cd C:\Users\user\Desktop\web

# Запустите батник (Windows)
.\github-setup.bat YOUR_USERNAME baby-diary

# Или вручную (все ОС):
git init
git add .
git commit -m "Initial commit: Baby Diary app"
git remote add origin https://github.com/YOUR_USERNAME/baby-diary.git
git branch -M main
git push -u origin main
```

**Замените `YOUR_USERNAME` на ваш GitHub username**

### 2. На TrueNAS (через SSH)

```bash
# Подключитесь по SSH
ssh root@YOUR_TRUENAS_IP

# Запустите deploy скрипт
bash <(curl -s https://raw.githubusercontent.com/YOUR_USERNAME/baby-diary/main/deploy-from-github.sh) YOUR_USERNAME baby-diary
```

Или вручную:
```bash
cd /mnt/tank/apps
git clone https://github.com/YOUR_USERNAME/baby-diary.git
cd baby-diary
docker-compose up -d
```

### 3. Откройте приложение

http://YOUR_TRUENAS_IP:8000

✅ **Готово!**

---

## 📚 Полная инструкция

Смотрите [GITHUB-GUIDE.md](GITHUB-GUIDE.md) для подробных инструкций.

## 🔄 Обновления

После внесения изменений:

```bash
# На вашем компьютере
git add .
git commit -m "Описание изменений"
git push

# На TrueNAS
cd /mnt/tank/apps/baby-diary
git pull
docker-compose up -d --build
```

## 📦 Структура файлов

```
baby-diary/
├── README.md                 # Основная документация
├── GITHUB-GUIDE.md           # Инструкция по GitHub
├── QUICK-START.md            # Этот файл
├── DOCKER-DEPLOYMENT.md      # Docker инструкция
├── github-setup.bat          # Батник для Windows
├── deploy-from-github.sh     # Bash скрипт для TrueNAS
├── Dockerfile                # Docker конфигурация
├── docker-compose.yml        # Основной compose файл
├── docker-compose.production.yml  # Production конфигурация
├── index.html, styles.css, app.js, components.js, server.py
└── .gitignore, LICENSE
```

## 🎯 Основные команды

### Git
```bash
git status              # Просмотр статуса
git log --oneline       # История commits
git add .               # Добавить файлы
git commit -m "message" # Commit
git push                # Отправить на GitHub
git pull                # Загрузить с GitHub
```

### Docker на TrueNAS
```bash
docker ps                              # Список контейнеров
docker-compose logs -f                 # Логи
docker-compose up -d                   # Запуск
docker-compose down                    # Остановка
docker-compose restart                 # Перезагрузка
```

## ⚠️ Важно

- Папка `data/` содержит данные пользователей
- `.gitignore` исключает её из git (это правильно!)
- Сохраняйте важные данные в резервные копии:
  ```bash
  docker cp baby-diary-app:/app/data ~/backups/diary-backup
  ```

## 🆘 Проблемы

### "fatal: not a git repository"
```bash
cd C:\Users\user\Desktop\web
git init
```

### "Cannot push to GitHub"
1. Проверьте интернет соединение
2. Убедитесь что репозиторий создан на GitHub
3. Проверьте что вы авторизованы

### Docker контейнер не запускается на TrueNAS
```bash
docker-compose logs
# Посмотрите вывод и исправьте ошибку
```

## 📞 Дополнительная помощь

- [Полная инструкция GitHub](GITHUB-GUIDE.md)
- [Docker инструкция](DOCKER-DEPLOYMENT.md)
- [Основная документация](README.md)

---

**Сделано с ❤️ для облегчения развертывания**
