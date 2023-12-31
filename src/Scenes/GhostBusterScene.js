import Phaser from "phaser";
import ghost from "../../ui/Ghost.js";
import bomb from "../../ui/bomb.js";
import ScoreLabel from "../../ui/ScoreLabel.js";
import LifeLabel from "../../ui/LifeLabel.js";
export default class GhostBusterScene extends Phaser.Scene {
  constructor() {
    super("Ghost-buster-scene");
  }

  init() {
    this.clouds = undefined;
    this.listBomb = undefined;
    this.ground = undefined;
    this.shoot = false;
    this.player = undefined;
    this.Speed = 150;
    this.cursors = undefined;
    this.listGhost = undefined;
    this.GhostSpeed = 60;
    this.bomb = undefined;
    this.lastFired = 0;
    this.scoreLabel = undefined;
    this.lifeLabel = undefined;
  }
  preload() {
    this.load.image("background", "images/background.png");
    this.load.image("cloud", "images/cloud.png");
    this.load.image("ground", "image/ground.png");
    this.load.spritesheet("player", "image/player.png", {
      frameWidth: 16,
      frameHeigth:16,
    });
    this.load.spritesheet("Ghost", "images/Ghost.png");
    this.load.image("bomb", "image/bomb.png", {
      frameWidth: 16,
      frameHeight: 32,
      startFrame: 16,
      endFrame: 32,
    });
  }
  create() {
    const gameWidth = this.scale.width * 0.5;
    const gameHeight = this.scale.height * 0.5;
    this.add.image(gameWidth, gameHeight, "background");

    this.clouds = this.physics.add.group({
      key: "cloud",
      repeat: 20,
  });

  Phaser.Actions.RandomRectangle(
    this.clouds.getChildren(),
    this.physics.world.bounds
  );

  this.createButton();
    this.player = this.createPlayer();
    this.cursors = this.input.keyboard.createCursorKeys();

    this.enemies = this.physics.add.group({
    classType: FallingObject,
    maxSize: 10,
      runChildUpdate: true,
    });

    this.time.addEvent({
      delay: 2000,
      callback: this.spawnGhost,
      callbackScope: this,
      loop: true,
    });

    this.bomb = this.physics.add.group({
      classType: bomb,
      maxSize: 1000,
      runChildUpdate: true,
    });

    this.physics.add.overlap(
      this.bomb,
      this.enemies,
      this.hitGhost,
      undefined,
      this
    );

    this.scoreLabel = this.createScoreLabel(16, 16, 0);
    this.lifeLabel = this.createLifeLabel(16, 43, 3);

    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.decreaseLife,
      null,
      this
    );
   
    platform.create(x, y, "ground")
    platform = this.physics.add. staticGroup();
    platform.create(500, 568, "ground").setScale(2).refreshBody()
    }

    
  createButton() {
    this.input.addPointer(3);

    let shoot = this.add
      .image(320, 550, "shoot-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8);
    let nav_left = this.add
      .image(50, 550, "left-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8);
    let nav_right = this.add
      .image(nav_left.x + nav_left.displayWidth + 20, 550, "right-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8);

    nav_left.on(
      "pointerdown",
      () => {
        this.nav_left = true;
      },
      this
    );
    nav_left.on(
      "pointerout",
      () => {
        this.nav_left = false;
      },
      this
    );
    nav_right.on(
      "pointerdown",
      () => {
        this.nav_right = true;
      },
      this
    );
    nav_right.on(
      "pointerout",
      () => {
        this.nav_right = false;
      },
      this
    );
    shoot.on(
      "pointerdown",
      () => {
        this.shoot = true;
      },
      this
    );
    shoot.on(
      "pointerout",
      () => {
        this.shoot = false;
      },
      this
    );
  }
  update(time) {
    this.clouds.children.iterate((child) => {
      child.setVelocityY(20);
      if (child.y > this.scale.height) {
        child.x = Phaser.Math.Between(10, 400);
        child.y = child.displayHeight * -1;
      }
    });

    this.movePlayer(this.player, time);
  }


  createPlayer() {
    const player = this.physics.add.sprite(200, 450, "player");
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: "turn",
      frames: [{ key: "player", frame: 0 }],
    });

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", { start: 1, end: 2 }),
      frameRate: 10,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", { start: 1, end: 2 }),
      frameRate: 10,
    });

    return player;
  } 
  
  movePlayer(player, time) {
    if (this.cursors.left.isDown || this.nav_left) {
      this.player.setVelocityX(this.speed * -1);
      this.player.anims.play("left", true);
      this.player.setFlipX(false);
    } else if (this.cursors.right.isDown || this.nav_right) {
      this.player.setVelocityX(this.speed);
      this.player.anims.play("right", true);
      this.player.setFlipX(true);
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(this.speed * -1);
      this.player.anims.play("turn", true);
      this.player.setFlipY(false);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(this.speed);
      this.player.anims.play("turn", true);
      this.player.setFlipY(true);
    } else {
      this.player.setVelocityY(0);
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

  if (
    (this.shoot && time > this.lastFired) ||
    (this.cursors.space.isDown && time > this.lastFired)
    ) {
    const bomb = this.bomb.get(0, 0, "bomb");
    if (bomb) {
      bomb.fire(this.player.x, this.player.y);
      this.lastFired = time + 150;
      this.sound.play("laserSound");
     }
   }

   this.anims.create({
    key: 'left',
    frames:this.anims,generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
   });
   this.anims.create({
    key: "turn",
    frameRate: [ { key: " dude ", frame: 4 } ],
    frameRate: 20
   });
   this.anims.create({
    key:"right",
    frames:this.anims.generateFrameNumbers("dude",
    (start: 5, end: 8 )),
    frameRate: 10,
    repeat: -1 
   });
 }
  
  spawnGhost() {
    const config = {
      speed: this.GhostSpeed,
      rotation: 0,
    };
    const Ghost = this.Ghost.get(0, 0, "enemy", config);
    const GhostWidth = Ghost.displayWidth;
    const positionX = Phaser.Math.Between(
      GhostWidth,
      this.scale.width - GhostWidth
    );
    if (Ghost) {
      Ghost.spawn(positionX);
    }
  }

  hitGhost(bomb, Ghost){
    bomb.erase();
    Ghost.die();
    
    this.scoreLabel.add(100);
    if (this.scoreLabel.getScore() % 100 == 0) {
      this.enemySpeed += 30;
  }
}

  createScoreLabel(x, y, score) {
    const style = { fontSize: "32px", fill: "#000" };
    const label = new ScoreLabel(this, x, y, score, style).setDepth(1);
    this.add.existing(label);
    return label;
  }
  
  createLifeLabel(x, y, score) {
    const style = { fontSize: "32px", fill: "#000" };
    const label = new LifeLabel(this, x, y, score, style).setDepth(1);
    this.add.existing(label);
    return label;
  }
  decreaseLife(player, enemy) {
    enemy.die();
    this.lifeLabel.subtract(1);
    if (this.lifeLabel.getLife() == 2) {
      player.setTint(0x515672);
    } else if (this.lifeLabel.getLife() == 1) {
      player.setTint(0x515672).setAlpha(0.2);
    } else if (this.lifeLabel.getLife() == 0) {
      this.scene.start("game-over-scene", {
        score: this.scoreLabel.getScore(),
      });
      this.sound.stopAll();
      this.sound.play("gameOverSound");
    }
  }
  hitPlayer(player, Ghost) {
    Ghost.die();
    this.lifeLabel.add(1);
    if (this.lifeLabel.getLife() >= 3) {
      player.clearTint().setAlpha(2);
    }
  }
}
