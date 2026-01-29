# 🔄 Git Workflow - Пошаговый пример

## Сценарий 1: Первая загрузка на GitHub

### День 1️⃣ - Загрузка на GitHub

```powershell
# Шаг 1: Откройте PowerShell в папке проекта
cd C:\Users\user\Desktop\web

# Шаг 2: Проверьте что Git установлен
git --version
# Вывод: git version 2.41.0.windows.1

# Шаг 3: Инициализируйте git
git init

# Шаг 4: Проверьте статус (все файлы должны быть красными)
git status

# Шаг 5: Добавьте все файлы
git add .

# Шаг 6: Проверьте статус (все файлы должны быть зелеными)
git status

# Шаг 7: Создайте первый commit
git commit -m "Initial commit: Baby Diary multi-user app with Docker support"

# Шаг 8: Добавьте remote (замените YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/baby-diary.git

# Шаг 9: Переименуйте ветку в main
git branch -M main

# Шаг 10: Отправьте на GitHub
git push -u origin main

# ✅ Готово! Проект теперь на GitHub
```

**Результат**: https://github.com/YOUR_USERNAME/baby-diary

---

## Сценарий 2: Добавление новой функции

### Локально на вашем компьютере

```powershell
# Обновитесь с GitHub (на случай если вы работали с другого устройства)
git pull

# Создайте новую ветку для функции
git checkout -b feature/add-weight-tracking

# Внесите изменения в файлы
# Например, добавили новый тип события - "Вес"
# Отредактировали components.js, app.js, styles.css

# Проверьте какие файлы изменились
git status

# Выбранный вывод:
# On branch feature/add-weight-tracking
# Changes not staged for commit:
#   modified:   app.js
#   modified:   components.js
#   modified:   styles.css

# Добавьте измененные файлы
git add app.js components.js styles.css

# Или добавьте все
git add .

# Создайте commit
git commit -m "Add weight tracking event type with UI and analytics"

# Отправьте новую ветку на GitHub
git push -u origin feature/add-weight-tracking

# ✅ Ветка загружена, можно создать Pull Request на GitHub
```

**На GitHub**:
1. Откройте https://github.com/YOUR_USERNAME/baby-diary
2. GitHub автоматически предложит создать Pull Request
3. Нажмите "Create Pull Request"
4. Добавьте описание и нажмите "Create pull request"

**Завершение**:
```powershell
# После merge на GitHub, обновите локально
git checkout main
git pull

# Удалите старую ветку
git branch -d feature/add-weight-tracking
git push origin --delete feature/add-weight-tracking
```

---

## Сценарий 3: Быстрое исправление (hotfix)

```powershell
# Проблема: найдена ошибка в production (на TrueNAS)

# Шаг 1: Переключитесь на main
git checkout main
git pull

# Шаг 2: Создайте hotfix ветку
git checkout -b hotfix/fix-save-bug

# Шаг 3: Исправьте ошибку в файле
# Например, исправили ошибку в saveToJSON() в app.js

# Шаг 4: Commit
git add app.js
git commit -m "Fix: ensure notes are properly saved to server"

# Шаг 5: Отправьте на GitHub
git push -u origin hotfix/fix-save-bug

# Шаг 6: На GitHub создайте Pull Request, review и merge

# Шаг 7: Обновите на TrueNAS
ssh root@YOUR_TRUENAS_IP
cd /mnt/tank/apps/baby-diary
git pull
docker-compose up -d --build
```

**Результат**: Исправление автоматически развернуто на TrueNAS

---

## Сценарий 4: Синхронизация между несколькими устройствами

### Устройство А (ноутбук)
```powershell
# Внесли изменения
git add .
git commit -m "Improved UI for mobile devices"
git push
```

### Устройство Б (рабочий стол)
```powershell
# Обновите код с GitHub
git pull

# Теперь у вас самые свежие изменения
```

### TrueNAS
```bash
# Обновите приложение
cd /mnt/tank/apps/baby-diary
git pull
docker-compose up -d --build

# Приложение теперь на последней версии
```

**Результат**: Все устройства синхронизированы ✅

---

## Сценарий 5: Откат к предыдущей версии

### Если что-то сломалось

```powershell
# Посмотрите историю
git log --oneline -10

# Пример вывода:
# a1b2c3d (HEAD -> main) Fix UI bug
# d4e5f6g Implement new feature
# h7i8j9k Initial commit

# Отмените последний commit (но сохраните файлы)
git reset --soft HEAD~1

# Или вернитесь к конкретной версии
git checkout d4e5f6g

# Вернуться на main
git checkout main
```

---

## Сценарий 6: Работа в команде

### Разработчик 1: Добавляет ночной режим

```powershell
git checkout -b feature/dark-mode
# Отредактировал styles.css
git add styles.css
git commit -m "Add dark mode theme"
git push -u origin feature/dark-mode
# Создает Pull Request на GitHub
```

### Разработчик 2: Добавляет экспорт в PDF

```powershell
git checkout -b feature/pdf-export
# Отредактировал server.py, app.js
git add server.py app.js
git commit -m "Implement PDF export functionality"
git push -u origin feature/pdf-export
# Создает Pull Request на GitHub
```

### Обе ветки merge в main

**На GitHub**:
1. PR #1 (dark-mode) merged успешно
2. PR #2 (pdf-export) merged успешно
3. main теперь содержит обе фичи

**Локально обновляются обе разработчика**:
```powershell
git checkout main
git pull
# Теперь у обоих все изменения
```

---

## Полезные команды

### Просмотр
```powershell
git status              # Текущий статус
git log --oneline       # История commits (-10 показывает последние 10)
git diff                # Изменения в файлах
git show <commit>       # Информация о конкретном commit
git branch -a           # Все ветки (локальные и удаленные)
```

### Создание и управление
```powershell
git branch <name>                # Создать ветку
git checkout <branch>            # Переключиться на ветку
git checkout -b <branch>         # Создать и переключиться
git merge <branch>               # Merge ветку в текущую
git branch -d <branch>           # Удалить локальную ветку
git push origin --delete <branch> # Удалить удаленную ветку
```

### Изменения
```powershell
git add <file>          # Добавить конкретный файл
git add .               # Добавить все файлы
git commit -m "message" # Commit с сообщением
git reset --soft HEAD~1 # Отмена последнего commit
git reset --hard HEAD~1 # Полное отмена последнего commit
git revert <commit>     # Создать новый commit с отменой изменений
```

### Синхронизация
```powershell
git push                # Отправить в текущую ветку
git push origin <branch> # Отправить конкретную ветку
git pull                # Загрузить и merge с удаленной веткой
git fetch               # Только загрузить без merge
```

---

## Правила коммитов (Best Practice)

### ✅ Хорошие сообщения

```
Add weight tracking event type
Fix: prevent notes from being lost on page reload
Improve mobile UI responsiveness
Refactor: simplify saveData function
Update: Docker configuration for TrueNAS
Docs: add GitHub deployment instructions
```

### ❌ Плохие сообщения

```
bug fix
update
stuff
wip
...
asdf
```

### Формат сообщения

```
<type>: <subject>

<body>

<footer>
```

**Types**:
- `feat`: Новая функция
- `fix`: Исправление ошибки
- `docs`: Изменения документации
- `style`: Форматирование (без логических изменений)
- `refactor`: Переработка кода
- `perf`: Улучшение производительности
- `test`: Добавление тестов
- `chore`: Изменения в конфигурации, зависимостях

**Примеры**:
```
feat: add temperature tracking to events

- New event type for temperature
- Temperature chart in analytics
- Temperature history per day

Closes #123
```

---

## GitHub Actions CI/CD (опционально)

Для автоматического развертывания на TrueNAS создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to TrueNAS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to TrueNAS
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.TRUENAS_SSH_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          
          ssh -o StrictHostKeyChecking=no root@${{ secrets.TRUENAS_IP }} << 'EOF'
          cd /mnt/tank/apps/baby-diary
          git pull
          docker-compose up -d --build
          EOF
```

**Настройка**:
1. GitHub Settings → Secrets
2. Добавьте `TRUENAS_IP` и `TRUENAS_SSH_KEY`
3. Теперь каждый push в main = автоматическое развертывание! 🚀

---

**Поздравляем! Вы готовы работать с Git и GitHub!** 🎉
