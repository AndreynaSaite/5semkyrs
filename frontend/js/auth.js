// Модуль авторизации
const Auth = {
    currentUser: null,

    // Инициализация
    init() {
        this.loadCurrentUser();
        this.setupEventListeners();
        this.updateUI();
    },

    // Загрузка текущего пользователя
    loadCurrentUser() {
        this.currentUser = API.getCurrentUser();
    },

    // Сохранение текущего пользователя
    saveCurrentUser(user) {
        this.currentUser = user;
    },

    // Регистрация
    async register(userData) {
        const result = await API.register(
            userData.email, 
            userData.password, 
            userData.full_name
        );
        
        if (result.success) {
            this.saveCurrentUser(result.user);
            return { success: true, user: result.user };
        } else {
            return { success: false, message: result.message };
        }
    },

    // Вход
    async login(email, password) {
        const result = await API.login(email, password);
        
        if (result.success) {
            this.saveCurrentUser(result.user);
            return { success: true, user: result.user };
        } else {
            return { success: false, message: result.message };
        }
    },

    // Выход
    logout() {
        API.logout();
        this.currentUser = null;
        this.updateUI();
        
        // Очищаем тренировки
        if (typeof WorkoutManager !== 'undefined') {
            WorkoutManager.clearWorkouts();
        }
    },

    // Настройка обработчиков событий
    setupEventListeners() {
        // Переключение между вкладками входа и регистрации
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Форма входа
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e.target);
        });

        // Форма регистрации
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e.target);
        });

        // Закрытие модальных окон
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.closeModals();
            });
        });

        // Кнопка входа в шапке
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.showAuthModal();
        });
    },

    // Переключение между вкладками
    switchTab(tab) {
        // Обновление активных кнопок
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        // Показать активную форму
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.toggle('active', form.id === `${tab}Form`);
        });
    },

    // Обработка входа
    async handleLogin(form) {
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;

        // Показываем индикатор загрузки
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Вход...';
        submitBtn.disabled = true;

        const result = await this.login(email, password);
        
        // Восстанавливаем кнопку
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        if (result.success) {
            this.closeModals();
            this.updateUI();
            // Обновляем данные на странице
            if (typeof WorkoutManager !== 'undefined') {
                await WorkoutManager.loadWorkouts(); // Добавьте await
            }
            if (typeof UI !== 'undefined') {
                UI.showNotification('Успешный вход!', 'success');
            }
        
        }
    },

    // Обработка регистрации
    async handleRegister(form) {
        const full_name = form.querySelector('input[name="full_name"]').value;
        const email = form.querySelector('input[name="email"]').value;
        const password = form.querySelector('input[name="password"]').value;

// Валидация
        if (!full_name || !email || !password) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        // Показываем индикатор загрузки
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Регистрация...';
        submitBtn.disabled = true;

        const result = await this.register({ full_name, email, password });
        
        // Восстанавливаем кнопку
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        if (result.success) {
            this.closeModals();
            this.updateUI();
            if (typeof UI !== 'undefined') {
                UI.showNotification('Регистрация успешна!', 'success');
            }
        } else {
            alert(result.message);
        }
    },

    // Показать модальное окно авторизации
    showAuthModal() {
        document.getElementById('authModal').style.display = 'block';
    },

    // Закрыть все модальные окна
    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    },

    // Обновление интерфейса в зависимости от статуса авторизации
    updateUI() {
        const headerActions = document.getElementById('headerActions');
        
        if (this.currentUser && API.isTokenValid()) {
            headerActions.innerHTML = `
                <button class="btn-add-workout" id="addWorkoutBtn">Добавить тренировку</button>
                <div class="user-profile">
                    <div class="user-icon">${this.currentUser.full_name ? this.currentUser.full_name.charAt(0).toUpperCase() : 'U'}</div>
                    <span>${this.currentUser.full_name || 'Пользователь'}</span>
                    <button class="btn-login" id="logoutBtn" style="margin-left: 10px;">Выйти</button>
                </div>
            `;

            // Добавляем обработчики для новых кнопок
            document.getElementById('addWorkoutBtn').addEventListener('click', () => {
                if (typeof WorkoutManager !== 'undefined') {
                    WorkoutManager.showAddWorkoutModal();
                }
            });

            document.getElementById('logoutBtn').addEventListener('click', () => {
                this.logout();
            });
        } else {
            headerActions.innerHTML = '<button class="btn-login" id="loginBtn">Войти</button>';
            document.getElementById('loginBtn').addEventListener('click', () => {
                this.showAuthModal();
            });
            
            // Очищаем текущего пользователя если токен не валиден
            if (this.currentUser) {
                this.currentUser = null;
            }
        }
    }
};