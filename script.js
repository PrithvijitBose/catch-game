const basket = document.getElementById('basket');
const ball = document.getElementById('ball');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const highScoreDisplay = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const leaderboard = document.getElementById('leaderboard');
const leaderboardList = document.getElementById('leaderboard-list');
const powerUp = document.createElement('div');
powerUp.id = 'power-up';
gameContainer.appendChild(powerUp);

let basketX = gameContainer.clientWidth / 2 - 50;
let ballY = 0;
let ballX = Math.random() * (gameContainer.clientWidth - 30);
let powerUpY = 0;
let powerUpX = Math.random() * (gameContainer.clientWidth - 30);
let score = 0;
let lives = 3;
let level = 1;
let speed = 2;
let gameInterval;
let powerUpInterval;
let paused = false;
let highScore = localStorage.getItem('highScore') || 0;
let scores = JSON.parse(localStorage.getItem('scores')) || [];

document.addEventListener('keydown', moveBasket);
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
pauseBtn.addEventListener('click', pauseGame);
resumeBtn.addEventListener('click', resumeGame);

function startGame() {
    startBtn.style.display = 'none';
    restartBtn.style.display = 'none';
    pauseBtn.style.display = 'block';
    resumeBtn.style.display = 'none';
    leaderboard.style.display = 'none';
    resetBall();
    resetPowerUp();
    resetGame();
    gameInterval = setInterval(dropBall, 10);
    powerUpInterval = setInterval(dropPowerUp, 10);
}

function restartGame() {
    lives = 3;
    score = 0;
    level = 1;
    speed = 2;
    livesDisplay.textContent = `Lives: ${lives}`;
    scoreDisplay.textContent = `Score: ${score}`;
    highScoreDisplay.textContent = `High Score: ${highScore}`;
    startGame();
}

function moveBasket(event) {
    const basketSpeed = 20; // Increase this value to make the basket move faster
    if (event.key === 'ArrowLeft' && basketX > 0) {
        basketX -= basketSpeed;
    } else if (event.key === 'ArrowRight' && basketX < gameContainer.clientWidth - 100) {
        basketX += basketSpeed;
    }
    basket.style.left = `${basketX}px`;
}

function dropBall() {
    if (paused) return;
    ballY += speed;
    if (ballY > gameContainer.clientHeight - 50) {
        if (ballX > basketX && ballX < basketX + 100) {
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            if (score % 10 === 0) {
                levelUp();
            }
        } else {
            lives--;
            livesDisplay.textContent = `Lives: ${lives}`;
            if (lives === 0) {
                endGame();
                return;
            }
        }
        resetBall();
    }
    ball.style.top = `${ballY}px`;
    ball.style.left = `${ballX}px`;
}

function dropPowerUp() {
    if (paused) return;
    powerUpY += speed / 2; // Power-up falls slower than the ball
    if (powerUpY > gameContainer.clientHeight - 50) {
        if (powerUpX > basketX && powerUpX < basketX + 100) {
            activatePowerUp();
        }
        resetPowerUp();
    }
    powerUp.style.top = `${powerUpY}px`;
    powerUp.style.left = `${powerUpX}px`;
}

function activatePowerUp() {
    score += 5; // Add bonus points
    lives++; // Add an extra life
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;
}

function resetBall() {
    ballY = 0;
    ballX = Math.random() * (gameContainer.clientWidth - 30);
    ball.style.backgroundColor = getRandomColor();
}

function resetPowerUp() {
    powerUpY = 0;
    powerUpX = Math.random() * (gameContainer.clientWidth - 30);
    powerUp.style.backgroundColor = 'gold';
    powerUp.style.display = 'block';
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(powerUpInterval);
    alert('Game Over! Your final score is ' + score);
    updateHighScore();
    restartBtn.style.display = 'block';
    pauseBtn.style.display = 'none';
    resumeBtn.style.display = 'none';
    leaderboard.style.display = 'block';
    updateLeaderboard();
    powerUp.style.display = 'none';
}

function resetGame() {
    score = 0;
    lives = 3;
    level = 1;
    speed = 2;
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;
    highScoreDisplay.textContent = `High Score: ${highScore}`;
}

function levelUp() {
    level++;
    speed += 0.5;
    alert(`Level Up! Welcome to Level ${level}`);
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function pauseGame() {
    paused = true;
    pauseBtn.style.display = 'none';
    resumeBtn.style.display = 'block';
}

function resumeGame() {
    paused = false;
    pauseBtn.style.display = 'block';
    resumeBtn.style.display = 'none';
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreDisplay.textContent = `High Score: ${highScore}`;
    }
    scores.push(score);
    localStorage.setItem('scores', JSON.stringify(scores));
}

function updateLeaderboard() {
    leaderboardList.innerHTML = '';
    scores.sort((a, b) => b - a).slice(0, 5).forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${score}`;
        leaderboardList.appendChild(li);
    });
}
