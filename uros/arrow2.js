export default class EnemyArrow {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.isMoving = false;
        this.speed = 11;
        this.width = 60;
        this.height = 52;
        this.state = 'READY';

        this.image = new Image();
        this.image.src = `images/arrow2.png`;
    }


    draw(ctx){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    moveTo(targetX, targetY) {
        this.targetX = targetX;
        this.targetY = targetY;
    }

update() {
    if (this.state === 'FIRING') {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.speed) {
            const moveX = (dx / distance) * this.speed;
            const moveY = (dy / distance) * this.speed;
            this.x += moveX;
            this.y += moveY;
        } else {
            this.x = this.targetX;
            this.y = this.targetY;
            this.state = 'HIT';
        }
    }
}

}