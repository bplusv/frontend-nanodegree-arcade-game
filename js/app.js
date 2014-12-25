window.TILE_WIDTH = 101;
window.TILE_HEIGHT = 83;
window.NUM_ROWS = 6;
window.NUM_COLS = 5;

var Entity = function(x, y, sprite, verticalOffset) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
  this.verticalOffset = verticalOffset;
};

Entity.prototype.reset = function() {};

Entity.prototype.update = function(dt) {};

Entity.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y + this.verticalOffset);
};


// Enemies our player must avoid
var Enemy = function() {
  Entity.call(this, 0, 0, 'images/enemy-bug.png', -23);
  this.reset();
};

Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.reset = function() {
  this.x = -TILE_WIDTH;
  this.y = (Math.floor(Math.random() * 3) + 1) * TILE_HEIGHT;
  this.speed = (Math.floor(Math.random() * 5) + 1) * 100;
};

Enemy.prototype.update = function(dt) {
  this.x += this.speed * dt;
  if (this.x > TILE_WIDTH * NUM_COLS) {
    this.reset();
  }
};


// Our Player class
var Player = function(x, y) {
  Entity.call(this, 0, 0, 'images/char-boy.png', -23);
  this.reset();
};

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

Player.prototype.reset = function() {
  this.x = TILE_WIDTH * 2;
  this.y = TILE_HEIGHT * 5;
};

Player.prototype.collides = function(enemy) {
  return this.y === enemy.y &&
    (enemy.x + TILE_WIDTH / 2) >= this.x &&
    (enemy.x + TILE_WIDTH / 2) <= (this.x + TILE_WIDTH);
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



var Gem = function(x, y, color) {
  var sprite = 'images/Gem Blue.png';
  switch (color) {
    case 'green':
      sprite = 'images/Gem Green.png';
    break;
    case 'orange':
      sprite = 'images/Gem Orange.png';
    break;
    case 'blue':
      sprite = 'images/Gem Blue.png';
    break;
  }
  Entity.call(this, x, y, sprite, -36)
};

Gem.prototype = Object.create(Entity.prototype);
Gem.prototype.constructor = Gem;


window.allEnemies = [];
var numEnemies = 5;
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
