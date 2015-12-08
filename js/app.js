var columnX = [-2,99,200,301,503,604,705];
var roadRows = [73, 155, 237];


// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    this.speed =  401;
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
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function() {
    this.sprite = 'images/char-pink-girl.png';
    this.score = 0;

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

var allEnemies = [];

function newEnemy() {
    var enemy = new Enemy();
    allEnemies.push(enemy);
};

newEnemy();
newEnemy();
setInterval(newEnemy, 500);

var player = new Player();

var Token = function(value) {
    this.value = value;
    this.visible = true;
    this.x = columnX[Math.floor(Math.random()*columnX.length)];
    this.y = roadRows[Math.floor(Math.random()*roadRows.length)];
    this.seconds = Math.random()*4000;
    this.sprite = 'images/GemOrange.png';
}

Token.prototype.render = function() {
    if (!this.visible) return; 
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Token.prototype.update = function() {

}

Token.prototype.addToScore = function() {
    if (this.visible && this.x === player.x && this.y === player.y) {
    player.score += this.value;
    this.visible = false;
    }
}

var gem1 = new Token(10);
var gem2 = new Token(10);

var allTokens = [gem1, gem2];



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
