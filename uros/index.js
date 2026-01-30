import Enemy from "./Enemy.js"
import Player from "./Player.js";
import Arrow from "./arrow.js";
import EnemyArrow from "./arrow2.js";
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const nameBtn = document.getElementById("namebutton");
const nameBox = document.getElementById("namebox");
const melee = document.getElementById("melee");
const range = document.getElementById("range");
const turn = document.getElementById("turn");
const enemyhp = document.getElementById("enemyHP");
const enemyarmor = document.getElementById("enemyArmor");
const enemydmg = document.getElementById("enemyDmg");
const enemyagi = document.getElementById("enemyAgi");
const health = document.getElementById("health");
const armor = document.getElementById("armor");
const agility = document.getElementById("agility");
const damage = document.getElementById("damage");
const inputplrlevel = document.getElementById("plrLevelInput");
const inputcpulevel = document.getElementById("cpuLevelInput");
const consoleOP = document.getElementById("consoleOutput");
const playername = document.getElementById("plrName");
const enemyname = document.getElementById("cpuName");
const XP = document.getElementById("currentXP");
const whosturn = document.getElementById("whosturn");
const actionpoints = document.getElementById("AP");
const statControls = document.querySelectorAll('.adjust-stat');
const info = document.getElementById('info');
const lives = document.getElementById('lives');
const goodluck = document.getElementById('goodluck');
const styleLink = document.getElementById('dynamic-style');
styleLink.href = `styles.css?v=${Date.now()}`;

let currentEnemyLevel = 0;

let enemy = new Enemy(590, 400, 30, 10, 10, 10);
const player = new Player(20, 400, 1, 1, 1, 1, 66);
const arrow = new Arrow(0,0);
const arrow2 = new EnemyArrow(0,0);
const arrow3 = new Arrow(0,0);

XP.innerHTML = `XP: ${player.stats.currentXP} / ${player.stats.xpToNextLevel}`;
playername.value = 'Uros';
enemyname.value = enemy.name;
lives.innerHTML = 10;

enemyhp.value = enemy.stats.hp;
enemydmg.value = enemy.stats.basedmg;
enemyagi.value = enemy.stats.agility;
enemyarmor.value = enemy.stats.armor;
inputcpulevel.value = enemy.stats.level;

health.value = player.stats.hp;
armor.value = player.stats.armor;
agility.value = player.stats.agility;
damage.value = player.stats.basedmg;
inputplrlevel.value = player.stats.level;

canvas.width = 800;
canvas.height = 600;

const background = new Image();

let background1 = new Image();
let background2 = new Image();
background1.src = `images/canvas3.png?v=${Date.now()}`;
background2.src = `images/canvas4.png?v=${Date.now()}`;

let currentBackground = background1;
let nextBackground = null;
let fadeProgress = 0;
let fading = false;

function changeBackground(newBg) {
  nextBackground = newBg;
  fadeProgress = 0;
  fading = true;
}

function drawBackground(ctx) {
  if (!fading) {
    ctx.drawImage(currentBackground, 0, 0, 800, 600);
  } else {
    fadeProgress += 0.02;
    if (fadeProgress >= 1) {
      fadeProgress = 1;
      fading = false;
      currentBackground = nextBackground;
    }
    ctx.globalAlpha = 1;
    ctx.drawImage(currentBackground, 0, 0, 800, 600);
    ctx.globalAlpha = fadeProgress;
    ctx.drawImage(nextBackground, 0, 0, 800, 600);
    ctx.globalAlpha = 1; // reset
  }
}

let winner;

initializeConsoleOutput();
game();
document.getElementById("range").disabled = true;
document.getElementById("turn").disabled = true;
document.getElementById("melee").disabled = true;

info.addEventListener('click', () => {
    alert("Use your stat points to build your champion! \n LEVEL UP->More points, health & damage. \n ARMOR: \n Decreases damage taken from your opponent. \n Especially damage from arrows. \n Gives you a chance for block.\n AGILITY:\n Increases range attack damage. \n Gives you a chance for critical hit. \n Gives you a chance for dodge. \n SPECIAL: \n Play the game and find out :] \n BTW, you have more lives than cats! \n Use em wisely ;>");
});

startBtn.addEventListener('click', () => {
    start();
});

actionpoints.value = player.stats.baseap;
let firstTurnDone = true;

nameBtn.addEventListener('click', () => {
    playername.value = nameBox.value.trim();
    nameBox.value = '';
});
let maxHp;
let eMaxHp;
function start() {
    maxHp = Number(health.value);
    eMaxHp = Number(enemyhp.value);
    if (player.stats.level === 9) { 
        changeBackground(background2); 
    }
    enemy.x = 590;
    enemy.y = 400;
    player.x = 20;
    player.y = 400;
    if (playername.value === 'Uros' || playername.value === '') {
        alert("What's your name champ!?");
        return
    }
    if (Number(actionpoints.value) !== 0) {
        alert("Use your ACTION POINTS before starting a battle! (xoxo)");
        return;
    }
    statControls.forEach(button => {
    button.classList.add('hidden');});
    document.getElementById("startBtn").disabled = true;
    let firstTurn = Math.floor(Math.random() * 2);
    if (firstTurn === 0) {
        document.getElementById("melee").disabled = true;
        document.getElementById("range").disabled = true;
        firstTurnDone = false;
        whosturn.classList.add('beginner');
        whosturn.innerHTML = `${enemyname.value} starts the battle!`;
        console.log(`${enemyname.value} begins! (dmg 65%)`)
        document.getElementById('turn').disabled = false;
    }
    else {
    document.getElementById("melee").disabled = false;
    document.getElementById("range").disabled = false;
    firstTurnDone = false;
    whosturn.innerHTML = `${playername.value} starts the battle!`;
    console.log(`${playername.value} begins! (dmg 65%)`);
    whosturn.classList.remove('life', 'death');
    whosturn.classList.add('beginner');
    }
    startBtn.classList.add('hidden');
    nameBox.classList.add('hidden');
    nameBtn.classList.add('hidden');
    goodluck.innerHTML = `Good luck, ${playername.value}!`;
}

function game() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx);
    enemy.update(); 
    player.update();
    enemy.draw(ctx);
    player.draw(ctx);
    if (arrow.state === 'FIRING') {
        arrow.update();
        arrow.draw(ctx);
    }
    if (arrow.state === 'HIT') {
        rangeHit();
        arrow.x = player.x + (player.width / 2); 
        arrow.y = player.y + (player.height / 2);
        arrow.state = 'READY';
    }
    if (arrow2.state === 'FIRING') {
        arrow2.update();
        arrow2.draw(ctx);
    }
    if (arrow2.state === 'HIT') {
        enemyRangeHit();
        arrow2.x = enemy.x + (enemy.width / 2); 
        arrow2.y = enemy.y + (enemy.height / 2);
        arrow2.state = 'READY';
    }
    if (arrow3.state === 'FIRING') {
        arrow3.update();
        arrow3.draw(ctx);
    }
    if (arrow3.state === 'HIT') {
        enemyRangeHit();
        arrow3.x = enemy.x + (enemy.width / 2); 
        arrow3.y = enemy.y + (enemy.height / 2);
        arrow3.state = 'READY';
    }
    requestAnimationFrame(game);
}

melee.addEventListener('click', () => {
    meleeAttack();
});
range.addEventListener('click', () => {
    if (player.stats.ability === 'FIREARROW' || player.stats.ability === 'SHIELDBREAKERFA' || player.stats.ability === 'REGENSBLSFA' || player.stats.ability === 'ALL') {
        arrow.image.src = `images/firearrow.png?v=${Date.now()}`;
    }
    rangeAttack();
});

turn.addEventListener('click', () => {
    disableControls();
    whosturn.innerHTML = "";
        enemyAttack();
});

function meleeAttack() {
    if (player.stats.ability === 'SHIELDBREAKERFA' || player.stats.ability === 'REGENSBLSFA' || player.stats.ability === 'ALL')
    {
        player.image.src = `images/player_sb.png?v=${Date.now()}`;  
    }
    else {
    player.image.src = `images/player.png?v=${Date.now()}`;
    }
    whosturn.innerHTML = "";
    player.move(550,0);
    disableControls();
    setTimeout(() => {
        hit();
        if (enemyhp.value > 0) {
            document.getElementById("turn").disabled = false;
        }
    }, 800);
}

function rangeAttack() {
    arrow.x = player.x + player.width / 2;
    arrow.y = player.y + player.height / 3;
    arrow.targetX = enemy.x + enemy.width / 2;
    arrow.targetY = arrow.y;
    player.image.src = `images/player_range.png?v=${Date.now()}`;
    whosturn.innerHTML = "";
    disableControls();
    arrow.state = 'FIRING';
    if (enemyhp.value > 0) {
        document.getElementById("turn").disabled = false;
    }  
}

    function endPlayerTurn() {
    disableControls();
    if (player.stats.ability === 'SHIELDBREAKERFA' || player.stats.ability === 'REGENSBLSFA' || player.stats.ability === 'ALL')
    {
        player.image.src = `images/player_sb.png?v=${Date.now()}`;  
    }
    else {
    player.image.src = `images/player.png?v=${Date.now()}`;
    }
    document.getElementById("turn").disabled = false;
    whosturn.innerHTML = `${enemyname.value}'s turn`;
}

function endEnemyTurnToPlayer() {
    reenableControls();
    document.getElementById('turn').disabled = true; 
   
    whosturn.innerHTML = `${playername.value}'s turn`;
}

function DmgMultiplier(level, MIN_RANDOM = 0.8, MAX_RANDOM = 1.2) {
    const randomFactor = Math.random() * (MAX_RANDOM - MIN_RANDOM) + MIN_RANDOM;
    const levelFactor = 1 + (level - 1) * 0.02;
    let theDmg = randomFactor * levelFactor;
    if (!firstTurnDone) {
        theDmg *= 0.65;
        firstTurnDone = true;
        return theDmg;
    }
    else {
    return theDmg;
    }
}

function rangeHit() {
    whosturn.innerHTML = "";
    disableControls();
    if (player.stats.ability === 'ALL') {
        const poisonAmount = Math.round(Number(enemyhp.value) * 0.08);
        enemyhp.value = (Number(enemyhp.value) - poisonAmount).toFixed(1);
        console.log(`${enemyname.value} POISON: -${poisonAmount} hp`);
            if (enemyhp.value <= 0) {
                enemy.image.src = `images/enemy1_fall.png?v=${Date.now()}`;
                winner = playername.value;
                fightOverHandler();
                disableControls();
                document.getElementById("turn").disabled = true;
            return;
            }
    }
    if (checkDodge(enemy.stats.baseagi)) {
        console.log(`${playername.value} MISSED!`);
    if (enemy.ability === 'DODGER' || enemy.ability == 'BLOCKERDODGER') {
        setTimeout(() => {
            enemyhit(); 
            setTimeout(() => {
                if (health.value > 0) {
                    endPlayerTurn(); 
                } 
                else {
                    disableControls();
                    document.getElementById('turn').disabled = true;
                }
            }, 1000); 
        }, 400);
        return;
    }
    endPlayerTurn();
    return;
}

    if (checkBlock(enemy.stats.basearmor)) {
        console.log(`${enemyname.value} BLOCKED!`);
    if (enemy.ability === 'BLOCKER' || enemy.ability === 'BLOCKERDODGER') {
        setTimeout(() => {
            enemyhit(); 
            setTimeout(() => {
                if (health.value > 0) {
                endPlayerTurn(); 
                }
                else {
                    disableControls();
                    document.getElementById('turn').disabled = true;
                }
            }, 1000); 
        }, 400);
        return;
    }
    endPlayerTurn();
    return;
}

    const dmg = player.stats.basedmg + Math.sqrt(player.stats.baseagi) * 0.5;
    const multiplier = DmgMultiplier(player.stats.level);
    let totalDamage = dmg * multiplier;
    const crit = checkCrit(player.stats.baseagi);

    if (crit.isCrit) {
        totalDamage *= crit.multiplier;
        console.log(`${playername.value} CRITS! x${crit.multiplier.toFixed(2)}`);
    }

    const damageReduction = enemy.stats.basearmor / (enemy.stats.basearmor + 40);
    let finalDamage = Math.max(1, Math.round(totalDamage * (1 - damageReduction)));
    if (player.stats.ability === 'FIREARROWLIFESTEAL' || player.stats.ability === 'SHIELDBREAKERFA' || player.stats.ability === 'REGENSBLSFA' || player.stats.ability === 'ALL') {
        finalDamage *= 1.7;
        const healAmount = Math.round(finalDamage * 0.15);
        health.value = Number(health.value) + healAmount;
        if (Number(health.value) > 1500) {
            health.value = Number(1500);
        }
        console.log(`LIFESTEAL: +${healAmount} hp`);
    }

    enemyhp.value = (Number(enemyhp.value) - finalDamage).toFixed(1);
    console.log(`${playername.value}: ${finalDamage.toFixed(1)} dmg`);

    
    if (enemyhp.value <= 0) {
        enemy.image.src = `images/enemy1_fall.png?v=${Date.now()}`;
        winner = playername.value;
        fightOverHandler();
        disableControls();
        document.getElementById("turn").disabled = true;
        return;
    }
    endPlayerTurn();
}

function hit() {
    disableControls();
    if (player.stats.ability === 'ALL') {
        const poisonAmount = Math.round(Number(enemyhp.value) * 0.08);
        enemyhp.value = (Number(enemyhp.value) - poisonAmount).toFixed(1);
        console.log(`${enemyname.value} POISON: -${poisonAmount} hp`);
            if (enemyhp.value <= 0) {
                enemy.image.src = `images/enemy1_fall.png?v=${Date.now()}`;
                winner = playername.value;
                fightOverHandler();
                disableControls();
                document.getElementById("turn").disabled = true;
            return;
            }
    }
    if (checkDodge(enemy.stats.baseagi)) {
        console.log(`${playername.value} MISSED!`);
        player.move(-550,0);
    if (enemy.ability === 'DODGER' || enemy.ability == 'BLOCKERDODGER' || enemy.ability === 'ALL') {
        setTimeout(() => {
            enemyhit(); 
            setTimeout(() => {
                if (health.value > 0) {
                    endPlayerTurn(); 
                } 
                else {
                    disableControls();
                    document.getElementById('turn').disabled = true;
                }
            }, 1000); 
        }, 400);
        return;
    }
    endPlayerTurn();
    return;
}

    if (checkBlock(enemy.stats.basearmor)) {
        console.log(`${enemyname.value} BLOCKED!`);
        player.move(-550,0);

    if (enemy.ability === 'BLOCKER' || enemy.ability === 'BLOCKERDODGER' || enemy.ability === 'ALL') {
        setTimeout(() => {
            enemyhit(); 
            setTimeout(() => {
                if (health.value > 0) {
                endPlayerTurn(); 
                }
                else {
                    disableControls();
                    document.getElementById('turn').disabled = true;
                }
            }, 1000); 
        }, 400);
        return;
    }
    endPlayerTurn();
    return;
}

    const dmg = player.stats.basedmg;
    const multiplier = DmgMultiplier(player.stats.level);
    let totalDamage = dmg * multiplier;
    const crit = checkCrit(player.stats.baseagi);

    if (crit.isCrit) {
        totalDamage *= crit.multiplier;
        console.log(`${playername.value} CRITS! x${crit.multiplier.toFixed(2)}`);
    }

    const damageReduction = enemy.stats.basearmor / (enemy.stats.basearmor + 50);
    let finalDamage = Math.max(1, Math.round(totalDamage * (1 - damageReduction)));
    if (player.stats.ability === 'SHIELDBREAKERFA' || player.stats.ability ==='REGENSBLSFA' || player.stats.ability === 'ALL') {
        finalDamage *= 1.8;
        const healAmount = Math.round(finalDamage * 0.22);
        health.value = Number(health.value) + healAmount;
            if (Number(health.value) > 1500) {
                health.value = Number(1500);
            }
        console.log(`LIFESTEAL: +${healAmount} hp`);
    }
    enemyhp.value = (Number(enemyhp.value) - finalDamage).toFixed(1);
    console.log(`${playername.value}: ${finalDamage} dmg`);
    player.move(-550, 0);
    setTimeout(() => {
        if (enemyhp.value <= 0) {
        enemy.image.src = `images/enemy1_fall.png?v=${Date.now()}`;
        winner = playername.value;
        fightOverHandler();
        disableControls();
        document.getElementById("turn").disabled = true;
        return;
    }
    endPlayerTurn();
    }, 150);
}

function enemyhit() {
    enemy.image.src = `images/enemy1.png?v=${Date.now()}`;
    enemy.move(-550, 0);
    document.getElementById("turn").disabled = true;
    disableControls();

    setTimeout(() => {
        if (checkDodge(player.stats.baseagi)) {
            console.log(`${enemyname.value} MISSED!`);
            enemy.move(550, 0);
            if (player.stats.ability === 'REGENSBLSFA' || player.stats.ability === 'ALL') {
                const healAmount = Math.round(Number(health.value) * 0.08);
                health.value = Number(health.value) + healAmount;
                    if (Number(health.value) > 1500) {
                        health.value = Number(1500);
                    }
                console.log(`${playername.value} REGEN: +${healAmount} hp`);
            }
            endEnemyTurnToPlayer();
            return;
        }
        if (checkBlock(player.stats.basearmor)) {
            console.log(`${playername.value} BLOCKED!`);
            enemy.move(550, 0);
            if (player.stats.ability === 'REGENSBLSFA' || player.stats.ability === 'ALL') {
                const healAmount = Math.round(Number(health.value) * 0.08);
                health.value = Number(health.value) + healAmount;
                if (Number(health.value) > 1500) {
                    health.value = Number(1500);
                    }
                console.log(`${playername.value} REGEN: +${healAmount} hp`);
    }
            endEnemyTurnToPlayer();
            return;
        }

        const dmg = enemy.stats.basedmg;
        const multiplier = DmgMultiplier(enemy.stats.level);
        let totalDamage = dmg * multiplier;
        const crit = checkCrit(enemy.stats.baseagi);

        if (crit.isCrit) {
            totalDamage *= crit.multiplier;
            console.log(`${enemyname.value} CRITS! x${crit.multiplier.toFixed(2)}`);
        }

        const damageReduction = player.stats.basearmor / (player.stats.basearmor + 50);
        const finalDamage = Math.max(1, Math.round(totalDamage * (1 - damageReduction)));

        let currentHP = Number(health.value) - finalDamage;
        health.value = currentHP.toFixed(1);
        console.log(`${enemyname.value}: ${finalDamage} dmg`);

        if (health.value <= 0) {
            disableControls();
            document.getElementById('turn').disabled = true;
            player.image.src = `images/player_fall.png?v=${Date.now()}`;
            health.classList.add("death");
            lives.innerHTML = Number(lives.innerHTML) - 1;
            winner = enemyname.value;
            if (Number(lives.innerHTML) === 0) gameOver();
            enemy.move(550, 0);
            fightOverHandler(enemyname.value);
            return;
        }
        enemy.move(550, 0);
        endEnemyTurnToPlayer();
        if (player.stats.ability === 'REGENSBLSFA' || player.stats.ability === 'ALL') {
            const healAmount = Math.round(Number(health.value) * 0.08);
            health.value = Number(health.value) + healAmount;
                if (Number(health.value) > 1500) {
                    health.value = Number(1500);
                }
            console.log(`${playername.value} REGEN: +${healAmount} hp`);
        }
    }, 800);
}

function enemyRangeHit() {
    whosturn.innerHTML = "";
    disableControls(); 

    
    if (checkDodge(player.stats.baseagi)) {
        console.log(`${enemyname.value} MISSED!`);
        if (player.stats.ability === 'REGENSBLSFA' || player.stats.ability === 'ALL') {
            const healAmount = Math.round(Number(health.value) * 0.08);
            health.value = Number(health.value) + healAmount;
                if (Number(health.value) > 1500) {
                health.value = Number(1500);
            }
            console.log(`${playername.value} REGEN: +${healAmount} hp`);
        }
        endEnemyTurnToPlayer();
        return;
    }

    if (checkBlock(player.stats.basearmor)) {
        console.log(`${playername.value} BLOCKED!`);
        if (player.stats.ability === 'REGENSBLSFA' || player.stats.ability === 'ALL') {
            const healAmount = Math.round(Number(health.value) * 0.08);
            health.value = Number(health.value) + healAmount;
                if (Number(health.value) > 1500) {
                    health.value = Number(1500);
            }
            console.log(`${playername.value} REGEN: +${healAmount} hp`);
        }
        endEnemyTurnToPlayer();
        return;
    }
    const dmg = enemy.stats.basedmg + Math.sqrt(enemy.stats.baseagi) * 0.5;
    const multiplier = DmgMultiplier(enemy.stats.level);
    let totalDamage = dmg * multiplier;
    const crit = checkCrit(enemy.stats.baseagi);

    if (crit.isCrit) {
        totalDamage *= crit.multiplier;
        console.log(`${enemyname.value} CRITS! x${crit.multiplier.toFixed(2)}`);
    }

    const damageReduction = player.stats.basearmor / (player.stats.basearmor + 40);
    const finalDamage = Math.max(1, Math.round(totalDamage * (1 - damageReduction)));

    let currentHP = Number(health.value) - finalDamage;
    health.value = currentHP.toFixed(1);

    console.log(`${enemyname.value}: ${finalDamage} dmg`);

    if (currentHP <= 0) {
        arrow3.state = 'READY';
        winner = enemyname.value;
        player.image.src = `images/player_fall.png?v=${Date.now()}`;
        health.classList.add("death");
        lives.innerHTML = Number(lives.innerHTML) - 1;
        disableControls();
        document.getElementById('turn').disabled = true;

        if (Number(lives.innerHTML) === 0) gameOver();
        fightOverHandler(enemyname.value);
        return;
    }

    endEnemyTurnToPlayer();
    if (player.stats.ability === 'REGENSBLSFA' || player.stats.ability === 'ALL') {
        const healAmount = Math.round(Number(health.value) * 0.08);
        health.value = Number(health.value) + healAmount;
        if (Number(health.value) > 1500) {
            health.value = Number(1500);
        }
        console.log(`${playername.value} REGEN: +${healAmount} hp`);
    }
}

function enemyAttack() {
    disableControls();
    document.getElementById("turn").disabled = true;

    const roll = Math.random();
    let attackType;

    if (enemy.type === 'RANGE') attackType = roll < 0.82 ? 'RANGE' : 'MELEE';
    else if (enemy.type === 'MELEE') attackType = roll < 0.82 ? 'MELEE' : 'RANGE';
    else if (enemy.type === 'BOTH') attackType = roll < 0.5 ? 'RANGE' : 'MELEE';
    else attackType = 'MELEE';

    if (attackType === 'RANGE') {
        enemy.image.src = `images/enemy_range.png?v=${Date.now()}`;
            arrow2.x = enemy.x + enemy.width / 2;
            arrow2.y = enemy.y + enemy.height / 3;
            arrow2.targetX = player.x + player.width / 2;
            arrow2.targetY = arrow2.y;
        arrow2.state = 'FIRING';
        if (enemy.ability === 'DOUBLE' || enemy.ability === 'ALL') {
            setTimeout(() => {
            arrow3.x = enemy.x + enemy.width / 2;
            arrow3.y = enemy.y + enemy.height / 3;
            arrow3.targetX = player.x + player.width / 2;
            arrow3.targetY = arrow3.y;
                arrow3.state = 'FIRING';
            }, 250);
        }
    } else {
        enemyhit();
    }
}

function fightOverHandler(winnerName) {
    winner === winnerName;
    whosturn.innerHTML = `${winner} WINS!`;
    console.log(`${winner} WINS!`);
    if (winner === playername.value) {
        if (enemyname.value === 'Pain') {
            lives.innerHTML = Number(lives.innerHTML) + 5;
            console.log("YOU GOT 5 EXTRA LIVES!");
        }
        else if (enemyname.value === 'Lolgolaz')
        {
            lives.innerHTML = Number(lives.innerHTML) + 3;
            console.log("YOU GOT 3 EXTRA LIVES!");
        }
        whosturn.classList.remove('beginner', 'death');
        whosturn.classList.add('life');
        enemyhp.classList.add("death");
    }
    if (winner === enemyname.value) {
    whosturn.classList.remove('beginner', 'life');
    whosturn.classList.add('death');
    health.classList.add('death');
    }
    fightOver();
}

function fightOver() {
    player.stats.basehp = maxHp;
    enemy.stats.basehp = eMaxHp;
    enemyhp.classList.remove("death");
    const xpReward = Math.round(65 + enemy.stats.level * 10);
    if (winner === playername.value) {
        player.stats.addXP(xpReward);
        XP.innerHTML = `XP: ${player.stats.currentXP} / ${player.stats.xpToNextLevel}`;
        console.log(`Victory! xp: +${xpReward}`);
        inputplrlevel.value = player.stats.level;
        armor.value = player.stats.basearmor;
        agility.value = player.stats.baseagi;
        damage.value = player.stats.basedmg; 
        pointsAvailable = player.stats.baseap; 
        actionpoints.value = pointsAvailable;
    }
    setTimeout(() => {
        disableControls();
        health.classList.remove("death");
        enemyhp.classList.remove("death");
        enemy.stats.hp = enemy.stats.basehp;
        enemyhp.value = enemy.stats.hp;
        player.stats.hp = player.stats.basehp; 
        health.value = player.stats.hp;
        document.getElementById("startBtn").disabled = false;
        console.log("--------");
        if (winner === playername.value && enemy.stats.level >= 17) {
        alert(`GG! GAME OVER! ${playername.value} YOU ARE THE CHAMPION! GO GET SOME BEER!`);
        document.getElementById("startBtn").disabled = true;
        }
        else if (winner === playername.value && enemy.stats.level < 20) {
        NextEnemy();
        }
        player.image.src = `images/player.png?v=${Date.now()}`;
        startBtn.classList.remove('hidden');
            statControls.forEach(button => {
        button.classList.remove('hidden');});
    }, 1300);
}

document.addEventListener('playerLevelUp', (e) => {
  const level = e.detail.level;
  showLevelUp(`LEVEL UP! → ${level}`);
});

function showLevelUp(text) {
    const msg = document.createElement('div');
    msg.textContent = text;
    msg.className = 'levelup-msg';
    msg.style.position = 'fixed';
    msg.style.top = '40%';
    msg.style.left = '50%';
    msg.style.transform = 'translate(-50%, -50%)';
    msg.style.background = 'rgba(255, 153, 0, 0.9)';
    msg.style.padding = '20px 40px';
    msg.style.borderRadius = '15px';
    msg.style.fontSize = '24px';
    msg.style.fontWeight = 'bold';
    msg.style.color = 'black';
    msg.style.zIndex = '9999';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}

function disableControls() {
    document.getElementById("melee").disabled = true;
    document.getElementById("range").disabled = true;
}

function reenableControls() {
    
    document.getElementById("melee").disabled = false;
    document.getElementById("range").disabled = false;
}

function checkCrit(baseagi) {
    const critChance = Math.min(0.4, baseagi / (baseagi + 150)); 
    const isCrit = Math.random() < critChance;
    const critMultiplier = isCrit ? (Math.random() * 0.5 + 1.5) : 1.0; 
    return { isCrit, multiplier: critMultiplier };
}

function checkDodge(baseagi) {
    const dodgeChance = Math.min(0.2, baseagi / (baseagi + 180));
    return Math.random() < dodgeChance;
}
function checkBlock(basearmor) {
    const blockChance = Math.min(0.2, basearmor / (basearmor + 180));
    return Math.random() < blockChance;
}
function gameOver() {
    setTimeout(() => {
        alert("GAMEOVER! Page will refresh now and you can try again!");
        window.location.reload();
    }, 1500);
    
}

const playerStatsInputs = {
    basehp: document.getElementById('health'),
    basearmor: document.getElementById('armor'), 
    basedmg: document.getElementById('damage'),
    baseagi: document.getElementById('agility'),
};

let pointsAvailable = player.stats.baseap;

let intervalId = null; 
let timeoutId = null;  
const INITIAL_DELAY = 200; 
const REPEAT_RATE = 50;   

function handleStatAdjustment(buttonElement) {
    if(!buttonElement) return;
    const statName = buttonElement.dataset.stat; 
    const direction = buttonElement.dataset.direction; 
    
    let currentBaseStat = player.stats[statName]; 

if (direction === 'up' && pointsAvailable > 0) {
    // Estä HP yli 1500
    if (statName === 'basehp' && currentBaseStat >= 1500) {
        stopRepeating();
        return;
    }

    currentBaseStat += 1;
    pointsAvailable -= 1;
} 
else if (direction === 'down' && currentBaseStat > 1) {
    currentBaseStat -= 1;
    pointsAvailable += 1;
} 
else {
    stopRepeating();
    return; 
}

    player.stats[statName] = currentBaseStat;
    playerStatsInputs[statName].value = currentBaseStat;
    actionpoints.value = pointsAvailable;

    // Päivitä suorat inputit
    if (statName === 'basehp') health.value = currentBaseStat;
    if (statName === 'basedmg') damage.value = currentBaseStat;
    if (statName === 'basearmor') armor.value = currentBaseStat;
    if (statName === 'baseagi') agility.value = currentBaseStat;
}

function stopRepeating() {
    clearTimeout(timeoutId);
    clearInterval(intervalId);
    timeoutId = null;
    intervalId = null;
}

// Hiiri- ja kosketustapahtumat molemmat
statControls.forEach(button => {
    const buttonElement = button; 

    // ---- Hiiri ----
    button.addEventListener('mousedown', () => {
        stopRepeating(); 
        handleStatAdjustment(buttonElement); 
        timeoutId = setTimeout(() => {
            intervalId = setInterval(() => handleStatAdjustment(buttonElement), REPEAT_RATE);
        }, INITIAL_DELAY);
    });
    button.addEventListener('mouseup', stopRepeating);
    button.addEventListener('mouseleave', stopRepeating);

    // ---- Kosketus (mobiili) ----
    button.addEventListener('touchstart', e => {
        e.preventDefault(); // estää kaksoisklikkaukset ja tekstin valinnan
        stopRepeating();
        handleStatAdjustment(buttonElement);
        timeoutId = setTimeout(() => {
            intervalId = setInterval(() => handleStatAdjustment(buttonElement), REPEAT_RATE);
        }, INITIAL_DELAY);
    });
    button.addEventListener('touchend', stopRepeating);
    button.addEventListener('touchcancel', stopRepeating);
});


const ENEMY_TEMPLATES = [
  null, 
  { name: "r00kie", type: "MELEE", hpMul: 1.1, armor: 1.5, dmg: 1.5, agi: 1.5, ability: ''},
  { name: "Arrow", type: "RANGE", hpMul: 2.6, armor: 2.2, dmg: 3.5, agi: 2.2, ability: ''},
  { name: "Dagger", type: "MELEE", hpMul: 3.4, armor: 3.2, dmg: 4.3, agi: 2.5, ability: ''},
  { name: "Spearer", type: "RANGE", hpMul: 4.3, armor: 3.3, dmg: 5.2, agi: 4.2, ability: ''},
  { name: "Multitasker", type: "BOTH", hpMul: 5.8, armor: 5, dmg: 5.4, agi: 4, ability: '' },
  { name: "Ranger", type: "RANGE", hpMul: 5.8, armor: 4.1, dmg: 6.2, agi: 6.6, ability: '' },
  { name: "Swordish", type: "MELEE", hpMul: 7.2, armor: 6, dmg: 6.5, agi: 5, ability: '' },
  { name: "Robin Noob", type: "RANGE", hpMul: 6.8, armor: 5, dmg: 6.8, agi: 8, ability: '' },
  { name: "Jon Blizzard",type: "MELEE", hpMul: 7.6, armor: 7.4, dmg: 7.4, agi: 6, ability: '' },
  { name: "Pain", type: "BOTH", hpMul: 9, armor: 6, dmg: 9, agi: 7.5, ability: '' },
  { name: "Prisoner", type: "BOTH", hpMul: 11, armor: 7, dmg: 9, agi: 8, ability: '' },
  { name: "Dominator", type: "BOTH", hpMul: 11, armor: 13, dmg: 9, agi: 8, ability: 'BLOCKER' },
  { name: "Hellbringer", type: "MELEE", hpMul: 12, armor: 9, dmg: 13, agi: 14, ability: 'DODGER' },
  { name: "Lolgolaz", type: "RANGE", hpMul: 16, armor: 9, dmg: 19, agi: 23, ability: 'DOUBLE' },
  { name: "Sparta Cause", type: "BOTH", hpMul: 19, armor: 19, dmg: 18, agi: 16, ability: 'BLOCKERDODGER' },
  { name: "Bocky Ralboa", type: "BOTH", hpMul: 22, armor: 21, dmg: 21, agi: 19, ability: 'ALL' },
  { name: "Rohn Jambo", type: "RANGE", hpMul: 23, armor: 24, dmg: 24, agi: 23, ability: 'ALL' }
];

NextEnemy();

function NextEnemy() {
    currentEnemyLevel += 1;
    const template = ENEMY_TEMPLATES[currentEnemyLevel] || ENEMY_TEMPLATES[1];

    const baseHp = 30;
    const baseDmg = 10;
    const baseArmor = 5;
    const baseAgi = 5;

    const levelScale = 1 + (currentEnemyLevel - 1) * 0.2

    const newHp = baseHp * template.hpMul * levelScale;
    const newDmg = baseDmg * template.dmg * levelScale;
    const newArmor = baseArmor * template.armor * levelScale;
    const newAgi = baseAgi * template.agi * levelScale;
    enemy.type = template.type;

    enemy = new Enemy(590, 400, newHp, newDmg, newAgi, newArmor, template.name, template.type, template.ability); 

    enemy.stats.level = currentEnemyLevel; 

    enemyhp.value = enemy.stats.hp.toFixed(1);
    enemydmg.value = enemy.stats.basedmg.toFixed(1);
    enemyarmor.value = enemy.stats.armor.toFixed(1);
    enemyagi.value = enemy.stats.agility.toFixed(1);
    inputcpulevel.value = enemy.stats.level;
    enemyname.value = template.name;

    console.log(`vs. ${template.name} - level: ${currentEnemyLevel} - fighting style: ${enemy.type} - special ability: ${enemy.ability}`);

}

function initializeConsoleOutput() {
    const originalConsoleLog = console.log;
    console.log = function(...args) {
        originalConsoleLog.apply(console, args);
        const logLine = document.createElement('div');
        logLine.textContent = args.map(arg => {
            if (typeof arg === 'object' && arg !== null) {
                return JSON.stringify(arg);
            }
            return String(arg);
        }).join(' ');

        if (consoleOP) {
            consoleOP.prepend(logLine);
        }
    };
}