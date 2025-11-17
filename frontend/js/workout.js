// Модуль управления тренировками
const WorkoutManager = {
    workouts: {},

    // Инициализация
    init() {
        this.loadWorkouts();
        this.setupEventListeners();
    },

    // Загрузка тренировок
    async loadWorkouts() {
        this.workouts = await this.loadWorkoutsFromServer();
        this.renderWorkouts();
        this.renderTodayWorkout();
    },

    // Сохранение тренировок
    async saveWorkouts() {
        await this.saveWorkoutsToServer();
    },

    // Загрузка тренировок с сервера
    async loadWorkoutsFromServer() {
        if (!API.token) return {};
        
        try {
            // Здесь будет запрос к API для получения тренировок
            // Пока используем localStorage как fallback
            const allWorkouts = Storage.getItem(Storage.KEYS.WORKOUTS) || {};
            const currentUser = Auth.currentUser;
            
            if (currentUser) {
                return allWorkouts[currentUser.id] || {};
            }
            return {};
        } catch (error) {
            console.error('Error loading workouts from server:', error);
            return {};
        }
    },

    // Сохранение тренировок на сервер
    async saveWorkoutsToServer() {
        if (!API.token) return false;
        
        try {
            // Здесь будет запрос к API для сохранения тренировок
            // Пока сохраняем в localStorage
            const allWorkouts = Storage.getItem(Storage.KEYS.WORKOUTS) || {};
            const currentUser = Auth.currentUser;
            
            if (currentUser) {
                allWorkouts[currentUser.id] = this.workouts;
                Storage.setItem(Storage.KEYS.WORKOUTS, allWorkouts);
            }
            return true;
        } catch (error) {
            console.error('Error saving workouts to server:', error);
            return false;
        }
    },

    // Очистка тренировок при выходе
    clearWorkouts() {
        this.workouts = {};
        this.renderWorkouts();
        this.renderTodayWorkout();
    },

    // Настройка обработчиков событий
    setupEventListeners() {
        // Форма добавления тренировки
        document.getElementById('addWorkoutForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddWorkout(e.target);
        });

        // Кнопка добавления упражнения
        document.getElementById('addExerciseBtn').addEventListener('click', () => {
            this.addExerciseField();
        });

        // Кнопка отмены
        document.getElementById('cancelWorkoutBtn').addEventListener('click', () => {
            this.closeModals();
        });
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
        
        // Добавляем обработчик для кнопки удаления
        const lastExercise = container.lastElementChild;
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
    async handleAddWorkout(form) {
        if (!Auth.currentUser) {
            alert('Пожалуйста, войдите в систему');
            return;
        }

        const date = document.getElementById('workoutDate').value;
        const day = document.getElementById('workoutDay').value;
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

        // Создаем тренировку
        const workout = {
            id: Date.now().toString(),
            date,
            day,
            category,
            timeFrom,
            timeTo,
            exercises,
            completed: false,
            createdAt: new Date().toISOString()
        };

        // Сохраняем тренировку
        if (!this.workouts[date]) {
            this.workouts[date] = [];
        }
        this.workouts[date].push(workout);
        
        await this.saveWorkouts();
        this.closeModals();
        this.loadWorkouts();
        
        if (typeof UI !== 'undefined') {
            UI.showNotification('Тренировка успешно добавлена!', 'success');
        }
    },

    // Отметить тренировку как выполненную
    async toggleWorkoutCompletion(workoutId, date) {
        const workout = this.workouts[date]?.find(w => w.id === workoutId);
        if (workout) {
            workout.completed = !workout.completed;
            await this.saveWorkouts();
            this.loadWorkouts();
        }
    },

    // Получить тренировки на определенную дату
    getWorkoutsByDate(date) {
        return this.workouts[date] || [];
    },

    // Получить тренировку на сегодня
    getTodayWorkout() {
        const today = new Date().toISOString().split('T')[0];
        return this.getWorkoutsByDate(today)[0] || null;
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
        for (const date in this.workouts) {
            const workoutsOnDate = this.workouts[date];
            const workout = workoutsOnDate.find(w => w.day === day);
            if (workout) return workout;
        }
        return null;
    },

    // Рендер тренировок
    renderWorkouts() {
        const weekScroll = document.getElementById('weekScroll');
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
        
        // Обновляем слайдер после рендеринга
        if (typeof UI !== 'undefined') {
            setTimeout(() => {
                UI.createSliderIndicators();
                UI.updateNavButtons();
                UI.setupDragScroll(weekScroll);
            }, 100);
        }
    },

    // Рендер сегодняшней тренировки
    renderTodayWorkout() {
        const todayWorkout = this.getTodayWorkout();
        const todayCategory = document.getElementById('todayCategory');
        const todayExercises = document.getElementById('todayExercises');
        
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

        // Обработчики для галочек выполнения
        document.querySelectorAll('.checkmark').forEach(checkmark => {
            checkmark.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = e.target.closest('.day-card');
                const workoutId = card.dataset.workoutId;
                const date = card.dataset.date;
                
                if (workoutId && date) {
                    this.toggleWorkoutCompletion(workoutId, date);
                }
            });
        });
    },

    // Показать детальную информацию о тренировке
    showWorkoutDetail(workoutId, date) {
        const workout = this.workouts[date]?.find(w => w.id === workoutId);
        if (!workout) return;

        const detailContent = document.getElementById('detailContent');
        const workoutDetail = document.getElementById('workoutDetail');
        
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
                <span class="detail-value">${workout.date}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">День недели:</span>
                <span class="detail-value">${workout.day}</span>
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
    }
};
