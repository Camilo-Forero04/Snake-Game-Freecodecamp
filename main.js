//defining HTML 
//const because the board won't change

const board = document.getElementById("game-board");
const instruction = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const audioContainer = document.getElementById("audio-container");

//Defining game variables
const gridSize = 20;
//let cause the snake will get bigger when eating
let snake = [{x: 10, y: 10}];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = 0;
let currentScore = snake.length - 1;

// Audio variables
const gameOverAudio = "gameOver.mp3";
const backgroundMusic = "backgroundSong.mp3";
const foodSound = "foodSound.mp3";
let backgroundMusicAudio = new Audio(backgroundMusic);
let gameOverAudioAudio;
let foodSoundAudio;

// Draw game map, snake, food 
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Draw the snake
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

// Create either a snake or food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Set the position of a game element (either food or a snake)
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Draw food
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

// Generate random food
function generateFood() {
    return { x: Math.floor(Math.random() * gridSize) + 1, y: Math.floor(Math.random() * gridSize) + 1 };
}

// Moving the snake
function move() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
    }
    snake.unshift(head);
    
    if (head.x == food.x && head.y == food.y) {
        increaseSpeed();
        food = generateFood();
        playFoodSound();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}

// Start game function
function startGame() {
    playBackgroundMusic();
    gameStarted = true;
    instruction.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// Key press event listener, keeping track of the movment
function handleKeyPress(event) {
    if ((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === ' ')) {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                if(direction=='down' &&snake.length>1){
                    
                }else{
                    direction = 'up';
                }
                break;
            case 'ArrowDown':
                if(direction=='up' && snake.length>1){
                    
                }else{
                    direction = 'down';
                }
                break;
            case 'ArrowRight':
                if(direction=='left' &&snake.length>1){
                    
                }else{
                    direction = 'right';
                }
                break;
            case 'ArrowLeft':
                if(direction=='right' &&snake.length>1){
                        
                }else{
                    direction = 'left';
                }
                break;
        }
    }
}
//listening when the user presses a key, different when the user unpresses a key, then it would be keyup
document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
    if (gameSpeedDelay >= 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}
//check if the player coallides with him/herself or the walls 
function checkCollision() {
    const head = snake[0];
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = 'right';
    updateScore();
    gameSpeedDelay=200;
}

function updateScore() {
    currentScore=snake.length-1;
    score.textContent = currentScore.toString().padStart(3, '0')
}
function stopGame() {
    playGameOverSound();
    stopSong();
    clearInterval(gameInterval);//stops the game loop
    gameStarted = false;
    instruction.style.display = 'block';
    logo.style.display = 'block';
}
//Updating highscore and saving it in localStorage to display it even if the player reload the page, and retreving in the HTML
function updateHighScore() {
    currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
        localStorage.setItem('highScore',highScore);
    }
    highScoreText.style.display = 'block';
}
//playing the background song in loop
function playBackgroundMusic() {
    backgroundMusicAudio.loop = true;
    backgroundMusicAudio.play();
}
//making a sound whenever the snake eats a fruit
function playFoodSound() {
    foodSoundAudio = new Audio(foodSound);
    foodSoundAudio.play();
}
//making a sound whenever the player looses
function playGameOverSound() {
    gameOverAudioAudio = new Audio(gameOverAudio);
    gameOverAudioAudio.play();
}
//pausing the bakground song and reinitializing to 0 to play it from 0 when I start another match
function stopSong(){
    backgroundMusicAudio.pause();
    backgroundMusicAudio.currentTime = 0;
}

// Retrieve high score from local storage when loaded
window.addEventListener('load', () => {
    const storedHighScore = localStorage.getItem('highScore');
    if (storedHighScore !== null) {
        highScore = parseInt(storedHighScore);
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }else{
        highScoreText.style.display = 'none';
    }
});