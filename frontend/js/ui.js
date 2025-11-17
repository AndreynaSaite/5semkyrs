// Модуль пользовательского интерфейса
const UI = {
    // Инициализация
    init() {
        this.setupGlobalEventListeners();
        this.setupDateSync();
    },

    // Глобальные обработчики событий
    setupGlobalEventListeners() {
        // Закрытие модальных окон при клике вне их
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Синхронизация даты и дня недели
        document.getElementById('workoutDate').addEventListener('change', (e) => {
            this.updateDayOfWeek(e.target.value);
        });
    },

    // Синхронизация даты и дня недели
    setupDateSync() {
        const dateInput = document.getElementById('workoutDate');
        if (dateInput.value) {
            this.updateDayOfWeek(dateInput.value);
        }
    },

    // Обновление дня недели на основе даты
    updateDayOfWeek(dateString) {
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const date = new Date(dateString);
        const dayOfWeek = days[date.getDay()];
        
        const daySelect = document.getElementById('workoutDay');
        daySelect.value = dayOfWeek;
    },

            // Показать ошибку
    showError(message) {
        this.showNotification(message, 'error');
    },

    // Показать уведомление
    showNotification(message, type = 'success') {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Стили для уведомления
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Автоматическое скрытие
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);

    }
};