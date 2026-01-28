#!/bin/bash
# Скрипт для быстрого развертывания Baby Diary приложения с GitHub на TrueNAS
# Использование: bash deploy-from-github.sh YOUR_USERNAME YOUR_REPO_NAME [PORT]

set -e  # Выход при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для логирования
log_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# Проверка аргументов
if [ -z "$1" ] || [ -z "$2" ]; then
    log_error "Использование: bash deploy-from-github.sh <YOUR_USERNAME> <REPO_NAME> [PORT]"
    echo "Примеры:"
    echo "  bash deploy-from-github.sh john-doe baby-diary"
    echo "  bash deploy-from-github.sh john-doe baby-diary 8000"
    exit 1
fi

USERNAME=$1
REPO_NAME=$2
PORT=${3:-8000}
REPO_URL="https://github.com/$USERNAME/$REPO_NAME.git"
INSTALL_PATH="/mnt/tank/apps/$REPO_NAME"

log_info "=========================================="
log_info "Baby Diary - GitHub Deploy Script"
log_info "=========================================="
log_info "GitHub репозиторий: $REPO_URL"
log_info "Путь установки: $INSTALL_PATH"
log_info "Порт: $PORT"
log_info "=========================================="

# Проверка git
if ! command -v git &> /dev/null; then
    log_error "Git не установлен на TrueNAS"
    log_info "Для установки git, используйте: pkg install -y git"
    exit 1
fi

log_success "Git найден: $(git --version)"

# Проверка Docker
if ! command -v docker &> /dev/null; then
    log_error "Docker не установлен на TrueNAS"
    log_info "Установите Docker через TrueNAS Apps"
    exit 1
fi

log_success "Docker найден: $(docker --version)"

# Проверка docker-compose
if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose не установлен"
    log_info "Для установки: pip install docker-compose"
    exit 1
fi

log_success "Docker Compose найден"

# Проверка доступности папки
if [ ! -d "/mnt/tank" ]; then
    log_error "Путь /mnt/tank не найден"
    log_info "Замените 'tank' на имя вашего пула в TrueNAS"
    exit 1
fi

# Создание папки для приложений
mkdir -p /mnt/tank/apps

# Клонирование или обновление репозитория
if [ -d "$INSTALL_PATH/.git" ]; then
    log_info "Репозиторий уже существует, обновляю..."
    cd "$INSTALL_PATH"
    git pull origin main || git pull origin master
    log_success "Репозиторий обновлен"
else
    log_info "Клонирую репозиторий..."
    git clone "$REPO_URL" "$INSTALL_PATH"
    log_success "Репозиторий клонирован"
    cd "$INSTALL_PATH"
fi

# Проверка наличия docker-compose.yml
if [ ! -f "docker-compose.yml" ]; then
    log_error "docker-compose.yml не найден в репозитории"
    log_info "Убедитесь что файл есть в GitHub репозитории"
    exit 1
fi

# Остановка существующего контейнера (если есть)
if docker ps -a --format '{{.Names}}' | grep -q "baby-diary-app"; then
    log_warn "Найден существующий контейнер, останавливаю..."
    docker-compose down
    log_success "Контейнер остановлен"
fi

# Создание папки для данных с правильными правами
mkdir -p /mnt/tank/baby-diary-data
chmod 755 /mnt/tank/baby-diary-data

#修改 docker-compose.yml для использования кастомного порта
if [ "$PORT" != "8000" ]; then
    log_info "Изменяю порт с 8000 на $PORT..."
    sed -i "s/\"8000:8000\"/\"$PORT:8000\"/g" docker-compose.yml
fi

# Запуск контейнера
log_info "Запускаю приложение..."
docker-compose up -d --build

# Проверка статуса контейнера
sleep 3
if docker ps --filter "name=baby-diary-app" --format '{{.Names}}' | grep -q "baby-diary-app"; then
    log_success "Контейнер успешно запущен!"
    
    # Вывод информации о доступе
    log_info "=========================================="
    log_success "Baby Diary готов к использованию!"
    log_info "=========================================="
    log_info "📱 Откройте приложение:"
    log_success "http://YOUR_TRUENAS_IP:$PORT"
    log_info ""
    log_info "Полезные команды:"
    echo "  Просмотр логов:     docker-compose -f $INSTALL_PATH/docker-compose.yml logs -f"
    echo "  Остановить:         docker-compose -f $INSTALL_PATH/docker-compose.yml down"
    echo "  Перезагрузить:      docker-compose -f $INSTALL_PATH/docker-compose.yml restart"
    echo ""
    log_info "Обновление с GitHub:"
    echo "  cd $INSTALL_PATH && git pull && docker-compose up -d --build"
    log_info "=========================================="
    
else
    log_error "Контейнер не запустился"
    log_info "Проверьте логи:"
    docker-compose logs
    exit 1
fi

log_success "Развертывание завершено!"
