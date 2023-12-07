
class GameObject {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
}

class Ball extends GameObject {
    constructor(x, y, radius, color, speed) {
        /**
         * x, y: ボールの左上の座標
         */
        super(x, y, radius * 2, radius * 2, color);
        this.startX = x;
        this.startY = y;
        this.radius = radius;
        this.speed = speed;
        this.setSpeed();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, 2 * Math.PI);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }

    setSpeed() {
        this.speedX = this.speed * Math.cos(Math.PI / 4); // 45 deg in radian
        this.speedY = - this.speed * Math.sin(Math.PI / 4);
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.setSpeed();
    }
}

class Bar extends GameObject {
    constructor(x, y, width, height, color, speed) {
        super(x, y, width, height, color);
        this.speed = speed;
    }

    move(direction) {
        this.x += this.speed * direction;
    }

    draw(context) {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }
}


class Block extends GameObject {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
    }

    draw(context) {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }
}


// Game class to manage the overall game state
class Game {
    constructor(
        canvasId, width, height, ballRadius, ballSpeed, barWidth, barHeight, barSpeed,
        blockRowNum, blockColNum, blockMargin, blockHeight
    ) {
        this.canvas = document.querySelector(canvasId);
        this.context = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;

        const barStartY = height * 0.9;
        const barStartX = (width-barWidth)/2;

        this.blockWidth = (width - blockMargin * (blockColNum + 1)) / blockColNum;
        this.blockHeight = blockHeight;
        this.blockMargin = blockMargin;
        this.blockRowNum = blockRowNum;
        this.blockColNum = blockColNum;

        this.ball = new Ball(barStartX - ballRadius*3, barStartY - ballRadius*3, ballRadius, 'red', ballSpeed);
        this.bar = new Bar(barStartX, barStartY, barWidth, barHeight, 'blue', barSpeed);

        this.initBlock();

        this.barDirection = 0;
    }

    initKeyListeners() {
        document.addEventListener('keydown', event => {
            switch (event.key) {
                case 'ArrowLeft':
                    this.barDirection = -1;
                    break;
                case 'ArrowRight':
                    this.barDirection = 1;
                    break;
            }
        });

        document.addEventListener('keyup', event => {
            switch (event.key) {
                case 'ArrowLeft':
                    this.barDirection = 0;
                    break;
                case 'ArrowRight':
                    this.barDirection = 0;
                    break;
            }
        });
    }

    initBlock() {
        this.blocks = [];
        for(let i = 0; i < this.blockRowNum; i++) {
            for(let j = 0; j < this.blockColNum; j++) {
                this.blocks.push(new Block( this.blockMargin + (this.blockMargin + this.blockWidth) * j, this.blockMargin + (this.blockMargin + this.blockHeight) * i, this.blockWidth, this.blockHeight, 'green'));
            }
        };
    }

    init() {
        this.initKeyListeners();
        this.loop();
    }

    reset() {
        this.ball.reset();
        this.bar.x = (this.width - this.bar.width) / 2;
        this.initBlock();
    }

    loop() {
        this.update();
        this.draw();
        window.requestAnimationFrame(() => this.loop());
    }

    update() {
        this.updateBall();

        // bar を動かす
        this.bar.move(this.barDirection);
        if(this.bar.x < 0) {
            this.bar.x = 0;
        } else if(this.bar.x + this.bar.width > this.canvas.width) {
            this.bar.x = this.canvas.width - this.bar.width;
        }
    }

    updateBall() {
        // ball を動かす
        this.ball.move();

        // ball が壁に当たったら反射
        if (this.ball.x < 0 || this.ball.x + this.ball.radius*2 > this.canvas.width) {
            this.ball.speedX *= -1;
        }
        if (this.ball.y < 0) {
            this.ball.speedY *= -1;
        } else if(this.ball.y + this.ball.radius*2 > this.canvas.height) {
            this.reset();
        }

        // ball が bar に当たったら反射
        if (this.ball.y + this.ball.radius*2 > this.bar.y &&
            this.ball.x + this.ball.radius*2 > this.bar.x &&
            this.ball.x < this.bar.x + this.bar.width
        ) {
            // バーの中心からボールの中心までの距離を計算
            let collidePoint = (this.ball.x - (this.bar.x + this.bar.width / 2)) / (this.bar.width / 2);

            // 反射角度を計算（ラジアン単位）
            let angle = collidePoint * Math.PI / 3.5;

            // ボールの速度を更新
            this.ball.speedX = this.ball.speed * Math.sin(angle);
            this.ball.speedY = -this.ball.speed * Math.cos(angle);
        }

        // ball が block に当たったら反射
        this.blocks.forEach((block, index) => {
            if (this.ball.x + this.ball.radius*2  > block.x &&
                this.ball.x < block.x + block.width &&
                this.ball.y + this.ball.radius*2 > block.y &&
                this.ball.y < block.y + block.height
            ) {
    
                // 衝突したブロックを消す
                this.blocks.splice(index, 1);
    
                // 衝突した辺を判断し、それに応じてボールの速度を反転
                let overlapX = 
                    (this.ball.x < block.x)
                    ? block.x - (this.ball.x + this.ball.radius*2)
                    : (block.x + block.width) - this.ball.x;
                let overlapY = 
                    (this.ball.y < block.y)
                    ? block.y - (this.ball.y + this.ball.radius*2)
                    : (block.y + block.height) - this.ball.y;
    
                if (Math.abs(overlapX) < Math.abs(overlapY)) {
                    this.ball.speedX *= -1;
                } else {
                    this.ball.speedY *= -1;
                }
            }
        });
    }

    draw() {
        this.context.beginPath();
        this.context.rect(0, 0, this.width, this.height);
        this.context.fillStyle = "black";
        this.context.fill();
        this.context.closePath();

        this.bar.draw(this.context);
        this.blocks.forEach(block => block.draw(this.context));
        this.ball.draw(this.context);
    }
}

const width = 400;
const height = 600;

const barWidthRate = 0.2;
const barWidth = width * barWidthRate;

const ballRadius = 10;
const barHeight = ballRadius;

const blockRowNum = 5;
const blockColNum = 8;
const blockMargin = 10; // block同士の隙間
const blockHeight = barHeight * 1.8;

const ballSpeed = 4.5;
const barSpeed = 10;


const game = new Game(
    '#gameCanvas', width, height, ballRadius, ballSpeed, barWidth, barHeight, barSpeed,
    blockRowNum, blockColNum, blockMargin, blockHeight
);
game.init();



// TODO
// - ブロックの配置を配列で与えてステージにできるようにする
// - GAME OVER, CLEAR 機能をつけ、リスタートボタンをつける
// - 得点を表示する
// - UI をもっとかっこよくする（ボールなどは画像にしたい）

// - ブロックを消した時に
//  - 音を鳴らす
//  - パーティクルを出す
//  - 得点を加算する
//  - アイテムを出す

// - アイテムを取った時に
//  - 効果を発動する
//   - ボールがnつになる
//   - バーが長くなる
//   - バーが短くなる
//   - バーが速くなる
//   - バーが遅くなる
//   - ボールが速くなる
//   - ボールが遅くなる
//   - ボールが大きくなる
//   - ボールが小さくなる
//  - 得点を表示する
//  - 音を鳴らす
//  - パーティクルを出す
//  - アイテムの効果を表示する

// FIXME
// - bar に真横から ball が当たった時や ball の場所に後から bar が重なった時に変な挙動をする
// - ball が block の角に当たった時に変な挙動をする

