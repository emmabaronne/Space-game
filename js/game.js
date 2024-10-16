let astronaut;
let isDragging = false;  // To track if the user is holding the screen

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,  // Scales the game to fit the screen
        autoCenter: Phaser.Scale.CENTER_BOTH,  // Centers the game on the screen
        width: window.innerWidth,  // Uses the full screen width
        height: window.innerHeight  // Uses the full screen height
    },
    backgroundColor: '#000000',  // Background color (black for space)
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
}

// Create game objects
function create() {
    // Add astronaut sprite at the bottom of the screen
    astronaut = this.add.sprite(this.scale.width / 2, this.scale.height - 100, 'astronaut').setInteractive();

    // Add event listeners for pointer (touch/mouse) interactions
    this.input.on('pointerdown', startDragging);
    this.input.on('pointermove', moveAstronaut);
    this.input.on('pointerup', stopDragging);

    // Full-screen button
    const fullscreenButton = this.add.text(10, 10, 'Full Screen', { font: '16px Arial', fill: '#ffffff' })
        .setInteractive()
        .on('pointerdown', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        });
}

// Track when the user is pressing down
function startDragging(pointer) {
    isDragging = true;
}

// Move the astronaut as the user drags their finger (or moves the mouse)
function moveAstronaut(pointer) {
    if (isDragging) {
        // Move the astronaut based on the pointer's X position
        astronaut.x = Phaser.Math.Clamp(pointer.x, 50, config.scale.width - 50);  // Clamp to keep astronaut on the screen
    }
}

// Stop dragging when the user lifts their finger (or stops clicking)
function stopDragging() {
    isDragging = false;
}

// Update function (not used right now)
function update() {
    // No update logic needed for continuous movement
}
