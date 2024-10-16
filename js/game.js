// This is the basic configuration for the game
const config = {
    type: Phaser.AUTO,  // Phaser will decide the best rendering method (WebGL or Canvas)
    scale: {
        mode: Phaser.Scale.FIT,  // Scales the game to fit the screen
        autoCenter: Phaser.Scale.CENTER_BOTH,  // Centers the game on the screen
        width: window.innerWidth,  // Uses the width of the user's screen
        height: window.innerHeight  // Uses the height of the user's screen
    },
    backgroundColor: '#000000',  // Background color (black for space)
    parent: 'game-container',  // The HTML element where the game will be rendered
    scene: {            // The 3 main phases: preload, create, and update
        preload: preload,
        create: create,
        update: update
    }
};

// Create the Phaser game instance
const game = new Phaser.Game(config);

// Preload assets
function preload() {
    // Example for loading images. Replace 'astronaut.png', 'asteroid.png', and 'product.png' with your actual file names.
    this.load.image('astronaut', 'assets/astronaut.png');
    this.load.image('asteroid', 'assets/asteroid.png');
    this.load.image('product', 'assets/product.png');
}

// Create game objects
function create() {
    this.astronaut = this.add.sprite(this.scale.width / 2, this.scale.height - 100, 'astronaut');  // Adjust astronaut position for different screen sizes
// Full-screen button
const fullscreenButton = this.add.text(10, 10, 'Full Screen', { font: '16px Arial', fill: '#ffffff' })
    .setInteractive()  // Makes the text clickable
    .on('pointerdown', () => {  // On click, toggle fullscreen mode
        if (this.scale.isFullscreen) {
            this.scale.stopFullscreen();  // Exit fullscreen if already in fullscreen mode
        } else {
            this.scale.startFullscreen();  // Enter fullscreen mode
        }
    });

    const hammer = new Hammer(document.body);  // Detect gestures on the whole body
    hammer.get('swipe').set({ 
        direction: Hammer.DIRECTION_HORIZONTAL, 
        threshold: 10,  // Lower the threshold for better mobile sensitivity
        velocity: 0.3   // Adjust swipe velocity for mobile responsiveness
    });

    // Move astronaut left on swipe left
    hammer.on('swipeleft', () => {
        if (this.astronaut.x > 50) {
            this.astronaut.x -= 50;
        }
    });

    // Move astronaut right on swipe right
    hammer.on('swiperight', () => {
        if (this.astronaut.x < this.scale.width - 50) {
            this.astronaut.x += 50;
        }
    });
}

// Game update loop (runs every frame)
function update() {
    // We'll add asteroid movement and collision detection here later
}
