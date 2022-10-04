import Phaser from 'phaser'
import personImg from './assets/person.png'
import tilesetImg from './assets/mytileset.png'
import tilemap from './assets/Zombie.json'
import ironImg from './assets/iron.png'
import zomImg from './assets/zombie.png'
import bulImg from './assets/bullet.png'
import font from './assets/arcade.png'
import fontxml from './assets/arcade.xml'

let ironGoal = 6;
const ironGoals = [6,12,15,16,25,0];
let i = 0;
let damage = 20;
let zomDam = 3
let player;
let cursors;
let belowLayer
let worldLayer
let iron;
let ironLayer;
let ironCount = 0;
let text;
let bullet;
let angle = 90;
let control = false;
let delay = 600;
let coords;
let health = 100;
let zombie;
let zombies;
let text2;
let boss;
let gameOver;
let tutorial;

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        zoom: 1.5
    }
};


const game = new Phaser.Game(config);
function preload ()
{
    this.load.image("tileset", tilesetImg);
    this.load.tilemapTiledJSON("map", tilemap);
    this.load.image('person', personImg);
    this.load.image('iron', ironImg);
    this.load.image('zombieImg', zomImg)
    this.load.image('bulletImg', bulImg)
    this.load.bitmapFont('arcade', font, fontxml);
}

class Zombie extends Phaser.GameObjects.Sprite {
    h = 100;
    cooldown=false;
    constructor (scene, x, y, texture)
    {
        super(scene, x, y, texture);
        this.scene.add.existing(this);

    }



    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

    }
}

function create () {
    const map = this.make.tilemap({key: "map"});

    const tileset = map.addTilesetImage('mytileset', 'tileset');

    belowLayer = map.createLayer("Lower", tileset, 0, 0);
    worldLayer = map.createLayer("World", tileset, 0, 0);

    player = this.physics.add.sprite(1608,1080,'person')



    cursors = this.input.keyboard.createCursorKeys();

    ironLayer = map.getObjectLayer('Iron')['objects'];
    iron = this.physics.add.staticGroup()

    ironLayer.forEach(object => {
        let obj = iron.create(object.x, object.y, "iron");
        obj.setScale(object.width / 32, object.height / 32);
        obj.setOrigin(0, 1);
        obj.body.width = object.width / 2;
        obj.body.height = object.height / 2;
        obj.body.setOffset(23, -6);
    });


    text = this.add.bitmapText(390, 20,'arcade', `Iron: ${ironCount} out of ${ironGoal}`,15)
    text.setScrollFactor(0);

    coords = this.add.bitmapText(20, 40,'arcade', `X: ${player.x}Y: ${player.y}`,15)
    coords.setScrollFactor(0)

    text2 = this.add.bitmapText(20, 20, 'arcade', `Health: ${health}`,15)
    text2.setScrollFactor(0);

    gameOver = this.add.bitmapText(320, 240, 'arcade', `Game Over`, 50)
    gameOver.setScrollFactor(0)
    gameOver.setOrigin(0.5)
    gameOver.visible=false

    // tutorial = this.add.bitmapText(320, 240,'arcade', `Use the Arrow keys to move.\n Collect the iron.\nUse the mouse to aim and shoot.\nWhen you get the amount of iron in the corner of your screen then you gun will upgrade.\n Your aim is to collect all of the iron in the map`,15)
    tutorial = this.add.text(320, 110, `Use the Arrow keys to move.\nCollect the iron.\nUse the mouse to aim and shoot.\nIf you get the amount of iron in the top corner then it will upgrade your weapon.\nYour aim is to collect all of the iron in the map`, {
        fontSize: '13px',
        fill: '#ffffff'
    });

    tutorial.setScrollFactor(0);
    tutorial.setOrigin(0.5)

    this.physics.add.collider(player, iron, collectIron, null, this)

    worldLayer.setCollisionByProperty({collides: true});

    this.physics.add.collider(worldLayer, player);

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    player.body.collideWorldBounds = true;

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player, false);

    zombies = this.physics.add.group({
        runChildUpdate: true
    })
    for (let i = 0; i < 5; i++) {
        zombie = new Zombie(this, Phaser.Math.Between(1608, 1786), Phaser.Math.Between(0, 1784), 'zombieImg')
        zombies.add(zombie)
    }
    for (let i = 0; i < 11; i++) {
        zombie = new Zombie(this, Phaser.Math.Between(1320, 1560), Phaser.Math.Between(0, 1784), 'zombieImg')
        zombies.add(zombie)
    }
    for (let i = 0; i < 16; i++) {
        zombie = new Zombie(this, Phaser.Math.Between(968, 1272), Phaser.Math.Between(0, 1784), 'zombieImg')
        zombies.add(zombie)
    }
    for (let i = 0; i < 25; i++) {
        zombie = new Zombie(this, Phaser.Math.Between(424, 888), Phaser.Math.Between(0, 1784), 'zombieImg')
        zombies.add(zombie)
    }
    for (let i = 0; i < 30; i++) {
        zombie = new Zombie(this, Phaser.Math.Between(8, 376), Phaser.Math.Between(0, 1784), 'zombieImg')
        zombies.add(zombie)
    }
    this.physics.add.collider(zombies, player, takeDamage, null, this)

    zombies.children.each(child => {
        child.body.collideWorldBounds = true;
    })
    this.physics.add.collider(zombies,zombies)
    this.physics.add.collider(zombies, worldLayer)
}


function collectIron(player, iron){
    iron.destroy(iron.x, iron.y);
    ironCount++
    if(ironCount == ironGoal){
        i++
        ironCount = 0;
        ironGoal = ironGoals[i];
        damage= damage*2;
        delay = (delay/3)*2
    }

    if(i == 5){
        boss = new Zombie(this, 32, 1722, 'zombieImg')
        boss.setScale(4,4)
        boss.h = 100000
        zombies.add(boss)
        zomDam = 20
        health = 120
        text2.setText(`Health: ${health}`)
    }
    text.setText(`Iron: ${ironCount} out of ${ironGoal}`);
}

function zomDie(bullet,zombie){
    zombie.h = zombie.h-damage
    console.log('zombie: ' & zombie.h)
    bullet.destroy(bullet.x, bullet.y)
    if(zombie.h <= 0){
        zombie.destroy(zombie.x,zombie.y)
    }
}

function takeDamage(player, zombie) {
    if (zombie.cooldown == false) {
        health = health - zomDam;
        zombie.cooldown = true;
        this.time.delayedCall(200, function cd(){
            zombie.cooldown = false;
        })
        text2.setText(`Health: ${health}`)
    }
    if (health <= 0){
        player.visible=false
        this.physics.pause()
        gameOver.visible=true
        text2.setText(`Health: 0`)
    }
}

function update ()
{
    tutorial.Visible = true
    this.time.delayedCall(10000, function tut(){tutorial.visible = false})
    zombies.children.each(child => {
        this.physics.moveToObject(child, player, 120)
        child.rotation = Phaser.Math.Angle.BetweenPoints(child, player)
    })

    angle = Phaser.Math.Angle.Between(player.x, player.y, this.input.mousePointer.worldX, this.input.mousePointer.worldY)
    player.rotation = angle;

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    } else if (cursors.up.isDown) {
        player.setVelocityY(-160)
    } else if (cursors.down.isDown) {
        player.setVelocityY(160)
    } else {
        player.setVelocityX(0);
        player.setVelocityY(0);

    }

    coords.setText(`X: ${Math.round(player.x)} Y: ${Math.round(player.y)}`)
    if (this.input.mousePointer.isDown && control == false) {
        bullet = this.physics.add.sprite(player.x, player.y, 'bulletImg');

        this.physics.moveTo(bullet, this.input.mousePointer.worldX, this.input.mousePointer.worldY, 500)
        bullet.rotation = Phaser.Math.Angle.Between(player.x, player.y, this.input.mousePointer.worldX, this.input.mousePointer.worldY) - 80


        control = true;
        this.time.delayedCall(delay, function Bullet() {
            control = false;
        });
        this.physics.add.collider(bullet, worldLayer, function destroyBullet(){
            bullet.destroy(bullet.x, bullet.y)
        })
        this.physics.add.collider(bullet, zombies, zomDie)
    }
}
