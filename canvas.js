class Game {
    constructor(element, shooterColor, bulletColor) {
        this.shooterColor = shooterColor;
        this.bulletColor = bulletColor;
        this.canvas = document.createElement("canvas");
        this.canvas.width = element.offsetWidth;
        this.canvas.height = element.offsetHeight;
        element.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.addEventListener("click", this.onClick.bind(this));
        this.canvas.addEventListener("mousedown", this.onHold.bind(this));
        this.canvas.addEventListener("mouseup", this.onRelease.bind(this));
        this.canvas.addEventListener("mousemove", this.onMove.bind(this));
        this.shooter = null;
        this.isShooting = false;
        this.bullets = [];
        this.mouseX = null;
        this.mouseY = null;
    }
    onClick(e) {
        if (this.shooter) {
            if (this.shooter.checkPosition(e.offsetX, e.offsetY)) {
                this.shooter = null;
            }
        } else {
            this.shooter = new Shooter(
                this.ctx,
                e.offsetX,
                e.offsetY,
                this.shooterColor
            );
        }
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
    }
    onHold() {
        this.isShooting = true;
    }
    onRelease() {
        this.isShooting = false;
    }
    onMove(e) {
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width , this.canvas.height );
    }
    update() {
        this.clear();
        if (this.shooter) {
            this.shooter.draw();
            if (this.isShooting && this.bullets.length < 500 && !this.shooter.checkPosition( this.mouseX , this.mouseY)) {
                const [x, y] = this.shooter.getPosition();
                    this.bullets.push(
                        new Bullet(
                            this.ctx,
                            x,
                            y,
                            this.mouseX,
                            this.mouseY,
                            this.bulletColor,
                            this.canvas.width,
                            this.canvas.height,
                            this.shooter.x,
                            this.shooter.y
                        )
                    );

            }
        }
        if (this.bullets.length > 0) {
            this.bullets.forEach((bullet, index, bullets) => {
                if (bullet.isOut()) {
                    bullets.splice(index, 1);
                } else {
                     bullet.move();
                }
            });
        }
    }
}
class Shooter {
    constructor(ctx, x, y, color) {
        this.ctx = ctx;
        this.color = color;
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.draw();
    }
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
    getPosition() {
        return [this.x, this.y];
    }
    checkPosition(x, y) {
        return (
            Math.abs(x - this.x) < this.radius &&
            Math.abs(y - this.y) < this.radius
        );
    }
}
class Bullet {
    constructor(ctx, x, y, targetX, targetY, color, canvasWidth, canvasHeight, shooterX, shooterY) {
        this.ctx = ctx;
        this.color = color;
        this.x = x ;
        this.y = y;
        this.radius = 5;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.targetX = targetX ;
        this.targetY = targetY ;
        this.shooterX = shooterX ;
        this.shooterY = shooterY;
        this.draw();
    }
    draw() {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0 , 2 * Math.PI , true);
            this.ctx.fillStyle = this.color;
            this.ctx.fill()
    }
    move() {
        const angle = Math.atan2(
            this.targetY - this.shooterY,
            this.targetX - this.shooterX 
        );
        const newX = Math.cos(angle)*2;
        const newY = Math.sin(angle)*2;

        this.x =this.x + newX;
        this.y = this.y + newY;
        this.draw();

    }
    isOut() {
        return (
            this.x < 0 ||
            this.x > this.canvasWidth ||
            this.y < 0 ||
            this.y > this.canvasHeight
        );
    }
}


function animate() {
    game1.update();
    game2.update();
    requestAnimationFrame(animate);
}


const firstElement = document.querySelector("#testDiv1");
const secondElement = document.querySelector("#testDiv2");

const game1 = new Game(firstElement, "green", "red");
const game2 = new Game(secondElement, "blue", "red");
animate();
