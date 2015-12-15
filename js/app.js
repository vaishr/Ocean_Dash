var columnX = [-2,99,200,301,503,604,705];
var roadRows = [73, 155, 237];


//Superclass for all game players, tokens, and enemies
var Character = function() {
    this.x = 0;
    this.y =  180;
    this.sprite = 'images/enemy-bug.png';
};

Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//Sub class for enemies
var Enemy = function() {
    Character.call(this);
    this.speed = 180;
    this.y = roadRows[Math.floor(Math.random()*roadRows.length)];
};

//Sets up prototype chain for Enemy to inherit methods from Character class
Enemy.prototype = Object.create(Character.prototype);

//Resets constructor to Enemy rather than Character
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (dt === 0) return;
    this.x = this.x + (dt * this.speed);
    this.speed = this.setSpeed();
};

Enemy.prototype.setSpeed = function() {
    switch(player.getLevel()) {
        case 3:
            return 401;
            break;
        case 2:
            return 301;
            break;
        default:
            return 180;
    }
};

var Player = function() {
    Character.call(this);
    this.sprite = 'images/char-pink-girl.png';
    this.score = 0;
    this.level = 1;
    this.lives = 0;
    this.x = -2;
    this.y = 401;
};

Player.prototype = Object.create(Character.prototype);

Player.prototype.constructor = Player;

Player.prototype.handleInput = function(direction) {
    if (direction === 'left' && this.x > 0) {
        this.x = this.x - 101;
    }
    if (direction === 'down' && this.y < 400) {
        this.y = this.y + 82;
    }
    if (direction === 'right' && this.x < 700) {
        this.x = this.x + 101;
    }
    if (direction === 'up' && this.y > 0) {
        this.y = this.y - 82;
    }
};

Player.prototype.addScore = function(gemValue) {
    this.score += gemValue;
    document.getElementById('score').innerHTML = 'Score : ' + this.score;
};

Player.prototype.addLife = function() {
    this.lives++;
    document.getElementById('lives').innerHTML = 'Lives : ' + this.lives;
};

Player.prototype.nextLevel = function() {
    if (this.level === 3) return;  
    this.level++;   
    this.x = -2;
    this.y = 401;
    document.getElementById('level').innerHTML = 'You are on Level ' + this.level;
};

//getter function to get player level 
Player.prototype.getLevel = function() {
    return this.level;
};

//set enemy frequency based on player level
Player.prototype.setFreq = function() {
    switch(this.level) {
        case 3:
            return 250;
            break;
        case 2:
            return 500;
            break;
        default:
            return 800;
    }
};

//insantiate new player
var player = new Player();

//storage for created enemies and tokens
var allEnemies = [];
var allTokens = [];

//function to instantiate new enemy and add it to allEnemies array
function newEnemy() {
    var enemy = new Enemy();
    allEnemies.push(enemy);
}

//token class
var Token = function(value) { 
    Character.call(this); 
    this.value = value;  
    this.visible = true;
    this.x = columnX[Math.floor(Math.random()*columnX.length)];
    this.y = roadRows[Math.floor(Math.random()*roadRows.length)];
    this.sprite = 'images/GemOrange.png';
};

Token.prototype.render = function() {
    if (!this.visible) return; 
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Token.prototype.update = function() {
    if (this.visible && this.x === player.x && this.y === player.y) {
        this.visible = false;
        if (this.value > 0) { this.collectPoints() };
        if (this.increaseLives) { this.increaseLives() };
        if (this.advanceLevel) { this.advanceLevel() };
        return true;
    }
};

Token.prototype.collectPoints = function() {
    player.addScore(this.value);
};

//functions which create instances of new tokens and store them in allTokens array
function newGem() {
    var gem = new Token(10);
    allTokens.push(gem);
}

function newBlueGem() {
    var blueGem = new Token(50);
    blueGem.sprite = 'images/GemBlue.png';
    allTokens.push(blueGem);
}

function newHeart() {
    var heart = new Token(0);
    heart.sprite = 'images/Heart.png';
    heart.increaseLives = function() {
        player.addLife();
    }
    allTokens.push(heart);
}

function newKey() {
    var key = new Token(0);
    key.sprite = 'images/Key.png';
    key.advanceLevel = function() {
       player.nextLevel();
    }
    allTokens.push(key);
}

// This listens for key presses 
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
