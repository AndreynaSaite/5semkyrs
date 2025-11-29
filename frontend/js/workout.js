// js/workout.js - полностью обновленная версия
const WorkoutManager = {
    workouts: [],

    // Инициализация
    init() {
        this.setupEventListeners();
        if (Auth.currentUser) {
            this.loadWorkouts();
        }
    },

    // Загрузка тренировок
    async loadWorkouts() {
        try {
            this.workouts = await this.loadWorkoutsFromServer();
            this.renderWorkouts();
            this.renderTodayWorkout();
        } catch (error) {
            console.error('Error loading workouts:', error);
        }
    },

    // Загрузка тренировок с сервера
    async loadWorkoutsFromServer() {
        if (!API.token) return [];
        
        try {
            const response = await API.getMyWorkouts();
            console.log('Workouts from server:', response);
            
            if (response && Array.isArray(response)) {
                return response.map(train => this.transformTrainData(train));
            }
            return [];
        } catch (error) {
            console.error('Error loading workouts from server:', error);
            return [];
        }
    },

    // Преобразование данных с сервера в формат фронтенда
    transformTrainData(train) {
        const date = new Date(train.date_train_time);
        const dateString = date.toISOString().split('T')[0];
        
        return {
            id: train.id.toString(),
            date: dateString,
            day: this.getDayOfWeek(date),
            category: train.typetrain,
            timeFrom: this.formatTimeWithoutSeconds(train.time_train),
            timeTo: this.formatTimeWithoutSeconds(train.end_time),
            exercises: Array.isArray(train.exercises) ? train.exercises : [],
            completed: train.is_ready || false,
            createdAt: train.date_train_time,
            // Сохраняем оригинальные данные для обновлений
            originalData: train
        };
    },

    // Форматирование времени без секунд
    formatTimeWithoutSeconds(timeString) {
        if (!timeString) return '';
        // Убираем секунды если они есть (формат HH:MM:SS -> HH:MM)
        return timeString.split(':').slice(0, 2).join(':');
    },

    // Получение дня недели
    getDayOfWeek(date) {
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        return days[date.getDay()];
    },

    // Форматирование даты в формат DD.MM.YYYY
    formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    },

    // Настройка обработчиков событий
    setupEventListeners() {
        // Форма добавления тренировки
        const addWorkoutForm = document.getElementById('addWorkoutForm');
        if (addWorkoutForm) {
            addWorkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddWorkout();
            });
        }

        // Кнопка добавления упражнения
        const addExerciseBtn = document.getElementById('addExerciseBtn');
        if (addExerciseBtn) {
            addExerciseBtn.addEventListener('click', () => {
                this.addExerciseField();
            });
        }

        // Кнопка отмены
        const cancelBtn = document.getElementById('cancelWorkoutBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.closeModals();
            });
        }
    },

    // Показать модальное окно добавления тренировки
    showAddWorkoutModal() {
        if (!Auth.currentUser) {
            alert('Пожалуйста, войдите в систему');
            return;
        }

        // Сброс формы
        document.getElementById('addWorkoutForm').reset();
        document.getElementById('exercisesContainer').innerHTML = '';
        
        // Добавляем первое упражнение
        this.addExerciseField();
        
        // Устанавливаем сегодняшнюю дату по умолчанию
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('workoutDate').value = today;
        
        // Показываем модальное окно
        document.getElementById('workoutModal').style.display = 'block';
    },

    // Добавить поле для упражнения
    addExerciseField() {
        const container = document.getElementById('exercisesContainer');
        const exerciseCount = container.children.length + 1;
        
        const exerciseHTML = `
            <div class="exercise-input" data-index="${exerciseCount}">
                <div class="exercise-input-header">
                    <strong>Упражнение ${exerciseCount}</strong>
                    <button type="button" class="remove-exercise">&times;</button>
                </div>
                <div class="exercise-input-fields">
                    <input type="text" placeholder="Название упражнения" required>
                    <input type="number" placeholder="Подходы" min="1" required>
                    <input type="number" placeholder="Повторения" min="1" required>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', exerciseHTML);
        
        // Автоматическая прокрутка к новому упражнению
        const lastExercise = container.lastElementChild;
        lastExercise.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Добавляем обработчик для кнопки удаления
        lastExercise.querySelector('.remove-exercise').addEventListener('click', () => {
            lastExercise.remove();
            this.renumberExercises();
        });
    },

    // Перенумеровать упражнения
    renumberExercises() {
        const container = document.getElementById('exercisesContainer');
        Array.from(container.children).forEach((exercise, index) => {
            const header = exercise.querySelector('.exercise-input-header strong');
            header.textContent = `Упражнение ${index + 1}`;
            exercise.dataset.index = index + 1;
        });
    },

    // Обработка добавления тренировки
    async handleAddWorkout() {
        if (!Auth.currentUser) {
            alert('Пожалуйста, войдите в систему');
            return;
        }

        const date = document.getElementById('workoutDate').value;
        const category = document.getElementById('workoutCategory').value;
        const timeFrom = document.getElementById('workoutTimeFrom').value;
        const timeTo = document.getElementById('workoutTimeTo').value;

        // Собираем упражнения
        const exercises = [];
        const exerciseInputs = document.querySelectorAll('.exercise-input');
        
        exerciseInputs.forEach(exercise => {
            const inputs = exercise.querySelectorAll('input');
            exercises.push({
                name: inputs[0].value,
                sets: parseInt(inputs[1].value),
                reps: parseInt(inputs[2].value)
            });
        });

        // Валидация
        if (!date || !category || !timeFrom || !timeTo || exercises.length === 0) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        try {
            // Подготавливаем данные для бэкенда
            const workoutData = {
                client_id: Auth.currentUser.id, // ID из JWT токена
                typetrain: category,
                date_train_time: new Date(date + 'T' + timeFrom).toISOString(),
                time_train: timeFrom + ':00', // Добавляем секунды
                end_time: timeTo + ':00',     // Добавляем секунды
                exercises: exercises,
                is_ready: false
            };

            console.log('Sending workout data:', workoutData);

            // Отправляем на бэкенд
            const result = await API.addWorkout(workoutData);
            console.log('Workout added successfully:', result);

            this.closeModals();
            
            // Перезагружаем тренировки
            await this.loadWorkouts();
            
            if (typeof UI !== 'undefined') {
                UI.showNotification('Тренировка успешно добавлена!', 'success');
            }
        } catch (error) {
            console.error('Error adding workout:', error);
            alert('Ошибка при добавлении тренировки: ' + error.message);
        }
    },

    // Рендер тренировок
    renderWorkouts() {
        const weekScroll = document.getElementById('weekScroll');
        if (!weekScroll) return;

        const weekWorkouts = this.getWeekWorkouts();
        const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
        
        let html = '';
        
        days.forEach(day => {
            const workout = weekWorkouts[day];
            
            if (workout) {
                html += `
                    <div class="day-card" data-workout-id="${workout.id}" data-date="${workout.date}">
                        <div class="day-name">${day}</div>
                        <div class="day-category">${workout.category}</div>
                        <div class="day-time">${workout.timeFrom} - ${workout.timeTo}</div>
                        <div class="day-exercises">${workout.exercises.length} упражнений</div>
                        <div class="day-completed">
                            <div class="checkmark ${workout.completed ? 'checked' : ''}">✓</div>
                            <span>${workout.completed ? 'Выполнено' : 'Не выполнено'}</span>
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <div class="day-card">
                        <div class="day-name">${day}</div>
                        <div class="day-category">Нет тренировки</div>
                        <div class="day-time">-</div>
                        <div class="day-exercises">0 упражнений</div>
                        <div class="day-completed">
                            <div class="checkmark">✓</div>
                            <span>Не выполнено</span>
                        </div>
                    </div>
                `;
            }
        });
        
        weekScroll.innerHTML = html;
        
        // Добавляем обработчики для карточек
        this.setupDayCardListeners();
    },

    // Рендер сегодняшней тренировки
    renderTodayWorkout() {
        const todayWorkout = this.getTodayWorkout();
        const todayCategory = document.getElementById('todayCategory');
        const todayExercises = document.getElementById('todayExercises');
        
        if (!todayCategory || !todayExercises) return;

        if (todayWorkout) {
            todayCategory.textContent = todayWorkout.category;
            
            let exercisesHTML = '';
            todayWorkout.exercises.forEach((exercise, index) => {
                exercisesHTML += `
                    <div class="exercise-item">
                        <div class="exercise-number">${index + 1}</div>
                        <div class="exercise-details">
                            <div class="exercise-name">${exercise.name}</div>
                            <div class="exercise-sets">${exercise.sets} * ${exercise.reps}</div>
                        </div>
                    </div>
                `;
            });
            
            todayExercises.innerHTML = exercisesHTML;
        } else {
            todayCategory.textContent = 'Нет тренировки';
            todayExercises.innerHTML = '<p class="no-workout">На сегодня тренировок не запланировано</p>';
        }
    },

    // Получить тренировки на неделю
    getWeekWorkouts() {
        const weekWorkouts = {};
        const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
        
        days.forEach(day => {
            weekWorkouts[day] = this.findWorkoutByDay(day);
        });
        
        return weekWorkouts;
    },

    // Найти тренировку по дню недели
    findWorkoutByDay(day) {
        return this.workouts.find(w => w.day === day);
    },

    // Получить тренировку на сегодня
    getTodayWorkout() {
        const today = new Date().toISOString().split('T')[0];
        return this.workouts.find(w => w.date === today);
    },

    // Настройка обработчиков для карточек дней
    setupDayCardListeners() {
        document.querySelectorAll('.day-card').forEach(card => {
            card.addEventListener('click', () => {
                const workoutId = card.dataset.workoutId;
                const date = card.dataset.date;
                
                if (workoutId && date) {
                    this.showWorkoutDetail(workoutId, date);
                }
            });
        });
    },

    // Показать детальную информацию о тренировке
    showWorkoutDetail(workoutId, date) {
        const workout = this.workouts.find(w => w.id === workoutId && w.date === date);
        if (!workout) return;

        const detailContent = document.getElementById('detailContent');
        const workoutDetail = document.getElementById('workoutDetail');
        
        if (!detailContent || !workoutDetail) return;

        let exercisesHTML = '';
        workout.exercises.forEach((exercise, index) => {
            exercisesHTML += `
                <div class="detail-exercise">
                    <span>${index + 1}. ${exercise.name}</span>
                    <span>${exercise.sets} * ${exercise.reps}</span>
                </div>
            `;
        });

        detailContent.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Категория:</span>
                <span class="detail-value">${workout.category}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Дата:</span>
                <span class="detail-value">${this.formatDate(workout.date)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Количество упражнений:</span>
                <span class="detail-value">${workout.exercises.length}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Статус:</span>
                <span class="detail-value">${workout.completed ? 'Выполнено' : 'Не выполнено'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Время:</span>
                <span class="detail-value">${workout.timeFrom} - ${workout.timeTo}</span>
            </div>
            <div class="detail-exercises">
                <h4>Упражнения:</h4>
                ${exercisesHTML}
            </div>
        `;
        
        workoutDetail.style.display = 'block';
    },

    // Закрыть модальные окна
    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    },

    // Очистка тренировок при выходе
    clearWorkouts() {
        this.workouts = [];
        this.renderWorkouts();
        this.renderTodayWorkout();
    }
};