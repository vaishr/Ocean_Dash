/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */

    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 808;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /*
    Game looks as if it's 'frozen' when this is set to true since all entitites will stop being re-rendered in main function
    */
    var gameOver = false;
    
    /* For clearing interval between levels and new games and used in reset function
    */
    var timeoutID;
    
    var gameOverMessage = document.body.getElementsByClassName('game_over');

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */

    function main() {

        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        if (!gameOver) {
        update(dt);
        render();
        }
        
        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;
        console.log('main is running');
        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        newGame();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
        checkWin();
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        allTokens.forEach(function(token) {
            token.update();
        });
    }

    /*  Creates button to play again, which when clicked resets game settings and calls newGame to create new enemies and tokens
    */
    function playAgain() {
        var playAgainBtn = document.createElement('button');
                    playAgainBtn.innerHTML = 'Play Again'; 
                    gameOverMessage[0].appendChild(playAgainBtn);
                    var div = document.createElement('div');
                    div.className = 'space';
                    gameOverMessage[0].appendChild(div); 
                    playAgainBtn.onclick = function() {
                        gameOver = false;
                        player.score = 0;
                        player.level = 1;
                        player.lives = 0;
                        newGame();
                        document.getElementById('score').innerHTML = 'Score : ' + player.score;
                        document.getElementById('level').innerHTML = 'You are on Level ' + player.level;
                        document.getElementById('lives').innerHTML = 'Lives : ' + player.lives;
                        gameOverMessage[0].innerHTML = '';
                    };
    }

    /*
    Checks all the enemies to see if any of them are in the same position as the player (a collision).  If so, then based on the number of extra lives the player has the game will either be reset and display playAgain button (which happens if the player has no extra lives), or if the player has at least 1 extra life the game will continue at the same level with the player position reset and the lives count reduced 
    */
    function checkCollisions() {
      for (var i = 0; i < allEnemies.length; i++) {
        if (allEnemies[i].hit === true) continue;
        var padding = 35;
        var maxX = player.x + padding;
        var minX = player.x - padding;
            if ((allEnemies[i].x < maxX) && (allEnemies[i].x > minX) && (player.y == allEnemies[i].y)) {
                reset();
                allEnemies[i].hit = true;
                if (player.lives === 0 ) {
                    gameOver = true;
                    gameOverMessage[0].innerHTML = '<h1>GAME OVER!!!<h1>';
                    playAgain();
                }
                if (player.lives > 0) {
                    player.lives--;
                    if (player.lives < 0) { player.lives = 'over'; }
                    document.getElementById('lives').innerHTML = 'Lives : ' + player.lives;
                    gameOverMessage[0].innerHTML = '<h1>You are using your last life!<h1>';
                }
                return true;
            }
        }
        return false;
    }    

    /*
    Checks the player position to see if it is in the water.  then determines based on the game level if the player advances to the next level or wins the whole game
    */
    function checkWin() {
        if (player.y < 0) {
            if (player.level < 3 ) {
                player.level++;
                reset();
                document.getElementById('level').innerHTML = 'You are on Level ' + player.level;
            }
            else { 
                gameOver = true;
                gameOverMessage[0].innerHTML ='<h1>Congrats!!</h1><img src= images/trophygif.gif><img src= images/trophygif.gif><img src= images/trophygif.gif><img src= images/trophygif.gif><img src= images/trophygif.gif>';
                playAgain();
            }
            reset();
            return true;
        }
        return false;
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 8,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }


        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        allTokens.forEach(function(token) {
            token.render();
        });

        player.render();
    }

    /* This function resets the player position and clears the interval whenever it's called
     */
    function reset() {
        player.x = -2;
        player.y = 401;
        if (timeoutID) {clearInterval(timeoutID);}
        timeoutID = setInterval(newEnemy, player.setFreq());
    
    }

    /*
    This populates the game with new enemies and tokens and calls reset to set initial player position
    */
    function newGame() {
        allEnemies = [];
        allTokens = [];
        reset();
        newEnemy();
        newEnemy();
        newGem();
        newGem();
        newGem();
        newBlueGem();
        newHeart();
        newKey();
    }

    /* Load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-pink-girl.png',
        'images/GemOrange.png',
        'images/Heart.png',
        'images/Key.png',
        'images/Rock.png',
        'images/GemBlue.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
