# 🎬 ПЕРВЫЕ ШАГИ - Выполните эти 3 действия

## Вариант А: Вы в спешке (2 минуты)

### Шаг 1: Инициализируйте Git
**Windows (PowerShell)**:
```powershell
cd C:\Users\user\Desktop\web
.\github-setup.bat YOUR_GITHUB_USERNAME baby-diary
```

**Linux/Mac (Bash)**:
```bash
cd ~/path/to/baby-diary
git init
git add .
git commit -m "Initial commit: Baby Diary app"
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/baby-diary.git
git branch -M main
git push -u origin main
```

✅ **Готово!** Код на GitHub

### Шаг 2: Разверните на TrueNAS
```bash
ssh root@YOUR_TRUENAS_IP
bash deploy-from-github.sh YOUR_GITHUB_USERNAME baby-diary
```

✅ **Готово!** Приложение работает

### Шаг 3: Откройте в браузере
```
http://YOUR_TRUENAS_IP:8000
```

✅ **Готово!** Приложение в браузере

---

## Вариант Б: Пошаговая инструкция (10 минут)

### Шаг 1️⃣: Создайте репозиторий на GitHub

1. Откройте https://github.com/new
2. **Repository name**: `baby-diary`
3. **Description**: `Многопользовательское приложение для дневника ребенка`
4. **Visibility**: `Public` (если делиться) или `Private`
5. **Create repository**

### Шаг 2️⃣: Загрузите код (Windows)

Откройте PowerShell в папке проекта:

```powershell
# Перейдите в папку
cd C:\Users\user\Desktop\web

# Запустите скрипт (замените YOUR_USERNAME на ваш username GitHub)
.\github-setup.bat YOUR_USERNAME baby-diary

# Скрипт автоматически:
# - инициализирует git
# - добавит все файлы
# - создаст первый commit
# - отправит на GitHub
```

После завершения появится сообщение: ✅ **Успешно!**

**Проверьте**: https://github.com/YOUR_USERNAME/baby-diary

### Шаг 3️⃣: Разверните на TrueNAS

Подключитесь по SSH к TrueNAS:

```bash
# Подключитесь
ssh root@YOUR_TRUENAS_IP

# Запустите deploy скрипт
bash deploy-from-github.sh YOUR_USERNAME baby-diary
```

Скрипт автоматически:
- Установит необходимое программное обеспечение (если нужно)
- Клонирует ваш репозиторий
- Создаст Docker контейнер
- Запустит приложение

После завершения:
```
✅ Baby Diary готов к использованию!
📱 Откройте: http://YOUR_TRUENAS_IP:8000
```

### Шаг 4️⃣: Первое использование

1. Откройте http://YOUR_TRUENAS_IP:8000
2. Нажмите "Зарегистрироваться"
3. Нажмите "Сгенерировать ID"
4. Все готово! Используйте приложение

---

## ⚙️ Параметры

### YOUR_GITHUB_USERNAME
Замените на ваш username GitHub.
Пример: если GitHub профиль `https://github.com/john-doe`, то это `john-doe`

### YOUR_TRUENAS_IP
Замените на IP адрес вашего TrueNAS сервера.
Пример: `192.168.1.100`

### Кастомный порт (опционально)
```bash
bash deploy-from-github.sh YOUR_USERNAME baby-diary 9000
# Приложение будет на http://YOUR_TRUENAS_IP:9000
```

---

## 🔄 Обновления

После внесения изменений локально:

```bash
# На вашем компьютере
cd C:\Users\user\Desktop\web
git add .
git commit -m "Описание изменений"
git push

# На TrueNAS
ssh root@YOUR_TRUENAS_IP
cd /mnt/tank/apps/baby-diary
git pull
docker-compose up -d --build
```

---

## 📖 Дальнейшее изучение

После выполнения первых 3 шагов:

1. **Понять как это работает**: [README.md](README.md)
2. **Работать с Git**: [GIT-WORKFLOW.md](GIT-WORKFLOW.md)
3. **Дополнительные параметры Docker**: [DOCKER-DEPLOYMENT.md](DOCKER-DEPLOYMENT.md)
4. **Полная информация**: [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md)

---

## 🆘 Решение проблем

### "git not found"
Установите Git: https://git-scm.com/download/win

### "Permission denied (publickey)"
Добавьте SSH ключ на GitHub: https://github.com/settings/ssh

### "Docker not found" на TrueNAS
Установите Docker через TrueNAS Apps

### "Port already in use"
Используйте другой порт:
```bash
bash deploy-from-github.sh YOUR_USERNAME baby-diary 8001
```

### Контейнер не запускается
```bash
docker-compose logs
# Посмотрите сообщение об ошибке
```

---

## ✅ Чек-лист завершения

- [ ] Создан репозиторий на GitHub
- [ ] Код загружен на GitHub  
- [ ] Установлено на TrueNAS
- [ ] Приложение доступно в браузере
- [ ] Можете добавлять события
- [ ] Данные сохраняются

**Если все галочки установлены - готово! 🎉**

---

## 🎯 Что дальше?

1. **Используйте приложение** - добавляйте события, смотрите аналитику
2. **Разрабатывайте** - добавляйте новые функции через Git
3. **Делитесь** - рассказывайте друзьям о проекте
4. **Улучшайте** - вносите улучшения и исправления

---

**Вы готовы! Начните с шага 1 выше!** 🚀
