var columnX = [-2,99,200,301,503,604,705];
var roadRows = [73, 155, 237];


// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    this.speed = 180;
    this.y = roadRows[Math.floor(Math.random()*roadRows.length)];
};

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
    switch(player.level) {
        case 3:
            return 401;
            break;
        case 2:
            return 301;
            break;
        default:
            return 180;
    }
}

var setFreq = function() {
    console.log("player level", player.level);
    switch(player.level) {
        case 3:
            return 200;
            break;
        case 2:
            return 500;
            break;
        default:
            return 800;
    }
}
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function() {
    this.sprite = 'images/char-pink-girl.png';
    this.score = 0;
    this.level = 1;
    this.lives = 0;
    this.x = -2;
    this.y = 401;
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

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
}

var player = new Player();

var allEnemies = [];

var allTokens = [];

function newEnemy() {
    var enemy = new Enemy();
    allEnemies.push(enemy);
};

var Token = function() {    
    this.visible = true;
    this.x = columnX[Math.floor(Math.random()*columnX.length)];
    this.y = roadRows[Math.floor(Math.random()*roadRows.length)];
    this.sprite = 'images/GemOrange.png';
}

Token.prototype.render = function() {
    if (!this.visible) return; 
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Token.prototype.update = function() {
    if (this.visible && this.x === player.x && this.y === player.y) {
        this.visible = false;
        if (this.addScore) { this.addScore() };
        if (this.increaseLives) { this.increaseLives() };
        if (this.advanceLevel) { this.advanceLevel(); };
        return true;
    }
}

var newGem = function() {
    var gem = new Token();
    gem.value = 10;
    gem.addScore = function() {
        player.score += gem.value;
        document.getElementById('score').innerHTML = 'Score : ' + player.score;
    }
    allTokens.push(gem);
}

var newBlueGem = function () {
    var blueGem = new Token();
    blueGem.value = 50;
    blueGem.addScore = function() {
        player.score += blueGem.value;
        document.getElementById('score').innerHTML = 'Score : ' + player.score;
    }
    blueGem.sprite = 'images/GemBlue.png';
    allTokens.push(blueGem);
}

var newHeart = function() {
    var heart = new Token();
    heart.sprite = 'images/Heart.png';
    heart.increaseLives = function() {
        player.lives++;
        document.getElementById('lives').innerHTML = 'Lives : ' + player.lives;
    }
    allTokens.push(heart);
}

var newKey = function() {
    var key = new Token();
    key.sprite = 'images/Key.png';
    key.advanceLevel = function() {
        player.level++;
        player.x = -2;
        player.y = 401;
        document.getElementById('level').innerHTML = 'You are on Level ' + player.level;
        var level = setFreq();
        console.log('levelFreq++',level);
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
