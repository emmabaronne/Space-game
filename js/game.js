let astronaut;
let cursors;
let enemies;
let tokens;  // Tokens to be collected
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;  // Retrieve stored high score or default to 0
let gameOver = false;
let scoreText;
let highScoreText;
let gameStarted = false;
let startButton;

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
    },
    backgroundColor: '#000000',
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 50 },  // Adjusted gravity for floating
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Create the Phaser game instance
const game = new Phaser.Game(config);

// Preload assets
function preload() {
    this.load.image('astronaut', 'assets/astronaut.png');
    this.load.image('background', 'assets/background.png');
    this.load.image('asteroid', 'assets/asteroid.png');  // Preload asteroid (enemy)
    this.load.image('token', 'assets/brand-product.png');  // Preload token (brand product)
}

// Create game objects and input handlers
function create() {
    // Add background image
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    background.displayWidth = this.scale.width;
    background.displayHeight = this.scale.height;

    // Set scale factors for mobile and desktop
    let astronautScaleFactor = this.scale.width < 600 ? 0.16 : 0.25;
    let asteroidScaleFactor = this.scale.width < 600 ? 0.06 : 0.08;  // Updated asteroid scale
    let productScaleFactor = this.scale.width < 600 ? 0.06 : 0.08;   // Updated brand product scale

    // Add astronaut with physics
    astronaut = this.physics.add.sprite(this.scale.width / 2, this.scale.height - 100, 'astronaut').setInteractive();
    astronaut.setScale(astronautScaleFactor);
    astronaut.setBounce(0.4);  // Increase bounce for more visible floating
    astronaut.setCollideWorldBounds(true);  // Prevent astronaut from leaving bounds
    astronaut.setDragX(500);  // Smooth drag for left-right movement
    astronaut.body.allowGravity = true;  // Floating effect
    
    // Create enemies group (asteroids)
    enemies = this.physics.add.group();
    this.time.addEvent({
        delay: 1500,
        callback: function() { spawnAsteroid(asteroidScaleFactor); },  // Pass scale factor
        callbackScope: this,
        loop: true
    });

    // Create tokens group (brand products)
    tokens = this.physics.add.group();
    this.time.addEvent({
        delay: 2000,
        callback: function() { spawnToken(productScaleFactor); },  // Pass scale factor
        callbackScope: this,
        loop: true
    });

    // Initialize score text
    scoreText = this.add.text(10, 10, 'Score: 0', { font: '16px Arial', fill: '#ffffff' });

    // Initialize high score text
    highScoreText = this.add.text(10, 30, `High Score: ${highScore}`, { font: '16px Arial', fill: '#ffffff' });

    // Initialize keyboard input
    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addKeys({ 'A': Phaser.Input.Keyboard.KeyCodes.A, 'D': Phaser.Input.Keyboard.KeyCodes.D });

    // Add collision detection between astronaut and asteroids (enemies)
    this.physics.add.overlap(astronaut, enemies, handleCollision, null, this);

    // Add collision detection between astronaut and tokens
    this.physics.add.overlap(astronaut, tokens, collectToken, null, this);

    // Create the Start Game button at the top of the screen
    startButton = this.add.text(this.scale.width / 2, 50, 'Start Game', { font: '32px Arial', fill: '#00ff00' });
    startButton.setOrigin(0.5);
    startButton.setInteractive().on('pointerdown', startGame, this);

    // Enable swipe/drag interaction for mobile
    const hammer = new Hammer(document.body);
    hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
    hammer.on('panmove', moveAstronaut);
}

// Start the game
function startGame() {
    startButton.destroy();  // Remove the Start Game button
    gameStarted = true;
}

// Spawn an asteroid (enemy)
function spawnAsteroid(scaleFactor) {
    if (!gameOver && gameStarted) {
        let asteroidX = Phaser.Math.Between(50, config.scale.width - 50);
        let asteroid = enemies.create(asteroidX, 0, 'asteroid');
        asteroid.setVelocityY(100);  // Adjust speed for asteroids
        asteroid.setScale(scaleFactor);  // Apply scale factor (0.08 for desktop, 0.06 for mobile)
    }
}

// Spawn a token (brand product)
function spawnToken(scaleFactor) {
    if (!gameOver && gameStarted) {
        let tokenX = Phaser.Math.Between(50, config.scale.width - 50);
        let token = tokens.create(tokenX, 0, 'token');
        token.setVelocityY(80);  // Token moves slower than asteroids
        token.setScale(scaleFactor);  // Apply scale factor (0.08 for desktop, 0.06 for mobile)
    }
}

// Collect token and increase score
function collectToken(astronaut, token) {
    token.destroy();  // Remove the token from the screen
    score += 1;  // Increase score by 1
    scoreText.setText('Score: ' + score);  // Update score text
}

// Handle collisions between the astronaut and asteroids
function handleCollision() {
    gameOver = true;
    this.physics.pause();  // Stop the game physics

    // Update high score if current score is higher
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);  // Store new high score in localStorage
    }

    astronaut.setTint(0xff0000);  // Turn astronaut red to indicate hit
    showGameOverScreen(this);  // Show the game-over screen
}

// Show the Game Over screen and display high score
function showGameOverScreen(scene) {
    const gameOverText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2, 'Game Over', { font: '32px Arial', fill: '#ff0000' });
    gameOverText.setOrigin(0.5);

    // Display current high score
    const highScoreText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2 + 50, `High Score: ${highScore}`, { font: '24px Arial', fill: '#ffffff' });
    highScoreText.setOrigin(0.5);

    // Add reset button
    const resetButton = scene.add.text(scene.scale.width / 2, scene.scale.height / 2 + 100, 'Reset', { font: '24px Arial', fill: '#ffffff' });
    resetButton.setOrigin(0.5);
    resetButton.setInteractive().on('pointerdown', () => resetGame(scene));
}

// Reset the game
function resetGame(scene) {
    gameOver = false;
    score = 0;
    scoreText.setText('Score: 0');
    astronaut.clearTint();  // Remove the red tint
    enemies.clear(true, true);  // Clear all existing enemies
    tokens.clear(true, true);  // Clear all existing tokens
    scene.scene.restart();  // Restart the scene
}

// Mobile interaction: drag to move astronaut left or right
function moveAstronaut(event) {
    if (gameStarted && !gameOver) {
        astronaut.x = Phaser.Math.Clamp(event.center.x, 50, config.scale.width - 50);
    }
}

// Game update loop
function update() {
    if (gameStarted && !gameOver) {
        // Desktop movement controls
        if (cursors.left.isDown || this.input.keyboard.keys[65].isDown) {
            astronaut.setVelocityX(-200);  // Move left
        } else if (cursors.right.isDown || this.input.keyboard.keys[68].isDown) {
            astronaut.setVelocityX(200);  // Move right
        } else {
            astronaut.setVelocityX(0);  // Stop moving when no keys are pressed
        }
    }
}
