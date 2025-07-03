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
let night;
let office;
let inGame = false; // flag to check if we are in the game or not

function preload() { // preload assets presumably to prevent lag when adding them
  // textures
  this.load.image('warning', 'assets/textures/warning.png');

  this.load.spritesheet('static', 
    'assets/textures/static/static.png',
    { frameWidth: 1280, frameHeight: 720 } // every frame is 720p
  );

  this.load.spritesheet('glitching', 
    'assets/textures/glitch/menuGlitching.png',
    { frameWidth: 1280, frameHeight: 720 } // every frame is 720p
  );

  this.load.spritesheet('transitionglitching', 
    'assets/textures/glitch/transitionGlitching.png',
    { frameWidth: 1280, frameHeight: 720 } // every frame is 720p
  );

  this.load.spritesheet('freddyMenu', 
    'assets/textures/menuFreddyBrightened.png',
    { frameWidth: 1280, frameHeight: 720 } // every frame is 720p
  );

  this.load.image('scanline', 'assets/textures/glitch/scanline.png');
  this.load.image('pointerArrows', 'assets/textures/arrows.png');

  this.load.image('fnaf', 'assets/textures/fnaf.png');
  this.load.image('newgame', 'assets/textures/new game.png');
  this.load.image('continue', 'assets/textures/continue.png');
  this.load.image('night6', 'assets/textures/6th night.png');
  this.load.image('customnight', 'assets/textures/custom night.png');

  this.load.image('version', 'assets/textures/version.png');
  this.load.image('copyright', 'assets/textures/copyright.png');

  this.load.image('newspaper', 'assets/textures/newspaper.png');

  // now we load night1 through night7 .png textures with a for loop
  for (let i = 1; i <= 7; i++) {
    this.load.image('night' + i, 'assets/textures/loadscreen/night' + i + '.png');
  }

  this.load.image('clock', 'assets/textures/loadscreen/clock.png');

  // audio
  this.load.audio('blip', 'assets/audio/blip3.wav');
  this.load.audio('staticbuzz', 'assets/audio/static2.wav');
  this.load.audio('mainTheme', 'assets/audio/Main Menu Theme.wav');

  // shaders
  //this.load.glsl('warpShader', 'assets/shaders/warp.frag');
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
    key: 'buzz', // The name (key) of the animation we’ll reference later
    frames: this.anims.generateFrameNumbers('static', { start: 0, end: 7 }), // use frame 0-7
    frameRate: 60,
    repeat: -1 // -1 = loop
  });

  this.anims.create({
    key: 'menuglitch',
    frames: this.anims.generateFrameNumbers('glitching', { start: 0, end: 7 }), // use frame 0-7
    frameRate: 4,
    repeat: -1 // -1 = loop
  });

  this.anims.create({
    key: 'transitionglitch1',
    frames: this.anims.generateFrameNumbers('transitionglitching', { start: 0, end: 5 }),
    frameRate: 24,
    repeat: 0
  });

  this.anims.create({
    key: 'transitionglitch2',
    frames: [
      { key: 'transitionglitching', frame: 6 },
      { key: 'transitionglitching', frame: 1 },
      { key: 'transitionglitching', frame: 3 },
      { key: 'transitionglitching', frame: 2 },
      { key: 'transitionglitching', frame: 4 },
      { key: 'transitionglitching', frame: 7 }
    ],
    frameRate: 24,
    repeat: 0
  });

  this.anims.create({
    key: 'twitch1',
    frames: [
      { key: 'freddyMenu', frame: 0 },
      { key: 'freddyMenu', frame: 1 },
      { key: 'freddyMenu', frame: 0 }
    ],
    frameRate: 18,
    repeat: 0
  });
  this.anims.create({
    key: 'twitch2',
    frames: [
      { key: 'freddyMenu', frame: 0 },
      { key: 'freddyMenu', frame: 2 },
      { key: 'freddyMenu', frame: 0 }
    ],
    frameRate: 18,
    repeat: 0
  });
  this.anims.create({
    key: 'twitch3',
    frames: [
      { key: 'freddyMenu', frame: 0 },
      { key: 'freddyMenu', frame: 3 },
      { key: 'freddyMenu', frame: 0 }
    ],
    frameRate: 18,
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

  scene = this; // make scene available in functions
  scanline.y = (time / 30 % (config.height + scanline.height) - scanline.height); // move scanline down by 0.5 pixels every frame, wrapping around at the bottom

  //console.log(Math.sin(time / 1000) * 1000);
  if (inGame) {
    //console.log("In game, moving office background");
    office.x = Math.sin(time / 1000) * 1000; // make the office background move slightly left and right
  }
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
              warningSprite.destroy();
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

  blipSound = scene.sound.add('blip');

  freddyMenuSprite = scene.add.sprite(centerX, centerY, 'freddyMenu');

  staticSprite = scene.add.sprite(centerX, centerY, 'static');
  staticSprite.anims.play('buzz', true);

  glitching = scene.add.sprite(centerX, centerY, 'glitching');
  glitching.anims.play('menuglitch', true);
  glitching.alpha = 0;

  scanline = scene.add.image(centerX, getRandom(0,720,0), 'scanline');
  scanline.setOrigin(0.5, 0);
  scanline.alpha = 0.35;

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
        continuegame(scene);
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
    if (getRandom(1,10,0) == 1) {
      freddyMenuSprite.anims.play('twitch' + getRandom(1,3,0), true);
    }
  },});

  // make Freddy's sprite flicker randomly
  freddyAlphaTimer = scene.time.addEvent({ delay: 250, loop: true, callback: () => {
    if (!mainMenuActive) {
      freddyAlphaTimer.remove();
      return;
    }
    freddyMenuSprite.alpha = getRandom(0,2,1); // random number between 0 and 2.0 making visibilty more likely
    if (getRandom(1,3,0) == 1) {
      glitching.alpha = getRandom(0.3,0.5,1);
    }
    if (getRandom(1,3,0) == 1) {
      glitching.alpha = 0;
    }
  },});

  menuItemsAction();
}

function continuegame(scene) {
  console.log("Continue clicked");
  mainMenuActive = false; // deactivate main menu
  scene.sound.stopByKey('staticbuzz');
  scene.loopingSound.stop(); // stop the main menu theme
  destroyMenu(scene);
  loadGame(scene);
}

function newgame(scene) {
  console.log("New Game clicked");
  mainMenuActive = false; // deactivate main menu
  scene.sound.stopByKey('staticbuzz');
  night = 1; // reset night to 1
  saveNight(night);
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
            newspaper.destroy();
            loadGame(scene); // start the game after the newspaper fades out
          }
        });
      });
    }
  });
}

function destroyMenu(scene) {
  menuItems.forEach(sprite => {
    if (sprite && sprite.destroy) {
      sprite.destroy();
    }
  });
  menuItems = [];

  // Also destroy other sprites and sounds you want to remove, e.g.:
  freddyMenuSprite.destroy();
  staticSprite.destroy();
  glitching.destroy();
  scanline.destroy();
  version.destroy();
  copyright.destroy();
  fnaf.destroy();
  pointerArrows.destroy();

  scene.sound.stopByKey('staticbuzz');

  // Remove timers if needed
  staticFlickerTimer.remove();
  twitchTimer.remove();
  freddyAlphaTimer.remove();
}

function loadGame(scene) {
  console.log("Starting game at night:", night);

  scene.loopingSound.stop(); // stop the main menu theme

  blipSound.play();

  nightsplash = scene.add.image(centerX, centerY, 'night' + night);

  transglitching = scene.add.sprite(centerX, centerY, 'transitionglitching');
  transglitching.anims.play('transitionglitch' + getRandom(1,2,0), true);

  transglitching.on('animationcomplete', () => {
    transglitching.setVisible(false);
  });

  // fade out the splash screen after 3 seconds
  scene.time.delayedCall(3000, () => {
    scene.tweens.add({
      targets: nightsplash,
      alpha: 0,
      duration: 1000,
      ease: 'Linear',
      onComplete: () => {
        nightsplash.destroy();
        clock = scene.add.image(1235, 680, 'clock');
        loadGameAssets(scene); // Load game assets after splash screen
      }
    });
  });
}

function loadGameAssets(scene) {
  scene.load.image('office', 'assets/textures/office/office.png');
  
  scene.load.once('complete', () => {
    startGameLogic(scene);
  });

  scene.load.start(); // starts loading the queued assets
}

function startGameLogic(scene) {
  clock.destroy();
  
  // Add the office background image
  office = scene.add.image(0, 0, 'office').setOrigin(0);

  inGame = true; // set inGame flag to true
}

// HELPER FUNCTIONS

function saveNight(value) { // helper function to save the current night to localStorage
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