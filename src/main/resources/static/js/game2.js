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
let spaceBar, rKey;

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

    // Группируем трубы
    pipes = this.physics.add.group({ allowGravity: false });

    // Текст счёта
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '28px',
        fill: '#fff',
        backgroundColor: '#0008',
        padding: { x: 10, y: 5 }
    });

    // Анимация птицы (с проверкой существования)
    if (!this.anims.exists('flap')) {
        this.anims.create({
            key: 'flap',
            frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    }
    bird.anims.play('flap');

    // Регистрация клавиш
    spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    // Метод перезапуска (внутри create для правильного контекста)
    this.handleRestart = () => {
        if (gameOver) {
            this.scene.restart();
        }
    };

    // Обработчик перезапуска сцены
    this.events.on('restart', resetGame.bind(this));

    // Генерация труб
    this.pipeTimer = this.time.addEvent({
        delay: 1500,
        callback: generatePipe,
        callbackScope: this,
        loop: true
    });
}

function update() {
    // Если игра окончена — только проверяем R
    if (gameOver) {
        if (Phaser.Input.Keyboard.JustDown(rKey)) {
            this.handleRestart();
            gameOver = false;
            score = 0;
        }
        return; // Выходим, не выполняя остальную логику
    }

    // Логика активной игры
    if (Phaser.Input.Keyboard.JustDown(spaceBar)) {
        bird.setVelocityY(-350);
    }

    this.physics.world.collide(bird, pipes, hitPipe, null, this);


    pipes.getChildren().forEach(pipe => {
        if (!pipe.passed && pipe.x < bird.x - pipe.displayWidth / 2) {
            pipe.passed = true;
            score++;
            scoreText.setText(`Score: ${score}`);
        }
    });

    if (bird.y >= 580) {
        endGame();
    }
}

// Сброс игры
function resetGame() {
    gameOver = false;
    score = 0;
    scoreText.setText('Score: 0');

    bird.setPosition(100, 300);
    bird.clearTint();
    bird.setVelocity(0, 0); // Обнуляем скорость


    // Восстанавливаем анимацию
    if (!bird.anims.isPlaying('flap') && this.anims.exists('flap')) {
        bird.anims.play('flap');
    }

    // ПОЛНАЯ очистка труб
    if (pipes) {
        pipes.getChildren().forEach(pipe => {
            if (pipe && pipe.active) {
                pipe.passed = false;
                pipe.body.enable = false; // Отключаем физику
                pipe.destroy(true);      // Принудительно удаляем
            }
        });
        pipes.clear(true, true);
    }
    // Удаляем старый таймер
    if (this.pipeTimer) {
        this.pipeTimer.remove();
    }

    // Создаём новый таймер генерации труб
    this.pipeTimer = this.time.addEvent({
        delay: 1500,
        callback: generatePipe,
        callbackScope: this,
        loop: true
    });
}

// Генерация новой пары труб
function generatePipe() {
    if (gameOver) return;

    const GAP = 250;
    const MIN_PIPE_HEIGHT = 150;
    const MAX_PIPE_HEIGHT = 150;
    const PIPE_WIDTH = 60;
    const pipeY = Phaser.Math.Between(200, 400);

    const topHeight = Phaser.Math.Between(MIN_PIPE_HEIGHT, MAX_PIPE_HEIGHT);
    const bottomHeight = Phaser.Math.Between(MIN_PIPE_HEIGHT, MAX_PIPE_HEIGHT);

    // Верхняя труба
    const topPipe = pipes.create(800, pipeY - GAP / 2, 'pipe');
    topPipe.setDisplaySize(PIPE_WIDTH, topHeight);
    topPipe.setOrigin(0.5, 0.5);
    topPipe.setFlipY(true);
    topPipe.body.setSize(PIPE_WIDTH, topHeight, true);
    topPipe.body.velocity.x = -200;
    topPipe.passed = false;

    // Нижняя труба
    const bottomPipe = pipes.create(800, pipeY + GAP / 2, 'pipe');
    bottomPipe.setDisplaySize(PIPE_WIDTH, bottomHeight);
    bottomPipe.setOrigin(0.5, 0.5);
    bottomPipe.body.setSize(PIPE_WIDTH, bottomHeight, true);
    bottomPipe.body.velocity.x = -200;
    bottomPipe.passed = false; // Явно задаём

    // Таймер удаления
    this.time.delayedCall(4000, () => {
        if (topPipe.active) {
            topPipe.destroy();
            bottomPipe.destroy();
        }
    }, [], this);
}

// Столкновение с трубой
function hitPipe(bird, pipe) {
    endGame();
}

// Завершение игры
function endGame() {
    gameOver = true;
    bird.setTint(0xff0000);
    bird.anims.pause();
    scoreText.setText(`Game Over! Score: ${score} | Press R to Restart`);

    pipes.clear(true, true);

    // Гарантированно удаляем таймер
    if (this.pipeTimer) {
        this.pipeTimer.remove();
        this.pipeTimer = null;
    }
}

// Очистка при закрытии сцены
function shutdown() {
    this.input.keyboard.removeKey(spaceBar);
    this.input.keyboard.removeKey(rKey);


    if (this.pipeTimer) {
        this.pipeTimer.remove();
        this.pipeTimer = null;
    }

    // Удаляем анимацию при закрытии сцены
    if (this.anims.exists('flap')) {
        this.anims.remove('flap');
    }
}
