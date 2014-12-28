/**
 * @fileoverview engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on the player and enemy objects.
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */


var engine = (function(global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        allGems = [],
        /** Current game state, indicates the current scene */
        gameState = 'welcome';

    /**
     * The GameBoard, each letter indicates the tile background.
     */
    win.gameBoard = [
      ['w', 'w', 'w', 'w', 'g'],
      ['s', 's', 's', 's', 's'],
      ['s', 'w', 'w', 'w', 's'],
      ['s', 'w', 's', 's', 's'],
      ['w', 'g', 'g', 'g', 'g'],
      ['g', 'g', 'g', 'g', 'g']
    ];

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);


    /**
     * This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        update(dt);
        render();
        lastTime = now;
        win.requestAnimationFrame(main);
    };

    /**
     * This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset('welcome');
        lastTime = Date.now();
        main();
    }

    /**
     * This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        switch (gameState) {
            case 'level':
                updateEntities(dt);
                checkCollisions();
            break;
        }
    }

    /**
     * This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
    }

    /**
     * This function checks if our player collides with either an Enemy,
     * or a Gem, or a Water Tile. Then, it resets the gameState accordingly.
     */
    function checkCollisions() {
        if (mapPositionToBackground(player.x, player.y) === 'w') {
            reset('level');
            return;
        }

        allEnemies.forEach(function(enemy) {
            if (player.collides(enemy)) {
                reset('level');
                return;
            }
        });

        allGems.forEach(function(gem) {
            if (player.collides(gem)) {
                allGems.splice(allGems.indexOf(gem), 1);
                if (allGems.length === 0) {
                    reset('win');
                    return;
                }
            }
        });
    }

    /**
     * This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        switch (gameState) {
          case 'welcome':
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              var textPos = { x: canvas.width / 2, y: canvas.height / 2 };
              drawText('Get all 3 gems!', textPos.x, textPos.y);
              drawText('(press enter)', textPos.x, textPos.y + 72);
          break;

          case 'level':
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              var row, col;
              for (var row = 0; row < win.gameBoard.length; row++) {
                  for (var col = 0; col < win.gameBoard[row].length; col++) {
                      var sprite;
                      switch (win.gameBoard[row][col]) {
                          case 'g':
                              sprite = 'images/grass-block.png';
                          break;
                          case 's':
                              sprite = 'images/stone-block.png';
                          break;
                          case 'w':
                              sprite = 'images/water-block.png';
                          break;
                      }
                      ctx.drawImage(Resources.get(sprite), col * win.TILE_WIDTH,
                          row * win.TILE_HEIGHT);
                  }
              }
              renderEntities();
          break;

          case 'win':
              var textPos = {x: canvas.width / 2, y: canvas.height / 2};
              drawText('You win! Try again?', textPos.x, textPos.y);
              drawText('(press enter)', textPos.x, textPos.y + 72);
          break;
        }
    }

    /**
     * This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        allGems.forEach(function(gem) {
            gem.render();
        });
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        player.render();
    }

    /**
     * This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset(scene) {
        switch (scene) {
          case 'welcome':
              gameState = 'welcome';
          break;

          case 'level':
              gameState = 'level';
              allGems.splice(0);
              allGems.push(new Gem(TILE_WIDTH * 4, TILE_HEIGHT * 0, 'blue'));
              allGems.push(new Gem(TILE_WIDTH * 0, TILE_HEIGHT * 3, 'green'));
              allGems.push(new Gem(TILE_WIDTH * 0, TILE_HEIGHT * 1, 'orange'));
              player.reset();
          break;

          case 'win':
              gameState = 'win';
          break;
        }
    }

    /**
     * Returns the current GameBoard Tile type.
     * @param {number} x
     * @param {number} y
     * @return {string} The tile type
     */
    function mapPositionToBackground(x, y) {
        return win.gameBoard[y / TILE_HEIGHT][x / TILE_WIDTH];
    }

    /**
     * Draws the specified text on the x, y canvas position.
     * @param {string} text
     * @param {number} x
     * @param {number} y
     */
    function drawText(text, x, y) {
        ctx.font = '40px Impact';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(text, x, y);
        ctx.strokeText(text, x, y);
    }

    /**
     * Listen to the enter key, and reset to the correct gameState.
     */
    doc.addEventListener('keyup', function(e) {
        if (e.keyCode === 13) {
          switch (gameState) {
              case 'welcome':
                  reset('level');
              break;
              case 'win':
                  reset('welcome');
              break;
          }
        }
      });

    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Rock.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);
