// Работа с localStorage
const Storage = {
    // Ключи для хранения данных
    KEYS: {
        USERS: 'fitness_tracker_users',
        CURRENT_USER: 'fitness_tracker_current_user',
        WORKOUTS: 'fitness_tracker_workouts'
    },

    // Сохранить данные
    setItem(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Ошибка сохранения данных:', error);
            return false;
        }
    },

    // Получить данные
    getItem(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Ошибка чтения данных:', error);
            return null;
        }
    },

    // Удалить данные
    removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Ошибка удаления данных:', error);
            return false;
        }
    },

    // Инициализация данных
    init() {
        // Инициализация пользователей
        if (!this.getItem(this.KEYS.USERS)) {
            this.setItem(this.KEYS.USERS, []);
        }

        // Инициализация тренировок
        if (!this.getItem(this.KEYS.WORKOUTS)) {
            this.setItem(this.KEYS.WORKOUTS, {});
        }
    }
};

// Инициализация при загрузке
Storage.init();