const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  pixelArt: true, // Prevent anti-aliasing causing blurry text
  backgroundColor: '#000000',
  fps: {
    target: 0, // 0 means no limit, Phaser will run at monitor's refresh rate
  },
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

let night;

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

  this.load.image('pointerArrows', 'assets/textures/arrows.png');

  this.load.image('fnaf', 'assets/textures/fnaf.png');
  this.load.image('newgame', 'assets/textures/new game.png');
  this.load.image('continue', 'assets/textures/continue.png');
  this.load.image('night6', 'assets/textures/6th night.png');
  this.load.image('customnight', 'assets/textures/custom night.png');

  this.load.image('version', 'assets/textures/version.png');
  this.load.image('copyright', 'assets/textures/copyright.png');

  this.load.image('newspaper', 'assets/textures/newspaper.png');

  // audio
  this.load.audio('blip', 'assets/audio/blip3.wav');
  this.load.audio('staticbuzz', 'assets/audio/static2.wav');
  this.load.audio('mainTheme', 'assets/audio/Main Menu Theme.wav');
}

function create() {
  if (debugMode == true) {
    enableContentWarning = false;
  }

  const savedNight = localStorage.getItem('night');
  if (savedNight !== null) {
    night = Number(savedNight); // convert back to number if needed
  } else {
    night = 1; // or whatever your default starting value is
    saveNight(night); // save the default night to localStorage
  }

  console.log("Night loaded from localStorage:", night);

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
              //warningSprite.destroy();
              loadMainMenu(this); // Load actual main menu when fade completed
            }
          });
        });
      }
    });
  } else {
    warningSprite.alpha = 0;
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

  version = scene.add.image(20, config.height - 30, 'version');
  version.setScale(0.5);
  version.setOrigin(0, 0);

  copyright = scene.add.image(config.width - 240, config.height - 30, 'copyright');
  copyright.setOrigin(0, 0);

  menuItemNames = ["newgame", "continue", "night6", "customnight"];
  menuItems = [];
  menuItemsPos = [175, 370];

  fnaf = scene.add.image(menuItemsPos[0], menuItemsPos[1] - 280, 'fnaf');
  fnaf.setOrigin(0, 0);

  for (let i = 0; i < menuItemNames.length; i++) {
    const itemName = menuItemNames[i];
    const sprite = scene.add.sprite(menuItemsPos[0], menuItemsPos[1] + (i * 75), itemName);
    sprite.setOrigin(0, 0);
    sprite.setInteractive();
    sprite.on('pointerdown', () => {
      if (itemName === "newgame") {
        newgame(scene);
      } else if (itemName === "continue") {
        console.log("Continue clicked");
        // Add logic to continue the game
      } else if (itemName === "night6") {
        console.log("6th Night clicked");
        // Add logic for 6th night
      } else if (itemName === "customnight") {
        console.log("Custom Night clicked");
        // Add logic for custom night
      }
    });
    sprite.on('pointerover', () => {
      if (!mainMenuActive) return; // do nothing if main menu is not active
      blipSound = scene.sound.add('blip');
      // It needs to play a sound when hovering over menu items, unless hovering over an item that is already selected
      if (pointerArrows.y != sprite.y + 17) {
        blipSound.play();
      }
      pointerArrows.y = sprite.y + 17;
    });

    menuItems.push(sprite);
  }

  pointerArrows = scene.add.image(menuItemsPos[0] - 40, 1000, 'pointerArrows');
  
  // make animated static flicker by randomizing its alpha every 100ms
  staticSprite.alpha = getRandom(0.5, 0.7, 2);
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

function newgame(scene) {
  console.log("New Game clicked");
  mainMenuActive = false; // deactivate main menu
  scene.sound.stopByKey('staticbuzz');
  night = 1; // reset night to 1
  newspaper = scene.add.image(centerX, centerY, 'newspaper');
  newspaper.alpha = 0;
  scene.tweens.add({
    targets: newspaper,
    alpha: 1,
    duration: 2000,
    ease: 'Linear',
    onComplete: () => {
      destroyMenu(scene);
      scene.time.delayedCall(6000, () => {
        scene.tweens.add({
          targets: newspaper,
          alpha: 0,
          duration: 2000,
          ease: 'Linear',
          onComplete: () => {
            newspaper.alpha = 0;
          }
        });
      });
    }
  });
}

function destroyMenu(scene) {
  console.log(menuItems + menuItemNames);
  menuItems.forEach(sprite => {
    if (sprite && sprite.destroy) {
      sprite.destroy();
    }
  });
  menuItems = [];

  // Also destroy other sprites and sounds you want to remove, e.g.:
  freddyMenuSprite.destroy();
  staticSprite.destroy();
  version.destroy();
  copyright.destroy();
  fnaf.destroy();
  pointerArrows.destroy();

  scene.sound.stopByKey('staticbuzz');

  // Remove timers if needed
  if (staticFlickerTimer) staticFlickerTimer.remove();
  if (twitchTimer) twitchTimer.remove();
  if (freddyAlphaTimer) freddyAlphaTimer.remove();
}

function saveNight(value) {
  night = value;
  localStorage.setItem('night', night);
}

function getRandom(min, max, decimals = 0) {
  const randomValue = Math.random() * (max - min) + min;
  return Number(randomValue.toFixed(decimals));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}