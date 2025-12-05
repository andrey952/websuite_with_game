document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let gameState = {
        running: false,
        level: 1,
        points: 0
    };

    const HERO_WIDTH = 50;
    const HERO_HEIGHT = 50;

    let heroX = canvas.width / 2 - HERO_WIDTH / 2;
    let heroY = canvas.height - HERO_HEIGHT;

    let speed = 5;

    // координаты препятствия
    let obstacleX = canvas.width + 50;
    const OBSTACLE_WIDTH = 30;
    const OBSTACLE_HEIGHT = 30;

    window.addEventListener('keydown', event => {
        switch(event.keyCode) {
            case 37: // левая стрелка
                heroX -= speed;
                break;
            case 38: // верхняя стрелка
                handleJump();
                break;
            case 39: // правая стрелка
                heroX += speed;
                break;
            default:
                break;
        }
    });

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawHero() {
        ctx.fillStyle = "#00BFFF";
        ctx.fillRect(heroX, heroY, HERO_WIDTH, HERO_HEIGHT);
    }

    function drawObstacle() {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(obstacleX, canvas.height - OBSTACLE_HEIGHT, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
    }

    function handleJump() {
        if (heroY === canvas.height - HERO_HEIGHT) {
            heroY -= 100;
            setTimeout(() => {
                heroY = canvas.height - HERO_HEIGHT;
            }, 500);
        }
    }

    function moveObstacle() {
        obstacleX -= speed;
        if (obstacleX < -OBSTACLE_WIDTH) {
            obstacleX = canvas.width + 50;
        }
    }

    function checkCollision() {
        return (
        heroX < obstacleX + OBSTACLE_WIDTH &&
        heroX + HERO_WIDTH > obstacleX &&
        heroY < canvas.height - OBSTACLE_HEIGHT &&
        heroY + HERO_HEIGHT > canvas.height - OBSTACLE_HEIGHT
        );
    }

    document.getElementById('startBtn').addEventListener('click', () => {
        gameState.running = true;
        animate();
    });

    document.getElementById('jumpBtn').addEventListener('click', handleJump);

    function animate() {
        clearCanvas();
        drawHero();
        drawObstacle();
        moveObstacle();
        if (checkCollision()) {
            alert('Игра закончена!');
            gameState.running = false;
        }
        if (gameState.running) requestAnimationFrame(animate);
    }

    animate();
});