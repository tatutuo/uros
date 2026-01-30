import CharacterStats from './CharacterStats.js';
export default class Player {
    constructor(x,y,basehp,basearmor,baseagi,basedmg,baseap) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.isMoving = false;
        this.speed = 15;
        this.width = 185;
        this.height = 175;

        this.stats = new CharacterStats(basehp, basearmor, baseagi, basedmg, baseap);

        this.image = new Image();
        this.image.src = `images/player.png?v=${Date.now()}`;
    }


    draw(ctx){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move(distanceX, distanceY) {
        this.targetX = this.x + distanceX;
        this.isMoving = true;
        this.targetY = this.y + distanceY;
    }

    update() {
        if (this.isMoving) {
            const distanceX = this.targetX - this.x;
            const distanceY = this.targetY - this.y;

            if(Math.abs(distanceX) > this.speed) {
                if(distanceX > 0) {
                    this.x += this.speed;
                }
                else {
                    this.x -= this.speed;
                }
            }
            else {
                this.x = this.targetX;
            }
            if(Math.abs(distanceY) > this.speed) {
                if(distanceY > 0) {
                    this.y += this.speed;
                }
                else {
                    this.y -= this.speed;
                }
            }
            else {
                this.y = this.targetY;
            }
            if (this.x === this.targetX && this.y === this.targetY) {
                this.isMoving = false;
            }
        }
    }

}