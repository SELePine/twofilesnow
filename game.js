// Intro Scene
class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: 'IntroScene' });
  }

  create() {
    this.add.text(100, 100, 'Welcome to the foraging game!\n\nYou (red square) and your partner (blue square) will collect berries from bushes.\n\nYou are the red square.\n\nPress the button below to begin the tutorial.', { fontSize: '20px', fill: '#000' });

    const startButton = this.add.rectangle(400, 500, 200, 50, 0x000000).setInteractive();
    this.add.text(340, 485, 'Start Tutorial', { fontSize: '18px', fill: '#ffffff' });

    startButton.on('pointerdown', () => {
      this.scene.start('TutorialScene');
    });
  }
}

// Tutorial Scene
class TutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TutorialScene' });
  }

  create() {
    this.add.text(50, 50, 'Tutorial:\n\nUse arrow keys to move your red square.\nTry to collect the purple berries.\n\nYour blue partner will collect orange berries.\n\nClick the button to start the game.', { fontSize: '18px', fill: '#000' });

    this.player = this.add.rectangle(100, 300, 30, 30, 0xff0000);
    this.bot = this.add.rectangle(700, 300, 30, 30, 0x0000ff);

    const startButton = this.add.rectangle(400, 500, 200, 50, 0x000000).setInteractive();
    this.add.text(340, 485, 'Start Game', { fontSize: '18px', fill: '#ffffff' });

    startButton.on('pointerdown', () => {
      this.scene.start('MainGameScene');
    });
  }
}

// Main Game Scene
class MainGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainGameScene' });
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.player = this.physics.add.existing(this.add.rectangle(100, 100, 30, 30, 0xff0000));
    this.player.body.setCollideWorldBounds(true);

    this.bot = this.physics.add.existing(this.add.rectangle(700, 500, 30, 30, 0x0000ff));
    this.bot.body.setCollideWorldBounds(true);

    this.berries = this.physics.add.group();
    for (let i = 0; i < 10; i++) {
      const isPurple = i < 5;
      const color = isPurple ? 0x800080 : 0xffa500;
      const berry = this.add.rectangle(
        Phaser.Math.Between(50, 750),
        Phaser.Math.Between(50, 550),
        20,
        20,
        color
      );
      this.berries.add(this.physics.add.existing(berry));
    }

    this.physics.add.overlap(this.player, this.berries, this.collectBerry, null, this);
    this.physics.add.overlap(this.bot, this.berries, this.collectBerry, null, this);
  }

  collectBerry(playerOrBot, berry) {
    berry.destroy();
  }

  update() {
    const speed = 200;
    const body = this.player.body;

    body.setVelocity(0);
    if (this.cursors.left.isDown) body.setVelocityX(-speed);
    else if (this.cursors.right.isDown) body.setVelocityX(speed);
    if (this.cursors.up.isDown) body.setVelocityY(-speed);
    else if (this.cursors.down.isDown) body.setVelocityY(speed);

    // Bot moves automatically
    this.bot.body.setVelocityX(100 * Math.sin(this.time.now / 500));
    this.bot.body.setVelocityY(100 * Math.cos(this.time.now / 500));
  }
}

// Game Config
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#7cfc00',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [IntroScene, TutorialScene, MainGameScene]
};

new Phaser.Game(config);
