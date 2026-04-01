// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏参数
let score = 0;
let gameRunning = true;

// 挡板
const paddleWidth = 80;
const paddleHeight = 15;
let paddleX = (canvas.width - paddleWidth) / 2;

// 小球
let ballX = canvas.width / 2;
let ballY = canvas.height - 50;
let ballRadius = 8;
let ballSpeedX = 3;
let ballSpeedY = -4;

// 触摸/鼠标控制
let isDragging = false;

// 更新分数显示
function updateScore() {
    document.getElementById('scoreValue').innerText = score;
}

// 绘制挡板
function drawPaddle() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
}

// 绘制小球
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff6600';
    ctx.fill();
    ctx.closePath();
}

// 绘制分数（已用HTML显示，但这里可以留空）
function draw() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawPaddle();
    drawBall();
}

// 更新游戏逻辑
function update() {
    if (!gameRunning) return;
    
    // 移动小球
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    // 左右墙壁碰撞
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }
    // 顶部碰撞
    if (ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }
    // 底部碰撞（游戏结束）
    if (ballY + ballRadius > canvas.height) {
        gameRunning = false;
        alert('游戏结束！得分：' + score);
        return;
    }
    
    // 挡板碰撞检测
    if (ballY + ballRadius > canvas.height - paddleHeight &&
        ballX > paddleX && ballX < paddleX + paddleWidth) {
        // 根据碰撞点偏移改变水平速度，增加趣味
        let hitPos = (ballX - paddleX) / paddleWidth;
        let angle = (hitPos - 0.5) * 1.2; // -0.6 到 0.6 弧度
        ballSpeedX = Math.sin(angle) * 6;
        ballSpeedY = -Math.cos(angle) * 6;
        
        // 得分
        score++;
        updateScore();
        
        // 避免重复碰撞
        ballY = canvas.height - paddleHeight - ballRadius;
    }
}

// 控制挡板移动（鼠标/触摸）
function handleMove(clientX) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    let newX = (clientX - rect.left) * scaleX - paddleWidth/2;
    newX = Math.min(Math.max(newX, 0), canvas.width - paddleWidth);
    paddleX = newX;
}

// 鼠标事件
canvas.addEventListener('mousemove', (e) => {
    if (e.buttons === 1) { // 左键按下时
        handleMove(e.clientX);
    }
});
canvas.addEventListener('mousedown', (e) => {
    handleMove(e.clientX);
});
// 触摸事件（手机用）
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX);
});
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX);
});

// 重新开始按钮
document.getElementById('restartBtn').addEventListener('click', () => {
    score = 0;
    gameRunning = true;
    updateScore();
    ballX = canvas.width / 2;
    ballY = canvas.height - 50;
    ballSpeedX = 3;
    ballSpeedY = -4;
    paddleX = (canvas.width - paddleWidth) / 2;
});

// 游戏循环
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// 启动游戏
gameLoop();