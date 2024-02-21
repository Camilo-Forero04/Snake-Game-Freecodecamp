//defining HTML elements
//const because the board won't change

const board = document.getElementById("game-board");
const instruction = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
//Defining game variables
//let cause the snake will get bigger when eating
const gridSize = 20;
let snake = [{x:10,y:10}];
let food = generateFood();
let direction ='right';
let gameInterval;
let gameSpeedDelay=200;
let gameStarted=false;
let highScore=0;
// Draw game map, snake, foood 
function draw(){
    board.innerHTML=''
    drawSnake();
    drawFood();
    updateScore();
}
//Draw the snake
function drawSnake(){
    snake.forEach((segment)=>{
        const snakeElement=createGameElement('div','snake');
        setPosition(snakeElement,segment);
        board.appendChild(snakeElement);
    });
    
}
//Create either a snake or food cube/div
function createGameElement(tag,className){
    const element = document.createElement(tag);
    element.className=className;
    return element;
}
//set the position of a game element (either food or a snake)
function setPosition(element,position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}
//Draw food

function drawFood(){
    if(gameStarted){
        const foodElement=createGameElement('div','food');
        setPosition(foodElement,food);
        board.appendChild(foodElement);    
    }
}
// //Generate random food
function generateFood(){
    return {x:Math.floor(Math.random() * gridSize)+1,y:Math.floor(Math.random() * gridSize)+1};
}
// draw();
//moving the snake
function move(){
    //copy of the x position
    const head = {...snake[0]};
    switch(direction){
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
    
    if(head.x==food.x && head.y == food.y){
        increaseSpeed();
        food=generateFood();
        clearInterval(gameInterval);//clear past interval
        gameInterval = setInterval(()=>{
            move();
            checkCollision();
            draw();
        },gameSpeedDelay);
    }else{
        snake.pop();
    }
}
// setInterval(()=>{
//     move();
//     draw();
// },200);

//start game function
function startGame(){
    gameStarted=true; //keep track of a running game
    instruction.style.display ='none';
    logo.style.display = 'none';
    gameInterval = setInterval(()=>{
        move();
        checkCollision();
        draw();
    },gameSpeedDelay);
}
//key press eventListener
function handleKeyPress(event){
    if(
    (!gameStarted && event.code ==='Space') || 
    (!gameStarted && event.key ===' ')){
        startGame();
    }else{
        switch(event.key){
            case 'ArrowUp':
                direction ='up';
                break;
            case 'ArrowDown':
                direction='down';
                break;
            case 'ArrowRight':
                direction='right';
                break;
            case 'ArrowLeft':
                direction='left';
                break;
        }
    }
}
document.addEventListener('keydown',handleKeyPress);

function increaseSpeed(){
    if(gameSpeedDelay>=150){
        gameSpeedDelay-=5;
    }else if(gameSpeedDelay>100){
        gameSpeedDelay-=3;
    }else if(gameSpeedDelay>50){
        gameSpeedDelay-=2;
    }else if(gameSpeedDelay>25){
        gameSpeedDelay-=1;
    }
}
function checkCollision(){
    const head =snake[0];
    if(head.x<1 || head.x>gridSize || head.y<1 || head.y>gridSize){
        resetGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}
function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x:10,y:10}];
    food = generateFood();
    direction='right';
    updateScore();
}
function updateScore(){
    const currentScore= snake.length-1;
    score.textContent = currentScore.toString().padStart(3,'0')
}
function stopGame(){
    clearInterval(gameInterval);
    gameStarted=false;
    instruction.style.display ='block';
    logo.style.display='block';
}
function updateHighScore(){
    const currentScore = snake.length-1;
    if(currentScore>highScore){
        highScore=currentScore;
        highScoreText.textContent=highScore.toString().padStart(3,'0');
    }
    highScoreText.style.display='block';
}