document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let gameState = {
        running: false,
        level: 1,
        points: 0
    };

    // Размеры черепашки
    const HERO_WIDTH = 50;
    const HERO_HEIGHT = 50;

    // Определение начальной позиции
    let heroX = canvas.width / 2 - HERO_WIDTH / 2;
    let heroY = canvas.height - HERO_HEIGHT;

    // Объект для управления скоростью
    let speed = 5;

    // Очистка холста
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Прорисовка героя
    function drawHero() {
        ctx.fillStyle = "#00BFFF"; // Голубой цвет для черепашки
        ctx.fillRect(heroX, heroY, HERO_WIDTH, HERO_HEIGHT);
    }

    // Прыжок
    function handleJump() {
        if (heroY === canvas.height - HERO_HEIGHT) {
            heroY -= 100; // Выполняем прыжок
            setTimeout(() => {
                heroY = canvas.height - HERO_HEIGHT; // Возвращаемся обратно
            }, 500); // Длительность прыжка
        }
    }

    // Обработчик начала игры
    document.getElementById('startBtn').addEventListener('click', () => {
        gameState.running = true;
        animate();
    });

    // Обработчик прыжка
    document.getElementById('jumpBtn').addEventListener('click', handleJump);

    // Основной цикл анимации
    function animate() {
        clearCanvas();
        drawHero();
        if (gameState.running) requestAnimationFrame(animate);
    }

    // Начало игры
    animate();
});