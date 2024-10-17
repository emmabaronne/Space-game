let astronaut;
let cursors;
let enemies;
let score = 0;
let gameOver = false;
let scoreText;

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

    // Add astronaut
    astronaut = this.add.sprite(this.scale.width / 2, this.scale.height - 100, 'astronaut').setInteractive();
    astronaut.setScale(astronautScaleFactor);

    // Create enemies group
    enemies = this.physics.add.group();

    // Generate enemies every 1.5 seconds (frequency can increase with score)
    this.time.addEvent({
        delay: 1500,
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });

    // Initialize score text
    scoreText = this.add.text(10, 10, 'Score: 0', { font: '16px Arial', fill: '#ffffff' });

    // Initialize keyboard input
    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addKeys({ 'A': Phaser.Input.Keyboard.KeyCodes.A, 'D': Phaser.Input.Keyboard.KeyCodes.D });

    // Add collision detection
    this.physics.add.overlap(astronaut, enemies, handleCollision, null, this);
}

// Spawn an enemy at a random position at the top
function spawnEnemy() {
    if (!gameOver) {
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
    scene.physics.resume();  // Resume the game physics
    score = 0;
    scoreText.setText('Score: 0');
    astronaut.clearTint();  // Remove the red tint
    enemies.clear(true, true);  // Clear all existing enemies
    scene.scene.restart();  // Restart the scene
}

// Game update loop
function update() {
    // Move astronaut left and right
    if (cursors.left.isDown || this.input.keyboard.keys[65].isDown) {
        astronaut.x = Phaser.Math.Clamp(astronaut.x - 5, 50, config.scale.width - 50);
    } else if (cursors.right.isDown || this.input.keyboard.keys[68].isDown) {
        astronaut.x = Phaser.Math.Clamp(astronaut.x + 5, 50, config.scale.width - 50);
    }

    // Update score as long as the game is running
    if (!gameOver) {
        score += 1;
        scoreText.setText('Score: ' + score);
    }

    // Increase difficulty over time (reduce delay or increase speed)
    if (score % 500 === 0) {
        enemies.children.iterate(function (enemy) {
            enemy.setVelocityY(enemy.body.velocity.y + 10);  // Increase enemy speed
        });
    }
}
