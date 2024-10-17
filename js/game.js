let astronaut;
let cursors;
let enemies;
let score = 0;
let gameOver = false;
let scoreText;
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
            gravity: { y: 50 },  // Apply low gravity for floating effect
            debug: false  // Set true if you want to see the physics bounds for debugging
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
    this.load.image('enemy', 'assets/enemy.png');  // Preload enemy image
}

// Create game objects and input handlers
function create() {
    // Add background image
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    background.displayWidth = this.scale.width;
    background.displayHeight = this.scale.height;

    // Set scale factors for mobile and desktop
    let astronautScaleFactor = this.scale.width < 600 ? 0.16 : 0.25;

    // Add astronaut with physics and allow it to bounce
    astronaut = this.physics.add.sprite(this.scale.width / 2, this.scale.height - 100, 'astronaut').setInteractive();
    astronaut.setScale(astronautScaleFactor);
    astronaut.setBounce(0.3);  // Slight bounce effect
    astronaut.setCollideWorldBounds(true);  // Keeps astronaut within bounds
    astronaut.setDragX(600);  // Horizontal drag to make movement smoother
    astronaut.body.allowGravity = true;  // Gravity will affect only the vertical axis

    // Create enemies group
    enemies = this.physics.add.group();

    // Initialize score text
    scoreText = this.add.text(10, 10, 'Score: 0', { font: '16px Arial', fill: '#ffffff' });

    // Initialize keyboard input
    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addKeys({ 'A': Phaser.Input.Keyboard.KeyCodes.A, 'D': Phaser.Input.Keyboard.KeyCodes.D });

    // Add collision detection
    this.physics.add.overlap(astronaut, enemies, handleCollision, null, this);

    // Create the Start Game button at the top of the screen
    startButton = this.add.text(this.scale.width / 2, 50, 'Start Game', { font: '32px Arial', fill: '#00ff00' });
    startButton.setOrigin(0.5);
    startButton.setInteractive().on('pointerdown', startGame, this);
}

// Start the game
function startGame() {
    startButton.destroy();  // Remove the Start Game button
    gameStarted = true;

    // Start generating enemies
    this.time.addEvent({
        delay: 1500,
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });
}

// Spawn an enemy at a random position at the top
function spawnEnemy() {
    if (!gameOver && gameStarted) {
        let enemyX = Phaser.Math.Between(50, config.scale.width - 50);
        let enemy = enemies.create(enemyX, 0, 'enemy');
        enemy.setVelocityY(100 + score * 5);  // Increase speed as score increases
        enemy.setScale(0.2);  // Adjust enemy size
    }
}

// Handle collisions between the astronaut and enemies
function handleCollision() {
    gameOver = true;
    this.physics.pause();  // Stop the game physics
    astronaut.setTint(0xff0000);  // Turn astronaut red to indicate hit
    showGameOverScreen(this);  // Show the game-over screen
}

// Display the game-over screen with a reset button
function showGameOverScreen(scene) {
    const gameOverText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2, 'Game Over', { font: '32px Arial', fill: '#ff0000' });
    gameOverText.setOrigin(0.5);
    
    const resetButton = scene.add.text(scene.scale.width / 2, scene.scale.height / 2 + 50, 'Reset', { font: '24px Arial', fill: '#ffffff' });
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
    scene.scene.restart();  // Restart the scene
}

// Game update loop
function update() {
    if (gameStarted && !gameOver) {
        // Apply left and right movement
        if (cursors.left.isDown || this.input.keyboard.keys[65].isDown) {
            astronaut.setVelocityX(-200);  // Move left
        } else if (cursors.right.isDown || this.input.keyboard.keys[68].isDown) {
            astronaut.setVelocityX(200);  // Move right
        } else {
            astronaut.setVelocityX(0);  // Stop moving horizontally when no keys are pressed
        }

        // Update score as long as the game is running
        score += 1;
        scoreText.setText('Score: ' + score);
    }
}
