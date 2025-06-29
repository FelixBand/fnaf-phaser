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

function preload() {
  this.load.image('myImage', 'image.png');
}

function create() {
  // Center image on the 720p canvas
  this.add.image(1280 / 2, 720 / 2, 'myImage').setOrigin(0.5);
}
