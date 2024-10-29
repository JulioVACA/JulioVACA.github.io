const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const upBtn = document.getElementById('up-btn');
const downBtn = document.getElementById('down-btn');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const restartBtn = document.getElementById('restart-btn');
const currentScoreElem = document.getElementById('current-score');
const highScoreElem = document.getElementById('high-score');

const GRID_SIZE = 20;
let snake, food, dx, dy, score, highScore, gameInterval;

canvas.width = 400;
canvas.height = 400;

highScore = localStorage.getItem('highScore') || 0;
highScoreElem.textContent = highScore;

function initializeGame() {
    snake = [{ x: GRID_SIZE * 5, y: GRID_SIZE * 5 }];
    dx = GRID_SIZE;
    dy = 0;
    score = 0;
    currentScoreElem.textContent = score;
    food = generateFoodPosition();
    document.getElementById('game-over').style.display = 'none';

    clearInterval(gameInterval);
    gameInterval = setInterval(update, 100);
}

function generateFoodPosition() {
    let newFoodPosition;
    do {
        newFoodPosition = {
            x: Math.floor(Math.random() * (canvas.width / GRID_SIZE)) * GRID_SIZE,
            y: Math.floor(Math.random() * (canvas.height / GRID_SIZE)) * GRID_SIZE
        };
    } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
    return newFoodPosition;
}

function update() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        currentScoreElem.textContent = score;
        food = generateFoodPosition();
        if (score > highScore) {
            highScore = score;
            highScoreElem.textContent = highScore;
            localStorage.setItem('highScore', highScore);
        }
    } else {
        snake.pop();
    }

    if (checkCollision()) return endGame();

    draw();
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    snake.forEach(segment => {
        context.fillStyle = 'lightblue';
        context.fillRect(segment.x, segment.y, GRID_SIZE, GRID_SIZE);
    });
    context.fillStyle = 'lightcoral';
    context.fillRect(food.x, food.y, GRID_SIZE, GRID_SIZE);
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) return true;
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }
    return false;
}

function endGame() {
    clearInterval(gameInterval);
    document.getElementById('game-over').style.display = 'flex';
}

// Función para cambiar la dirección de la serpiente
function changeDirection(newDx, newDy) {
    // Cambiar la dirección independientemente de la dirección actual
    dx = newDx;
    dy = newDy;
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') changeDirection(0, -GRID_SIZE);
    else if (e.key === 'ArrowDown') changeDirection(0, GRID_SIZE);
    else if (e.key === 'ArrowLeft') changeDirection(-GRID_SIZE, 0);
    else if (e.key === 'ArrowRight') changeDirection(GRID_SIZE, 0);
});

upBtn.addEventListener('click', () => changeDirection(0, -GRID_SIZE));
downBtn.addEventListener('click', () => changeDirection(0, GRID_SIZE));
leftBtn.addEventListener('click', () => changeDirection(-GRID_SIZE, 0));
rightBtn.addEventListener('click', () => changeDirection(GRID_SIZE, 0));
restartBtn.addEventListener('click', initializeGame);

initializeGame();
