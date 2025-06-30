const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  pixelArt: true, // Prevent anti-aliasing causing blurry text
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let centerX = config.width / 2;
let centerY = config.height / 2;

let staticAlphaTimer = 0;
let staticSprite;
let warningSprite;

function preload() {
  this.load.image('warning', 'assets/warning.png');

  this.load.spritesheet('static', 
    'assets/static/static.png',
    { frameWidth: 1280, frameHeight: 720 } // every frame is 720p
  );

  this.load.audio('staticbuzz', 'assets/static2.wav');
  this.load.audio('mainTheme', 'assets/Main Menu Theme.wav');
}

function create() {
  // Create an animation using the loaded spritesheet
  this.anims.create({
    key: 'idle', // The name (key) of the animation we’ll reference later
    frames: this.anims.generateFrameNumbers('static', { start: 0, end: 7 }), // use frame 0-7
    frameRate: 45,
    repeat: -1 // -1 = loop
  });

  warningSprite = this.add.image(centerX, centerY, 'warning');
  warningSprite.setScale(0.5);
  warningSprite.alpha = 0;

  staticSprite = this.add.sprite(centerX, centerY, 'static');
  staticSprite.anims.play('idle', true);
  staticSprite.alpha = 0;

  warningFade.call(this);
}

function update(time, delta) { // delta = time since last frame in ms
  // if (this.input.activePointer.isDown) {
  //   staticSprite.alpha = 0.5;
  // } else {
  //   staticSprite.alpha = 1;
  // }

  // 'time' is the current game time in ms, 'delta' is time since last frame in ms

  // Only do this if the staticSprite is visible (Main menu is loaded)
  if (staticSprite && staticSprite.alpha > 0) {
    staticAlphaTimer += delta;

    if (staticAlphaTimer >= 100) {  // 100 ms = 0.1 sec
      const newAlpha = getRandom(0.5, 0.7, 2);  // 2 decimals for precision
      staticSprite.alpha = newAlpha;

      staticAlphaTimer = 0;  // reset timer
    }
  }
}

async function menuItemsAction() {
  await sleep(1000);  // wait 1 second
  console.log('Action after 1 second');
}

function warningFade() {
  // Fade in
  this.tweens.add({
    targets: warningSprite,
    alpha: 1,
    duration: 2000,
    ease: 'Linear',
    onComplete: () => {
      // Wait 2 seconds, then fade out
      this.time.delayedCall(2000, () => {
        this.tweens.add({
          targets: warningSprite,
          alpha: 0,
          duration: 2000,
          ease: 'Linear',
          onComplete: () => {
            warningSprite.alpha = 0;
            loadMainMenu(this);
          }
        });
      });
    }
  });
}

function loadMainMenu(scene) {
  staticSprite.alpha = 1;

  scene.sound.play('staticbuzz');
  scene.loopingSound = scene.sound.add('mainTheme', { loop: true });
  scene.loopingSound.play();

  menuItemsAction()
}

function getRandom(min, max, decimals = 0) {
  const randomValue = Math.random() * (max - min) + min;
  return Number(randomValue.toFixed(decimals));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}