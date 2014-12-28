/**
 * @fileoverview app.js
 * This file provides the entities used by the game engine.
 * Each entity inherits from the Entity Base class.
 */


 /**
 * GameBoard Tile width, size in pixels.
 * @type {number}
 */
window.TILE_WIDTH = 101;

/**
 * GameBoard Tile height, size in pixels.
 * @type {number}
 */
window.TILE_HEIGHT = 83;

/**
 * Number of rows in the GameBoard.
 * @type {number}
 */
window.NUM_ROWS = 6;

/**
 * Number of columns in the GameBoard.
 * @type {number}
 */
window.NUM_COLS = 5;

/**
 * Array of all the enemies.
 * @type {Array.<Enemy>}
 */
window.allEnemies = [];

/**
 * Our hero, the player.
 * @type {Player}
 */
window.player;


/**
 * Entity Base Class to be used by all the other entities.
 * @param {number} x Position on canvas.
 * @param {number} y Position on canvas.
 * @param {string} sprite The image to be drawn.
 * @param {number} spriteVerticalOffset Offset used to draw the Image.
 * @constructor
 */
var Entity = function(x, y, sprite, spriteVerticalOffset) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.spriteVerticalOffset = spriteVerticalOffset;
};

/**
 * Base render method for all the entities.
 */
Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x,
        this.y + this.spriteVerticalOffset);
};


/**
 * Enemies our player must avoid.
 * @constructor
 * @extends {Entity}
 */
var Enemy = function() {
    Entity.call(this, 0, 0, 'images/enemy-bug.png', -23);
    this.reset();
};

Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

/** Resets the enemy position & speed randomly. */
Enemy.prototype.reset = function() {
    this.x = -TILE_WIDTH;
    this.y = (Math.floor(Math.random() * 3) + 1) * TILE_HEIGHT;
    this.speed = (Math.floor(Math.random() * 5) + 1) * 100;
};

/**
 * Updates the enemy position. Also, resets the position when
 * the enemy moves out the screen limits.
 * @param {number} dt
 */
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    if (this.x > TILE_WIDTH * NUM_COLS) {
        this.reset();
    }
};


/**
 * The Player entity class.
 * @param {number} x Position on the canvas.
 * @param {number} y Position on the canvas.
 * @constructor
 * @extends {Entity}
 */
var Player = function(x, y) {
    Entity.call(this, 0, 0, 'images/char-boy.png', -23);
    this.reset();
};

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

/** Resets the player to its original position. */
Player.prototype.reset = function() {
    this.x = TILE_WIDTH * 2;
    this.y = TILE_HEIGHT * 5;
};

/**
 * Checks if the player collides with the specified entity.
 * @param {Entity} entity
 * @return {boolean} There's a collision?
 */
Player.prototype.collides = function(entity) {
    return this.y === entity.y && (entity.x + TILE_WIDTH / 2) >= this.x &&
        (entity.x + TILE_WIDTH / 2) <= (this.x + TILE_WIDTH);
};

/**
 * Handles the keyboard input and moves the player accordingly.
 * Prevents the player to move out the screen limits.
 * @param {string} dir The direction the player will move.
 */
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


/**
 * Gem Item Class our player must collect.
 * @param {number} x Position on the canvas.
 * @param {number} y Position on the canvas.
 * @param {string} color The sprite to be used by the Gem.
 * @constructor
 * @extends {Entity}
 */
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
    Entity.call(this, x, y, sprite, -36);
};

Gem.prototype = Object.create(Entity.prototype);
Gem.prototype.constructor = Gem;


/** Initialize all the required entities. */
window.allEnemies = [];
var enemiesCount = 5;
for (i = 0; i < enemiesCount; i++) {
    window.allEnemies.push(new Enemy());
}
window.player = new Player();


/** Listen for the keyboard events and pass them to the player. */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
