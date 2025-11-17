// Модуль для работы с API
const API = {
    BASE_URL: 'http://localhost:8085', // Базовый URL бэкенда
    token: null,

    // Инициализация
    init() {
        this.loadToken();
    },

    // Загрузка токена из localStorage
    loadToken() {
        this.token = localStorage.getItem('auth_token');
    },

    // Сохранение токена
    saveToken(token) {
        this.token = token;
        localStorage.setItem('auth_token', token);
    },

    // Удаление токена
    removeToken() {
        this.token = null;
        localStorage.removeItem('auth_token');
    },

    // Базовые заголовки для запросов
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (includeAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    },

    // Обработка ответа
    async handleResponse(response) {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    // API методы

    // Авторизация
    async login(email, password) {
        try {
            const response = await fetch(`${this.BASE_URL}/client/login`, {
                method: 'POST',
                headers: this.getHeaders(false),
                body: JSON.stringify({ email, password })
            });

            const data = await this.handleResponse(response);
            
            if (data.status === 'ok' && data.JWT) {
                this.saveToken(data.JWT);
                return { success: true, user: this.decodeToken(data.JWT) };
            } else {
                return { success: false, message: data.detail || 'Ошибка авторизации' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: error.message || 'Ошибка соединения' };
        }
    },

    // Регистрация
    async register(email, password, full_name) {
        try {
            const response = await fetch(`${this.BASE_URL}/client/register`, {
                method: 'POST',
                headers: this.getHeaders(false),
                body: JSON.stringify({ email, password, full_name })
            });

            const data = await this.handleResponse(response);
            
            if (data.status === 'ok' && data.JWT) {
                this.saveToken(data.JWT);
                return { success: true, user: this.decodeToken(data.JWT) };
            } else {
                return { success: false, message: data.detail || 'Ошибка регистрации' };
            }
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, message: error.message || 'Ошибка соединения' };
        }
    },

    // Декодирование JWT токена
    decodeToken(token) {
        try {
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload));
            return decoded;
        } catch (error) {
            console.error('Token decode error:', error);
            return null;
        }
    },

    // Получение текущего пользователя из токена
    getCurrentUser() {
        if (!this.token) return null;
        
        const user = this.decodeToken(this.token);
        return user;
    },

    // Проверка валидности токена
    isTokenValid() {
        const user = this.getCurrentUser();
        if (!user) return false;

        // Проверяем expiry токена
        const currentTime = Date.now() / 1000;
        return user.exp > currentTime;
    },

    // Выход
    logout() {
        this.removeToken();
    }
};