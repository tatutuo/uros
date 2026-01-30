export default class CharacterStats {
    constructor(basehp, basearmor, baseagi, basedmg, baseap,ability=null) {
        this.level = 1;
        this.currentXP = 0;
        this.xpToNextLevel = 50;
        this.baseap = baseap;

        this.basehp = basehp;
        this.basearmor = basearmor;
        this.baseagi = baseagi;
        this.basedmg = basedmg;

        this.ability = ability;

        this.ap = baseap;
        this.hp = basehp;
        this.armor = basearmor;
        this.agility = baseagi;
    }
    
    addXP(amount) {
        this.currentXP += amount;
        this.checkLevelUp();
    }

    checkLevelUp() {
        while (this.currentXP >= this.xpToNextLevel) {
            this.levelUp();
        }
    }

levelUp() {
    this.level += 1;
    this.currentXP -= this.xpToNextLevel;
    this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.2);

    this.basehp += 17 + (this.level * 5);
    this.basedmg += 13 + (this.level * 2.5);
    this.baseap = 42;

    switch (this.level) {
        case 10:
            console.log("NEW ABILITY: FIRE ARROWS!");
            this.ability = 'FIREARROW';
            this.baseap = 56;
            break;
        case 11:
            console.log("NEW ABILITY: RANGE LIFESTEAL!");
            this.ability = 'FIREARROWLIFESTEAL';
            this.baseap = 66;
            break;
        case 12:
            console.log("NEW WEAPON: SHIELDBREAKER! + MELEE LIFESTEAL");
            this.ability = 'SHIELDBREAKERFA';
            this.baseap = 120;
            break;
        case 13:
            console.log("NEW ABILITY: REGENERATION!");
            this.ability = 'REGENSBLSFA';
            this.baseap = 150;
            break;
        case 14:
            console.log("NEW ABILITY: POISONOUS!");
            this.ability = 'ALL';
            this.baseap = 160;
            break;
    }

    console.log(`LEVEL UP! → ${this.level}`);
    const ev = new CustomEvent('playerLevelUp', { detail: { level: this.level } });
    document.dispatchEvent(ev);
}
    
}
    
