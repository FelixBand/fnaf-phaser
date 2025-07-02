const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  pixelArt: true, // Prevent anti-aliasing causing blurry text
  backgroundColor: '#000000',
  autoFocus: true,
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

let debugMode = true;

let enableContentWarning = true;
let mainMenuActive = true;
let staticAlphaTimer = 0;
let staticSprite;
let freddyMenuSprite;
let warningSprite;

function preload() { // preload assets presumably to prevent lag when adding them
  // textures
  this.load.image('warning', 'assets/textures/warning.png');

  this.load.spritesheet('static', 
    'assets/textures/static/static.png',
    { frameWidth: 1280, frameHeight: 720 } // every frame is 720p
  );

  this.load.spritesheet('freddyMenu', 
    'assets/textures/menuFreddyBrightened.png',
    { frameWidth: 1280, frameHeight: 720 } // every frame is 720p
  );

  // audio
  this.load.audio('staticbuzz', 'assets/audio/static2.wav');
  this.load.audio('mainTheme', 'assets/audio/Main Menu Theme.wav');
}

function create() {
  if (debugMode == true) {
    enableContentWarning = false;
  }

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

function update(time, delta) {
  // time = time in ms that project has been alive for
  // delta = time since last frame in ms

  // if (this.input.activePointer.isDown) {
  //   staticSprite.alpha = 0.5;
  // } else {
  //   staticSprite.alpha = 1;
  // }
}

async function menuItemsAction() { // just testing
  await sleep(1000);  // wait 1 second
  console.log('Action after 1 second');
}

function warningFade() {
  if (enableContentWarning) {
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
  } else {
    loadMainMenu(this);
  }
}

function loadMainMenu(scene) { // load menu after content warning
  scene.sound.play('staticbuzz');
  scene.loopingSound = scene.sound.add('mainTheme', { loop: true });
  scene.loopingSound.play();

  freddyMenuSprite = scene.add.sprite(centerX, centerY, 'freddyMenu');
  freddyMenuSprite.anims.play('idle2', true);

  staticSprite = scene.add.sprite(centerX, centerY, 'static');
  staticSprite.anims.play('idle', true);

  staticSprite.alpha = getRandom(0.5, 0.7, 2);

  // make animated static flicker by randomizing its alpha every 100ms
  staticFlickerTimer = scene.time.addEvent({ delay: 100, loop: true, callback: () => {
    if (!mainMenuActive) {
      staticFlickerTimer.remove();
      return;
    }
    staticSprite.alpha = getRandom(0.5, 0.8, 2);
  },});

  // make Freddy's sprite animate randomly
  twitchTimer = scene.time.addEvent({ delay: 100, loop: true, callback: () => {
    if (!mainMenuActive) {
      twitchTimer.remove();
      return;
    }
    if (getRandom(1,8,0) == 1) {
      freddyMenuSprite.anims.play('idle' + getRandom(1,3,0), true);
    }
  },});

  // make Freddy's sprite flicker randomly
  freddyAlphaTimer = scene.time.addEvent({ delay: 250, loop: true, callback: () => {
    if (!mainMenuActive) {
      freddyAlphaTimer.remove();
      return;
    }
    freddyMenuSprite.alpha = getRandom(0,2,1); // random number between 0 and 2.0 making visibilty more likely
  },});

  menuItemsAction();
}

function getRandom(min, max, decimals = 0) {
  const randomValue = Math.random() * (max - min) + min;
  return Number(randomValue.toFixed(decimals));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}