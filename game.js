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

let mainMenuActive = true;
let staticAlphaTimer = 0;
let staticSprite;
let freddyMenuSprite;
let warningSprite;

function preload() { // preload assets presumably to prevent lag when adding them
  // textures
  this.load.image('warning', 'assets/warning.png');

  this.load.spritesheet('static', 
    'assets/static/static.png',
    { frameWidth: 1280, frameHeight: 720 } // every frame is 720p
  );

  this.load.spritesheet('freddyMenu', 
    'assets/menuFreddyBrighter.png',
    { frameWidth: 1280, frameHeight: 720 } // every frame is 720p
  );

  // audio
  this.load.audio('staticbuzz', 'assets/static2.wav');
  this.load.audio('mainTheme', 'assets/Main Menu Theme.wav');
}

function create() {
  // Create an animation using the loaded spritesheet
  this.anims.create({
    key: 'idle', // The name (key) of the animation we’ll reference later
    frames: this.anims.generateFrameNumbers('static', { start: 0, end: 7 }), // use frame 0-7
    frameRate: 60,
    repeat: -1 // -1 = loop
  });

  this.anims.create({
    key: 'idle1', // The name (key) of the animation we’ll reference later
    frames: [
      { key: 'freddyMenu', frame: 0 },
      { key: 'freddyMenu', frame: 1 },
      { key: 'freddyMenu', frame: 0 }
    ],
    frameRate: 24,
    repeat: 0
  });
  this.anims.create({
    key: 'idle2', // The name (key) of the animation we’ll reference later
    frames: [
      { key: 'freddyMenu', frame: 0 },
      { key: 'freddyMenu', frame: 2 },
      { key: 'freddyMenu', frame: 0 }
    ],
    frameRate: 24,
    repeat: 0
  });
  this.anims.create({
    key: 'idle3', // The name (key) of the animation we’ll reference later
    frames: [
      { key: 'freddyMenu', frame: 0 },
      { key: 'freddyMenu', frame: 3 },
      { key: 'freddyMenu', frame: 0 }
    ],
    frameRate: 24,
    repeat: 0
  });

  warningSprite = this.add.image(centerX, centerY, 'warning');
  warningSprite.setScale(0.5);
  warningSprite.alpha = 0;

  warningFade.call(this); // fade in & out the initial content warning
}

function update(time, delta) { // delta = time since last frame in ms
  // if (this.input.activePointer.isDown) {
  //   staticSprite.alpha = 0.5;
  // } else {
  //   staticSprite.alpha = 1;
  // }
}

function staticFlicker(scene) {
  staticSprite.alpha = getRandom(0.5, 0.7, 2);

  flickerTimer = scene.time.addEvent({ delay: 100, loop: true, callback: () => {
    if (!mainMenuActive) {
      flickerTimer.remove();
      return;
    }
    staticSprite.alpha = getRandom(0.5, 0.7, 2);
  },
  });
}

function freddyTwitch(scene) {
  twitchTimer = scene.time.addEvent({ delay: 100, loop: true, callback: () => {
    if (!mainMenuActive) {
      twitchTimer.remove();
      return;
    }
    if (getRandom(1,8,0) == 1) {
      freddyMenuSprite.anims.play('idle' + getRandom(1,3,0), true);
    }
},});
}

function freddyAlpha(scene) {
  freddyAlphaTimer = scene.time.addEvent({ delay: 250, loop: true, callback: () => {
    if (!mainMenuActive) {
      freddyAlphaTimer.remove();
      return;
    }
    freddyMenuSprite.alpha = getRandom(0,2,1); // random number between 0 and 2.0 making visibilty more likely
},});
}

async function menuItemsAction() { // just testing
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
            loadMainMenu(this); // Load actual main menu when fade completed
          }
        });
      });
    }
  });
}

function loadMainMenu(scene) { // load menu after content warning
  scene.sound.play('staticbuzz');
  scene.loopingSound = scene.sound.add('mainTheme', { loop: true });
  scene.loopingSound.play();

  freddyMenuSprite = scene.add.sprite(centerX, centerY, 'freddyMenu');
  freddyMenuSprite.anims.play('idle2', true);

  staticSprite = scene.add.sprite(centerX, centerY, 'static');
  staticSprite.anims.play('idle', true);

  staticFlicker(scene);
  freddyTwitch(scene);
  freddyAlpha(scene);
  menuItemsAction();
}

function getRandom(min, max, decimals = 0) {
  const randomValue = Math.random() * (max - min) + min;
  return Number(randomValue.toFixed(decimals));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}