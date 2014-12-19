window.TILE_WIDTH = 101;
window.TILE_HEIGHT = 83;
window.NUM_ROWS = 6;
window.NUM_COLS = 5;

var Character = function(x, y, sprite) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
};


// Enemies our player must avoid
var Enemy = function() {
  Character.call(this, 0, 0, 'images/enemy-bug.png');
  this.reset();
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(dt) {
  this.x += this.speed * dt;
  if (this.x > TILE_WIDTH * NUM_COLS) {
    this.reset();
  }
};

Enemy.prototype.render = function() {
  var verticalOffset = -23;
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y + verticalOffset);
};

Enemy.prototype.reset = function() {
  this.x = -TILE_WIDTH;
  this.y = (Math.floor(Math.random() * 3) + 1) * TILE_HEIGHT;
  this.speed = (Math.floor(Math.random() * 5) + 1) * 100;
};


// Our Player class
var Player = function(x, y) {
  Character.call(this, 0, 0);
  this.sprite = 'images/char-boy.png';
  this.reset();
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {

};

Player.prototype.render = function() {
  var verticalOffset = -23;
  ctx.drawImage(Resources.get(this.sprite), 
    this.x, this.y + verticalOffset);
};

Player.prototype.handleInput = function(dir) {
  if (dir === 'up' && this.y > 0) {
    this.y -= TILE_HEIGHT;
  }
  if (dir === 'right' && this.x < TILE_WIDTH * (NUM_COLS - 1)) {
    this.x += TILE_WIDTH;
  }
  if (dir === 'down' && this.y < TILE_HEIGHT * (NUM_ROWS - 1)) {
    this.y += TILE_HEIGHT;
  }
  if (dir === 'left' && this.x > 0) {
    this.x -= TILE_WIDTH;
  }
};

Player.prototype.reset = function() {
  this.x = TILE_WIDTH * 2;
  this.y = TILE_HEIGHT * 5;
};

var numEnemies = 3;
window.allEnemies = [];
for (var i = 0; i < numEnemies; i++) {
  window.allEnemies.push(new Enemy());
}


window.player = new Player();

document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});
