// Конфигурация игры
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        shutdown: shutdown
    }
};

let game = new Phaser.Game(config);

let bird, pipes, scoreText, score = 0;
let gameOver = false;

// Загрузка ресурсов
function preload() {
    const baseUrl = window.appContext || '/';

    this.load.image('background', baseUrl + 'static/assets/Background.png');
    this.load.spritesheet('bird', baseUrl + 'static/assets/Player.png', {
        frameWidth: 32,
        frameHeight: 48
    });
    this.load.image('pipe', baseUrl + 'static/assets/Obstacle.png');
}

// Создание сцены
function create() {
    // Фон
    this.add.image(400, 300, 'background').setDisplaySize(800, 600);

    // Птица
    bird = this.physics.add.sprite(100, 300, 'bird');
    bird.setCollideWorldBounds(true);
    bird.body.setGravityY(400);
    bird.setOrigin(0.5, 0.5);
    bird.body.setSize(20, 20, true);

    // Группируем трубы (динамическая группа)
    pipes = this.physics.add.group({ allowGravity: false });

    // Текст счета
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '28px',
        fill: '#fff',
        backgroundColor: '#0008',
        padding: { x: 10, y: 5 }
    });

    // Генерация труб каждые 1.5 секунд
    this.time.addEvent({
        delay: 1500,
        callback: generatePipe,
        callbackScope: this,
        loop: true
    });

    // Анимация птицы
    this.anims.create({
        key: 'flap',
        frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });
    bird.anims.play('flap');

    // Регистрация кнопок управления
    spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
}

// Генерация новой пары труб
function generatePipe() {
    // Основные параметры
    const GAP = 250;                 // Разрыв между трубами
    const MIN_PIPE_HEIGHT = 150;      // Минимальная высота трубы
    const MAX_PIPE_HEIGHT = 150;      // Максимальная высота трубы
    const PIPE_WIDTH = 60;            // Ширина трубы

    // Центр размещения труб по высоте
    const pipeY = Phaser.Math.Between(200, 400);

    // Случайная высота верхней трубы
    const topHeight = Phaser.Math.Between(MIN_PIPE_HEIGHT, MAX_PIPE_HEIGHT);
    const bottomHeight = Phaser.Math.Between(MIN_PIPE_HEIGHT, MAX_PIPE_HEIGHT);

    // Верхняя труба (перевёрнута вверх ногами)
    const topPipe = pipes.create(800, pipeY - GAP / 2, 'pipe');
    topPipe.setDisplaySize(PIPE_WIDTH, topHeight);
    topPipe.setOrigin(0.5, 0.5);
    topPipe.setFlipY(true);           // переворачиваем трубу вертикально
    topPipe.body.setSize(PIPE_WIDTH, topHeight, true);
    topPipe.body.setOffset(0, 0);
    topPipe.body.velocity.x = -200;   // перемещаемся влево

    // Нижняя труба
    const bottomPipe = pipes.create(800, pipeY + GAP / 2, 'pipe');
    bottomPipe.setDisplaySize(PIPE_WIDTH, bottomHeight);
    bottomPipe.setOrigin(0.5, 0.5);
    bottomPipe.body.setSize(PIPE_WIDTH, bottomHeight, true);
    bottomPipe.body.setOffset(0, 0);
    bottomPipe.body.velocity.x = -200; // перемещаемся влево

    // Логический флаг прохождения трубы
    topPipe.passed = false;

    // Автоматически удаляем трубу спустя некоторое время
    this.time.addEvent({
        delay: 4000,
        callback: () => {
            if (topPipe.active) {
                topPipe.destroy();
                bottomPipe.destroy();
            }
        },
        callbackScope: this
    });
}

// Основной цикл обновления
function update() {
    if (gameOver) return;

    // Ключевое действие: прыжок при нажатии на пробел
    if (Phaser.Input.Keyboard.JustDown(spaceBar)) {
        bird.setVelocityY(-350);
    }

    // Проверка столкновения птицы с трубами
    this.physics.world.collide(bird, pipes, hitPipe, null, this);

    // Подсчет очков при прохождении труб
    pipes.getChildren().forEach(pipe => {
        if (!pipe.passed && pipe.x < bird.x - pipe.displayWidth / 2) {
            pipe.passed = true;
            score++;
            scoreText.setText(`Score: ${score}`);
        }
    });

    // Завершение игры при касании земли
    if (bird.y >= 580) {
        endGame();
    }

    // Возможность перезагрузки уровня при нажатии R
    if (gameOver && rKey.isDown) {
        handleRestart();
    }
}

// Функция завершения игры
function hitPipe(bird, pipe) {
    endGame();
}

// Обработчик нажатия R для перезапуска
function handleRestart() {
    if (gameOver) {
        this.scene.restart(); // Переход на начало игры
    }
}

// Закрытие сцены и очистка объектов
function shutdown() {
    this.input.keyboard.removeKey(spaceBar);
    this.input.keyboard.removeKey(rKey);
}

// Основная логика окончания игры
function endGame() {
    gameOver = true;
    bird.setTint(0xff0000); // Красим птицу красным цветом
    scoreText.setText(`Game Over!\nScore: ${score}\nPress R to Restart`);
}