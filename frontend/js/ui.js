// Модуль пользовательского интерфейса
const UI = {
    // Инициализация
    init() {
        this.setupGlobalEventListeners();
    },

    // Глобальные обработчики событий
    setupGlobalEventListeners() {
        // Закрытие модальных окон при клике вне их
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Синхронизация даты и дня недели (если элемент существует)
        const workoutDate = document.getElementById('workoutDate');
        if (workoutDate) {
            workoutDate.addEventListener('change', (e) => {
                this.updateDayOfWeek(e.target.value);
            });
        }
    },

    // Обновление дня недели на основе даты
    updateDayOfWeek(dateString) {
        // Проверяем существование элемента workoutDay
        const daySelect = document.getElementById('workoutDay');
        if (!daySelect) return; // Если элемента нет, выходим
        
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const date = new Date(dateString);
        
        // Проверяем валидность даты
        if (isNaN(date.getTime())) return;
        
        const dayOfWeek = days[date.getDay()];
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
            max-width: 300px;
            word-wrap: break-word;
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
    },

    // Создание индикаторов слайдера (если используется)
    createSliderIndicators() {
        // Проверяем существование элементов перед работой с ними
        const weekScroll = document.getElementById('weekScroll');
        const sliderIndicators = document.getElementById('sliderIndicators');
        
        if (!weekScroll || !sliderIndicators) return;
        
        // Ваш код для создания индикаторов
        const dayCards = weekScroll.querySelectorAll('.day-card');
        let indicatorsHTML = '';
        
        dayCards.forEach((_, index) => {
            indicatorsHTML += `
                <div class="slider-indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
            `;
        });
        
        sliderIndicators.innerHTML = indicatorsHTML;
    },

    // Обновление кнопок навигации (если используется)
    updateNavButtons() {
        const prevBtn = document.getElementById('prevWeek');
        const nextBtn = document.getElementById('nextWeek');
        
        if (!prevBtn || !nextBtn) return;
        
        // Ваша логика обновления кнопок
    },

    // Настройка drag-scroll (если используется)
    setupDragScroll(element) {
        if (!element) return;
        
        // Ваша логика drag-scroll
        let isDragging = false;
        let startX;
        let scrollLeft;

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - element.offsetLeft;
            scrollLeft = element.scrollLeft;
        });

        element.addEventListener('mouseleave', () => {
            isDragging = false;
        });

        element.addEventListener('mouseup', () => {
            isDragging = false;
        });

        element.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - element.offsetLeft;
            const walk = (x - startX) * 2;
            element.scrollLeft = scrollLeft - walk;
        });
    },

    // Дополнительные методы для улучшения UX

    // Показать/скрыть лоадер
    showLoader(show = true) {
        let loader = document.getElementById('globalLoader');
        
        if (show) {
            if (!loader) {
                loader = document.createElement('div');
                loader.id = 'globalLoader';
                loader.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                `;
                loader.innerHTML = `
                    <div style="
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    ">
                        Загрузка...
                    </div>
                `;
                document.body.appendChild(loader);
            }
        } else {
            if (loader && loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }
    },

    // Валидация формы
    validateForm(formData) {
        const errors = [];
        
        // Проверка обязательных полей
        if (!formData.date) errors.push('Дата обязательна для заполнения');
        if (!formData.category) errors.push('Категория обязательна для заполнения');
        if (!formData.timeFrom) errors.push('Время начала обязательно');
        if (!formData.timeTo) errors.push('Время окончания обязательно');
        
        // Проверка времени
        if (formData.timeFrom && formData.timeTo) {
            if (formData.timeFrom >= formData.timeTo) {
                errors.push('Время окончания должно быть позже времени начала');
            }
        }
        
        return errors;
    },

    // Показать ошибки формы
    showFormErrors(errors, formElement) {
        // Удаляем предыдущие ошибки
        const existingErrors = formElement.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());
        
        // Показываем новые ошибки
        errors.forEach(error => {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.cssText = `
                color: #f44336;
                font-size: 12px;
                margin-top: 5px;
            `;
            errorElement.textContent = error;
            formElement.appendChild(errorElement);
        });
    },

    // Очистить ошибки формы
    clearFormErrors(formElement) {
        const errors = formElement.querySelectorAll('.error-message');
        errors.forEach(error => error.remove());
    }
};