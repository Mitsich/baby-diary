@echo off
REM Скрипт для инициализации Git репозитория и загрузки на GitHub
REM Использование: github-setup.bat YOUR_USERNAME REPO_NAME

setlocal enabledelayedexpansion

REM Цвета
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

echo.
echo %BLUE%==========================================
echo Baby Diary - GitHub Setup
echo ========================================== %NC%
echo.

REM Проверка аргументов
if "%1"=="" (
    echo %RED%Ошибка: Укажите GitHub username%NC%
    echo Использование: github-setup.bat YOUR_USERNAME REPO_NAME
    echo Примеры:
    echo   github-setup.bat john-doe baby-diary
    pause
    exit /b 1
)

if "%2"=="" (
    echo %RED%Ошибка: Укажите имя репозитория%NC%
    echo Использование: github-setup.bat YOUR_USERNAME REPO_NAME
    echo Примеры:
    echo   github-setup.bat john-doe baby-diary
    pause
    exit /b 1
)

set "USERNAME=%1"
set "REPO_NAME=%2"
set "REPO_URL=https://github.com/!USERNAME!/!REPO_NAME!.git"

echo %BLUE%Проверяю Git...%NC%
git --version >nul 2>&1
if errorlevel 1 (
    echo %RED%Ошибка: Git не установлен%NC%
    echo Скачайте с https://git-scm.com/download/win
    pause
    exit /b 1
)

echo %GREEN%✓ Git найден%NC%
echo.

REM Получить текущую директорию
set "CURRENT_DIR=%cd%"

echo %BLUE%Инициализирую Git репозиторий...%NC%

REM Проверить есть ли .git
if exist ".git" (
    echo %YELLOW%⚠ Репозиторий уже инициализирован%NC%
    echo.
    echo Добавляю remote...
) else (
    echo Запускаю: git init
    git init
    if errorlevel 1 (
        echo %RED%Ошибка при инициализации%NC%
        pause
        exit /b 1
    )
    echo %GREEN%✓ Git инициализирован%NC%
    echo.
    
    echo Добавляю файлы...
    git add .
    if errorlevel 1 (
        echo %RED%Ошибка при добавлении файлов%NC%
        pause
        exit /b 1
    )
    echo %GREEN%✓ Файлы добавлены%NC%
    echo.
    
    echo Создаю первый commit...
    git commit -m "Initial commit: Baby Diary multi-user app"
    if errorlevel 1 (
        echo %RED%Ошибка при создании commit%NC%
        pause
        exit /b 1
    )
    echo %GREEN%✓ Commit создан%NC%
    echo.
)

echo Добавляю remote origin...
git remote remove origin >nul 2>&1
git remote add origin !REPO_URL!
if errorlevel 1 (
    echo %RED%Ошибка при добавлении remote%NC%
    pause
    exit /b 1
)
echo %GREEN%✓ Remote добавлен%NC%
echo.

echo %BLUE%Переименовываю ветку в main...%NC%
git branch -M main >nul 2>&1
echo %GREEN%✓ Ветка переименована%NC%
echo.

echo %BLUE%Отправляю на GitHub...%NC%
echo %YELLOW%Внимание: Возможно потребуется аутентификация в браузере%NC%
echo.
git push -u origin main

if errorlevel 1 (
    echo.
    echo %RED%Ошибка при отправке на GitHub%NC%
    echo.
    echo Возможные причины:
    echo 1. Репозиторий на GitHub не существует
    echo    - Создайте на https://github.com/new
    echo.
    echo 2. Неверное имя пользователя или репозитория
    echo    - Проверьте значения USERNAME и REPO_NAME
    echo.
    echo 3. Ошибка аутентификации
    echo    - Убедитесь что вы авторизованы на GitHub
    echo    - Используйте Personal Access Token если обычная аутентификация не работает
    pause
    exit /b 1
)

echo.
echo %GREEN%==========================================
echo ✓ Успешно!
echo ========================================== %NC%
echo.
echo %BLUE%Репозиторий: %NC%!REPO_URL!
echo %BLUE%Локальная папка: %NC%!CURRENT_DIR!
echo.
echo %GREEN%Следующие шаги:%NC%
echo.
echo 1. Внесите изменения локально
echo.
echo 2. Отправьте изменения:
echo    git add .
echo    git commit -m "Описание изменений"
echo    git push
echo.
echo 3. На TrueNAS запустите deploy скрипт:
echo    bash deploy-from-github.sh %USERNAME% %REPO_NAME%
echo.
pause
