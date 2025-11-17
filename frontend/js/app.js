// Главный файл приложения
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех модулей
    API.init();
    Auth.init();
    WorkoutManager.init();
    UI.init();

    // Загрузка данных при загрузке страницы
    if (Auth.currentUser && API.isTokenValid()) {
        WorkoutManager.loadWorkouts();
    } else {
        // Если токен не валиден, разлогиниваем
        if (Auth.currentUser) {
            Auth.logout();
        }
    }

    console.log('Фитнес-трекер инициализирован');
});