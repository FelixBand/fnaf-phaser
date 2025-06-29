const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: '#222222',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

let staticSprite; // Global variable to hold the sprite instance

function preload() {
  // Load a static image (not used right now, but leaving it in for reference)
  this.load.image('myImage', 'image.png');

  // Load the animated spritesheet for the static effect
  // The spritesheet is assumed to be 1280x720 pixels per frame
  this.load.spritesheet('static', 
    'assets/static/static.png',
    { frameWidth: 1280, frameHeight: 720 }
  );
}

function create() {
  // Create an animation using the loaded spritesheet
  this.anims.create({
    key: 'idle', // The name (key) of the animation we’ll reference later
    frames: this.anims.generateFrameNumbers('static', { start: 0, end: 7 }), 
    // This generates an array of frame objects using frames 0 to 7 from the spritesheet
    frameRate: 24, // 24 frames per second
    repeat: -1 // -1 means it will loop forever
  });

  // Add a sprite to the scene at position (640, 360) — the center of a 1280x720 canvas
  staticSprite = this.add.sprite(1280 / 2, 720 / 2, 'static');

  // Play the 'idle' animation on the sprite we just created
  staticSprite.anims.play('idle', true);
}

function update() {
}