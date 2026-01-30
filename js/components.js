/**
 * Components - Reusable UI components
 */

// Label mapping
const LABELS = {
    sleep: 'Уснул(а)',
    wake: 'Проснул(ась)',
    food: 'Поел(а)',
    shop: 'Покупались',
};

// Duration formatting
function formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) return `${h}ч ${m}мин`;
    return `${m} мин`;
}

// Get label by event type
function getLabel(type) {
    return LABELS[type] || 'Событие';
}

// Format date/time
function formatDateTime(isoString) {
    const date = new Date(isoString);
    const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    return { time, date: dateStr };
}

// Calculate duration badge for history item
function calculateDurationBadge(event, index, events) {
    let durationHtml = '';

    if (event.type === 'wake') {
        const lastSleep = events.slice(index + 1).find(e => e.type === 'sleep');
        if (lastSleep) {
            const diffMs = new Date(event.timestamp) - new Date(lastSleep.timestamp);
            const dur = formatDuration(diffMs);
            const sleepHour = new Date(lastSleep.timestamp).getHours();
            const isNight = (sleepHour >= 23 || sleepHour < 7);
            const icon = isNight ? '🌙 Ночной сон' : '💤 Дневной сон';
            const styleClass = isNight ? 'dur-sleep dur-night' : 'dur-sleep';
            durationHtml = `<div class="duration-badge ${styleClass}">${icon}: ${dur}</div>`;
        }
    } else if (event.type === 'sleep') {
        const lastWake = events.slice(index + 1).find(e => e.type === 'wake');
        if (lastWake) {
            const diffMs = new Date(event.timestamp) - new Date(lastWake.timestamp);
            const dur = formatDuration(diffMs);
            durationHtml = `<div class="duration-badge dur-awake">👀 Бодрствовал: ${dur}</div>`;
        }
    }

    return durationHtml;
}

// Render single history item
function renderHistoryItem(event, index, events) {
    const { time, date } = formatDateTime(event.timestamp);
    const durationHtml = calculateDurationBadge(event, index, events);

    return `
        <li class="history-item type-${event.type}">
            <div class="history-info">
                <div class="history-header">
                    <h4 class="history-title">${getLabel(event.type)}</h4>
                    <span class="history-time">${date}, ${time}</span>
                </div>
                
                ${durationHtml}
                ${event.note ? `<div class="history-note">${event.note}</div>` : ''}
            </div>
            <button class="btn-delete" onclick="deleteEvent(${event.id})">✕</button>
        </li>
    `;
}

// Render entire history list
function renderHistory(events) {
    const container = document.getElementById('historyContent');
    
    if (events.length === 0) {
        container.innerHTML = '<div class="empty-state">Пока нет записей. Начните отмечать сон и кормление!</div>';
        return;
    }

    const historyHtml = events
        .map((event, index) => renderHistoryItem(event, index, events))
        .join('');
    
    container.innerHTML = `<ul class="history-list">${historyHtml}</ul>`;
}

// ============= ANALYTICS =============

// Get sleep/awake data by day
function getSleepDataByDay(events) {
    const data = {};
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toLocaleDateString('ru-RU', { month: 'numeric', day: 'numeric' });
        data[dateKey] = { sleep: 0, awake: 0 };
    }

    // Process events
    events.forEach((event, index) => {
        const eventDate = new Date(event.timestamp);
        const dateKey = eventDate.toLocaleDateString('ru-RU', { month: 'numeric', day: 'numeric' });

        if (!data[dateKey]) {
            data[dateKey] = { sleep: 0, awake: 0 };
        }

        if (event.type === 'wake') {
            const lastSleep = events.slice(index + 1).find(e => e.type === 'sleep');
            if (lastSleep) {
                const diffMs = new Date(event.timestamp) - new Date(lastSleep.timestamp);
                const minutes = Math.floor(diffMs / 60000);
                data[dateKey].sleep += minutes;
            }
        } else if (event.type === 'sleep') {
            const lastWake = events.slice(index + 1).find(e => e.type === 'wake');
            if (lastWake) {
                const diffMs = new Date(event.timestamp) - new Date(lastWake.timestamp);
                const minutes = Math.floor(diffMs / 60000);
                data[dateKey].awake += minutes;
            }
        }
    });

    return data;
}

// Format hours and minutes
function formatHours(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} мин`;
    if (m === 0) return `${h}ч`;
    return `${h}ч ${m}мин`;
}

// Get today's stats
function getTodayStats(events) {
    const today = new Date().toLocaleDateString('ru-RU', { month: 'numeric', day: 'numeric' });
    const dataByDay = getSleepDataByDay(events);
    return dataByDay[today] || { sleep: 0, awake: 0 };
}

// Get week average stats
function getWeekStats(events) {
    const dataByDay = getSleepDataByDay(events);
    const values = Object.values(dataByDay);
    
    const totalSleep = values.reduce((sum, day) => sum + day.sleep, 0);
    const totalAwake = values.reduce((sum, day) => sum + day.awake, 0);
    
    return {
        avgSleep: Math.round(totalSleep / values.length),
        avgAwake: Math.round(totalAwake / values.length)
    };
}

// Render analytics
function renderAnalytics(events) {
    const todayStats = getTodayStats(events);
    const weekStats = getWeekStats(events);
    const dataByDay = getSleepDataByDay(events);

    // Render today stats
    const todayHtml = `
        <div class="stat-value">${formatHours(todayStats.sleep)}</div>
        <div class="stat-label">сна</div>
        <div class="stat-value" style="color: var(--wake); font-size: 20px; margin-top: 15px;">${formatHours(todayStats.awake)}</div>
        <div class="stat-label">бодрствования</div>
    `;
    document.getElementById('todaySleepStats').innerHTML = todayHtml;

    // Render week stats
    const weekHtml = `
        <div class="stat-value">${formatHours(weekStats.avgSleep)}</div>
        <div class="stat-label">сна в день (средн)</div>
        <div class="stat-value" style="color: var(--wake); font-size: 20px; margin-top: 15px;">${formatHours(weekStats.avgAwake)}</div>
        <div class="stat-label">бодрствования в день</div>
    `;
    document.getElementById('weekSleepStats').innerHTML = weekHtml;

    // Render charts
    renderSleepChart(dataByDay);
    renderAwakeChart(dataByDay);
}

// Render sleep chart
function renderSleepChart(dataByDay) {
    const ctx = document.getElementById('sleepChart');
    if (!ctx) return;

    // Destroy existing chart if any
    if (window.sleepChartInstance) {
        window.sleepChartInstance.destroy();
    }

    const labels = Object.keys(dataByDay);
    const data = labels.map(label => dataByDay[label].sleep / 60); // Convert to hours

    window.sleepChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Часов сна',
                data: data,
                backgroundColor: 'rgba(9, 132, 227, 0.6)',
                borderColor: 'rgb(9, 132, 227)',
                borderWidth: 2,
                borderRadius: 8,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 24,
                    ticks: {
                        callback: function(value) {
                            return value + 'ч';
                        }
                    }
                }
            }
        }
    });
}

// Render awake chart
function renderAwakeChart(dataByDay) {
    const ctx = document.getElementById('awakeChart');
    if (!ctx) return;

    // Destroy existing chart if any
    if (window.awakeChartInstance) {
        window.awakeChartInstance.destroy();
    }

    const labels = Object.keys(dataByDay);
    const data = labels.map(label => dataByDay[label].awake / 60); // Convert to hours

    window.awakeChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Часов бодрствования',
                data: data,
                backgroundColor: 'rgba(0, 184, 148, 0.6)',
                borderColor: 'rgb(0, 184, 148)',
                borderWidth: 2,
                borderRadius: 8,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 24,
                    ticks: {
                        callback: function(value) {
                            return value + 'ч';
                        }
                    }
                }
            }
        }
    });
}
