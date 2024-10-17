let astronaut;
let isDragging = false;  // To track if the user is holding the screen
let cursors;  // To handle keyboard inputs

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
    this.load.image('astronaut', 'assets/astronaut.png');  // Preload the astronaut image
    this.load.image('background', 'assets/background.png');  // Preload the background image
}

// Create game objects and input handlers
function create() {
    // Add background image and ensure it covers the entire screen responsively
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    background.displayWidth = this.scale.width;  // Fit background to the screen width
    background.displayHeight = this.scale.height;  // Fit background to the screen height

    // Set different scale factors for mobile and desktop
    let astronautScaleFactor;
    if (this.scale.width < 600) {
        // Mobile screen (width less than 600px) - Reduce size by 1.3x
        astronautScaleFactor = 0.75;  // 1.3x smaller for mobile
    } else {
        // Desktop screen (width 600px or more) - Keep the current desktop size
        astronautScaleFactor = 0.25;  // Keep the current 4x smaller size for desktop
    }

    // Add astronaut sprite at the bottom of the screen and scale it accordingly
    astronaut = this.add.sprite(this.scale.width / 2, this.scale.height - 100, 'astronaut').setInteractive();
    astronaut.setScale(astronautScaleFactor);  // Apply the dynamic scale based on screen size

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

    // Initialize keyboard input for arrow keys and "A" and "D" keys
    cursors = this.input.keyboard.createCursorKeys();  // Arrow keys
    this.input.keyboard.addKeys({ 'A': Phaser.Input.Keyboard.KeyCodes.A, 'D': Phaser.Input.Keyboard.KeyCodes.D });
}

// Track when the user is pressing down (touch/mouse)
function startDragging(pointer) {
    isDragging = true;
}

// Move the astronaut as the user drags their finger (touch/mouse)
function moveAstronaut(pointer) {
    if (isDragging) {
        // Move the astronaut based on the pointer's X position
        astronaut.x = Phaser.Math.Clamp(pointer.x, 50, config.scale.width - 50);  // Clamp to keep astronaut on the screen
    }
}

// Stop dragging when the user lifts their finger (touch/mouse)
function stopDragging() {
    isDragging = false;
}

// Update loop: handles keyboard inputs for desktop
function update() {
    // Move left with left arrow or "A"
    if (cursors.left.isDown || this.input.keyboard.keys[65].isDown) {  // 65 is the keycode for "A"
        astronaut.x = Phaser.Math.Clamp(astronaut.x - 5, 50, config.scale.width - 50);  // Move left, clamped to screen bounds
    }
    
    // Move right with right arrow or "D"
    if (cursors.right.isDown || this.input.keyboard.keys[68].isDown) {  // 68 is the keycode for "D"
        astronaut.x = Phaser.Math.Clamp(astronaut.x + 5, 50, config.scale.width - 50);  // Move right, clamped to screen bounds
    }
}
