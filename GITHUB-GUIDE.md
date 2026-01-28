# 📤 Инструкция: Загрузка на GitHub и использование

## 1️⃣ Создание репозитория на GitHub

### Способ А: Через веб-интерфейс GitHub (самый простой)

1. Откройте https://github.com/new
2. Заполните поля:
   - **Repository name**: `baby-diary`
   - **Description**: `Многопользовательское приложение для дневника ребенка`
   - **Visibility**: выберите `Public` (если хотите поделиться) или `Private` (для личного использования)
   - **Initialize this repository with**: оставьте пусто
3. Нажмите **Create repository**

### Способ Б: Через GitHub CLI

```bash
# Установите GitHub CLI если еще не установлен
# https://cli.github.com

# Авторизуйтесь
gh auth login

# Создайте репозиторий
gh repo create baby-diary --public --source=. --remote=origin --push
```

## 2️⃣ Инициализация локального Git репозитория

Откройте PowerShell в папке проекта:

```powershell
# Перейдите в папку проекта
cd C:\Users\user\Desktop\web

# Инициализируйте git
git init

# Добавьте все файлы (кроме указанных в .gitignore)
git add .

# Первый commit
git commit -m "Initial commit: Baby Diary multi-user app"

# Добавьте remote (замените YOUR_USERNAME и YOUR_REPO на ваши данные)
git remote add origin https://github.com/YOUR_USERNAME/baby-diary.git

# Отправьте на GitHub
git branch -M main
git push -u origin main
```

## 3️⃣ Первая загрузка - пошагово

### Шаг 1: Проверьте git
```powershell
git --version
```
Должна вывести версию. Если ошибка - установите [Git для Windows](https://git-scm.com/download/win)

### Шаг 2: Настройте git (если первый раз)
```powershell
git config --global user.name "Ваше имя"
git config --global user.email "ваш.email@example.com"
```

### Шаг 3: Создайте репозиторий на GitHub
Как описано в пункте 1️⃣

### Шаг 4: Инициализируйте локально
```powershell
cd C:\Users\user\Desktop\web
git init
git add .
git commit -m "Initial commit: Baby Diary app"
```

### Шаг 5: Добавьте URL репозитория
Замените `YOUR_USERNAME`:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/baby-diary.git
git branch -M main
git push -u origin main
```

### Шаг 6: Введите учетные данные
- Если появится окно браузера - авторизуйтесь
- Если просит пароль - используйте [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

✅ **Готово!** Ваш код теперь на GitHub

## 4️⃣ Использование на TrueNAS (клонирование с GitHub)

### Вариант 1: Скопировать прямо с GitHub

```bash
# Подключитесь по SSH к TrueNAS
ssh root@YOUR_TRUENAS_IP

# Перейдите в папку приложений
cd /mnt/tank/apps

# Клонируйте репозиторий
git clone https://github.com/YOUR_USERNAME/baby-diary.git

# Перейдите в папку
cd baby-diary

# Запустите приложение
docker-compose up -d
```

### Вариант 2: Если на TrueNAS нет git

```bash
# На вашем компьютере
cd C:\Users\user\Desktop\web

# Создайте архив
git archive --format=tar.gz --output=baby-diary.tar.gz HEAD

# Или просто скопируйте папку (исключая .git)
# Скопируйте на TrueNAS
scp -r C:\Users\user\Desktop\web root@YOUR_TRUENAS_IP:/mnt/tank/apps/baby-diary
```

## 5️⃣ Дальнейшие обновления

После внесения изменений локально:

```powershell
# Проверьте статус
git status

# Добавьте изменения
git add .

# Commit
git commit -m "Описание изменений"

# Отправьте на GitHub
git push
```

После обновления на GitHub, обновите на TrueNAS:

```bash
cd /mnt/tank/apps/baby-diary
git pull
docker-compose up -d --build  # Если изменились файлы приложения
```

## 6️⃣ Синхронизация данных

⚠️ **Важно**: Папка `data/` содержит данные пользователей и **не должна** загружаться на GitHub (см. `.gitignore`).

Для резервного копирования данных:

```bash
# На TrueNAS - создайте резервную копию
docker cp baby-diary-app:/app/data /mnt/tank/backups/diary-backup-$(date +%Y%m%d)

# Или через SSH с вашего компьютера
scp -r root@YOUR_TRUENAS_IP:/app/data C:\Backups\baby-diary-data
```

## 7️⃣ Управление репозиторием на GitHub

### Защита основной ветки
1. Откройте репозиторий на GitHub
2. Settings → Branches → Add rule
3. Branch name pattern: `main`
4. Включите "Require pull request reviews"

### Добавление collaborators
1. Settings → Collaborators
2. Нажмите "Add people"
3. Введите username пользователя

### Управление Releases
```powershell
# Создайте tag
git tag -a v1.0.0 -m "Version 1.0.0 - Initial release"
git push origin v1.0.0
```

На GitHub это появится как Release.

## 8️⃣ Полезные команды Git

```powershell
# Просмотр истории
git log --oneline -10

# Просмотр текущего статуса
git status

# Отмена последнего commit (локально)
git reset --soft HEAD~1

# Просмотр всех веток
git branch -a

# Создание новой ветки для разработки
git checkout -b feature/new-feature

# Переключение между ветками
git checkout main

# Удаление локальной ветки
git branch -d feature/new-feature

# Удаление удаленной ветки
git push origin --delete feature/new-feature
```

## 9️⃣ Автоматическое развертывание на TrueNAS

Можно создать GitHub Actions для автоматического обновления на TrueNAS при каждом push.

Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to TrueNAS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to TrueNAS
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.TRUENAS_SSH_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan -H ${{ secrets.TRUENAS_IP }} >> ~/.ssh/known_hosts
          
          ssh root@${{ secrets.TRUENAS_IP }} << 'EOF'
          cd /mnt/tank/apps/baby-diary
          git pull
          docker-compose up -d --build
          EOF
```

**Требуется настроить Secrets в GitHub Settings:**
- `TRUENAS_IP` - IP адрес TrueNAS
- `TRUENAS_SSH_KEY` - приватный SSH ключ

## 🔟 Решение проблем

### "fatal: not a git repository"
```powershell
cd C:\Users\user\Desktop\web
git init
```

### "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/baby-diary.git
```

### "permission denied (publickey)"
Добавьте SSH ключ на GitHub:
1. https://github.com/settings/ssh
2. New SSH key
3. Вставьте содержимое вашего публичного ключа (`~/.ssh/id_rsa.pub`)

### Ошибка аутентификации при push
Используйте Personal Access Token вместо пароля:
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (с правами `repo` и `admin:repo_hook`)
3. Используйте token как пароль при prompt

---

**Готово!** 🎉 Ваше приложение теперь на GitHub и готово к развертыванию на TrueNAS.
