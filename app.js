/**
 * Main Application Logic
 */

let events = [];
let userId = null;
const IS_AUTHENTICATED = 'isAuthenticated';
let notes = [];

// Check if user is authenticated on page load
document.addEventListener('DOMContentLoaded', async () => {
    const isAuth = localStorage.getItem(IS_AUTHENTICATED);
    if (isAuth === 'true') {
        userId = localStorage.getItem('userId');
        if (userId) {
            showAppContent();
            await loadFromJSON();
            renderHistory(events);
            return;
        }
    }
    
    // Show auth screen
    showAuthScreen();
});

// Update user display in header
function updateUserDisplay() {
    const userDisplay = document.getElementById('userDisplay');
    if (userDisplay) {
        const shortId = userId.substring(0, 8);
        userDisplay.textContent = '👤 ' + shortId + '...';
    }
}
// ============= EVENT LOGGING =============
function logEvent(type) {
    if (!userId) {
        alert('❌ Ошибка: пользователь не инициализирован. Перезагрузи страницу.');
        return;
    }
    
    const noteInput = document.getElementById('eventNote');
    const newEvent = {
        id: Date.now(),
        type: type,
        timestamp: new Date().toISOString(),
        note: noteInput.value
    };

    console.log('📝 Новое событие для userId:', userId.substring(0, 8) + '...', 'тип:', type);
    
    events.unshift(newEvent);
    saveData();
    noteInput.value = '';
    
    if (document.getElementById('history').classList.contains('active')) {
        renderHistory(events);
    } else {
        alert(`Записано: ${getLabel(type)}`);
    }
}

// ============= DATA PERSISTENCE =============
function saveData() {
    if (!userId) {
        console.error('❌ userId не инициализирован!');
        return;
    }
    
    localStorage.setItem('babyEvents', JSON.stringify(events));
    saveToJSON();
}

async function saveToJSON() {
    if (!userId) {
        console.error('❌ userId не инициализирован при сохранении!');
        return;
    }
    
    const jsonData = {
        userId: userId,
        events: events,
        notes: notes,
        exportDate: new Date().toISOString(),
        version: "1.0"
    };
    
    console.log('📤 Отправляю', events.length, 'событий для userId:', userId.substring(0, 8) + '...');
    
    try {
        const response = await fetch('/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData)
        });
        
        if (response.ok) {
            console.log('✅ Данные сохранены на сервер');
        } else {
            const error = await response.json();
            console.log('⚠️ Ошибка сохранения на сервер:', error);
        }
    } catch (err) {
        console.log('⚠️ Сервер недоступен. Убедись что он запущен: python server.py');
        console.log('Error:', err);
    }
}

// ============= EVENT MANAGEMENT =============
function deleteEvent(id) {
    if (confirm('Удалить эту запись?')) {
        events = events.filter(e => e.id !== id);
        saveData();
        renderHistory(events);
    }
}

function clearAllData() {
    if (confirm('Удалить ВСЕ записи? Восстановить будет нельзя.')) {
        localStorage.removeItem('babyEvents');
        events = [];
        renderHistory(events);
    }
}

// ============= TAB SWITCHING =============
function switchTab(tabName) {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    
    const buttons = document.querySelectorAll('.tab-btn');
    if (tabName === 'tracker') {
        buttons[0].classList.add('active');
    } else if (tabName === 'notes') {
        buttons[1].classList.add('active');
        renderNotes();
    } else if (tabName === 'history') {
        buttons[2].classList.add('active');
        renderHistory(events);
    } else if (tabName === 'analytics') {
        buttons[3].classList.add('active');
        renderAnalytics(events);
    } else if (tabName === 'settings') {
        buttons[4].classList.add('active');
        displaySettings();
    }
}

// ============= JSON IMPORT/EXPORT =============
function importJSON() {
    const fileInput = document.getElementById('jsonFileInput');
    fileInput.click();
    
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const jsonData = JSON.parse(event.target.result);
                
                if (jsonData.events && Array.isArray(jsonData.events)) {
                    if (confirm(`Загрузить ${jsonData.events.length} записей? Текущие данные будут заменены.`)) {
                        events = jsonData.events;
                        saveData();
                        renderHistory(events);
                        alert('✅ Данные успешно загружены из JSON');
                        switchTab('history');
                    }
                } else {
                    alert('❌ Неправильный формат JSON файла');
                }
            } catch (err) {
                alert('❌ Ошибка при чтении файла: ' + err.message);
            }
        };
        reader.readAsText(file);
        fileInput.value = '';
    };
}

function exportJSON() {
    const jsonData = {
        events: events,
        exportDate: new Date().toISOString(),
        version: "1.0"
    };
    
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `baby-diary-${new Date().toISOString().split('T')[0]}.json`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log('✅ Экспорт JSON выполнен');
}

// ============= JSON LOADING =============
async function loadFromJSON() {
    console.log('📥 Загружаю данные для пользователя:', userId.substring(0, 8) + '...');
    
    try {
        const response = await fetch('/load', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId })
        });
        
        if (response.ok) {
            const jsonData = await response.json();
            if (jsonData.events && Array.isArray(jsonData.events)) {
                events = jsonData.events;
                localStorage.setItem('babyEvents', JSON.stringify(events));
                console.log('✅ Загружено', events.length, 'событий с сервера');
            }
            if (jsonData.notes && Array.isArray(jsonData.notes)) {
                notes = jsonData.notes;
                console.log('✅ Загружено', notes.length, 'заметок с сервера');
            }
        }
    } catch (err) {
        console.log('⚠️ Сервер недоступен, используем локальные данные');
        const localEvents = localStorage.getItem('babyEvents');
        if (localEvents) {
            events = JSON.parse(localEvents);
            console.log('📝 Загружено', events.length, 'событий из localStorage');
        }
    }
}

// ============= BACKUP ON UNLOAD =============
window.addEventListener('beforeunload', function() {
    const jsonData = {
        userId: userId,
        events: events,
        exportDate: new Date().toISOString(),
        version: "1.0"
    };
    localStorage.setItem('babyEventsBackup', JSON.stringify(jsonData));
});

// ============= SETTINGS =============
function displaySettings() {
    const userIdElement = document.getElementById('accountUserId');
    if (userIdElement) {
        userIdElement.textContent = userId;
    }
}

// Delete account and all user data
async function deleteAccount() {
    const confirmMessage = `⚠️ ВЫ УВЕРЕНЫ?
    
Это удалит ВСЕ данные вашего аккаунта:
- Все записи о сне
- Все записи о кормлении
- Все данные на сервере

Это действие НЕОБРАТИМО!

Введите 'УДАЛИТЬ' для подтверждения:`;

    const userConfirm = prompt(confirmMessage);
    
    if (userConfirm !== 'УДАЛИТЬ') {
        alert('❌ Удаление отменено');
        return;
    }

    // Second confirmation
    if (!confirm('Это действительно ПОСЛЕДНЕЕ предупреждение. Удалить аккаунт?')) {
        alert('❌ Удаление отменено');
        return;
    }

    try {
        console.log('📤 Отправляю запрос на удаление аккаунта:', userId.substring(0, 8) + '...');
        
        const response = await fetch('/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId })
        });

        console.log('📬 Ответ от сервера:', response.status, response.statusText);

        if (response.ok) {
            console.log('🗑️ Аккаунт удален');
            
            // Clear all local data
            localStorage.clear();
            sessionStorage.clear();
            
            alert('✅ Аккаунт удален. Страница перезагрузится.');
            
            // Reload page after 1 second
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            let errorMessage = 'Неизвестная ошибка';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
            }
            alert('❌ Ошибка удаления: ' + errorMessage);
            console.error('❌ Ошибка удаления:', errorMessage);
        }
    } catch (err) {
        console.error('❌ Ошибка при удалении аккаунта:', err);
        alert('❌ Ошибка: ' + err.message);
    }
}

// ============= AUTHENTICATION =============
function showAuthScreen() {
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('appContent').style.display = 'none';
}

function showAppContent() {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('appContent').style.display = 'flex';
    document.getElementById('appContent').style.flexDirection = 'column';
    updateUserDisplay();
}

function switchAuthTab(tabName) {
    document.querySelectorAll('.auth-tab').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.auth-tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    document.querySelectorAll('.auth-tab-btn')[tabName === 'login' ? 0 : 1].classList.add('active');
}

function registerUser() {
    // Generate new user ID (UUID v4)
    const newUserId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    
    userId = newUserId;
    events = [];
    notes = [];
    
    // Save to localStorage
    localStorage.setItem('userId', userId);
    localStorage.setItem(IS_AUTHENTICATED, 'true');
    localStorage.removeItem('babyEvents');
    
    console.log('👤 Новый пользователь создан:', userId.substring(0, 8) + '...');
    
    // Show success message with ID
    alert(`✅ Новый аккаунт создан!\n\nВаш ID:\n${userId}\n\nСохраните этот ID для входа в будущем!`);
    
    showAppContent();
    saveNotes();
    saveToJSON();
}

function loginUser() {
    const inputId = document.getElementById('loginUserId').value.trim();
    
    if (!inputId) {
        alert('❌ Пожалуйста, введите ваш ID');
        return;
    }
    
    userId = inputId;
    
    // Save to localStorage
    localStorage.setItem('userId', userId);
    localStorage.setItem(IS_AUTHENTICATED, 'true');
    
    console.log('👤 Вход в аккаунт:', userId.substring(0, 8) + '...');
    
    showAppContent();
    loadNotes();
    loadFromJSON();
}

function logoutUser() {
    if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
        localStorage.removeItem(IS_AUTHENTICATED);
        localStorage.removeItem('userId');
        localStorage.removeItem('babyEvents');
        
        userId = null;
        events = [];
        
        console.log('👤 Выход из аккаунта');
        location.reload();
    }
}

function copyUserIdToClipboard() {
    const userIdText = userId;
    navigator.clipboard.writeText(userIdText).then(() => {
        alert('✅ ID скопирован в буфер обмена!');
    }).catch(() => {
        alert('❌ Не удалось скопировать ID');
    });
}

// ============= NOTES MANAGEMENT =============
function loadNotes() {
    // Заметки загружаются из сервера в loadFromJSON()
    // Эта функция оставлена для обратной совместимости
}

function saveNotes() {
    // Заметки сохраняются вместе с событиями в saveToJSON()
    saveToJSON();
}

function addNote() {
    const noteText = document.getElementById('noteText').value.trim();
    
    if (!noteText) {
        alert('❌ Напишите заметку');
        return;
    }
    
    const newNote = {
        id: Date.now(),
        text: noteText,
        timestamp: new Date().toISOString()
    };
    
    notes.unshift(newNote);
    saveData(); // Сохраняет на сервер
    document.getElementById('noteText').value = '';
    renderNotes();
}

function deleteNote(id) {
    if (confirm('Удалить эту заметку?')) {
        notes = notes.filter(note => note.id !== id);
        saveData(); // Сохраняет на сервер
        renderNotes();
    }
}

function renderNotes() {
    const container = document.getElementById('notesList');
    
    if (notes.length === 0) {
        container.innerHTML = '<div class="empty-notes">📭 У вас нет заметок. Создайте первую!</div>';
        return;
    }
    
    const notesHtml = notes.map(note => {
        const date = new Date(note.timestamp);
        const dateString = date.toLocaleDateString('ru-RU', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="note-card">
                <div class="note-header">
                    <span class="note-date">${dateString}</span>
                    <button class="note-delete-btn" onclick="deleteNote(${note.id})">✕</button>
                </div>
                <div class="note-text">${escapeHtml(note.text)}</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = notesHtml;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
