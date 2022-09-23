import Phaser from 'phaser'
import personImg from './assets/person.png'
import tilesetImg from './assets/mytileset.png'
import tilemap from './assets/Zombie.json'
import ironImg from './assets/iron.png'
import sightImg from './assets/sight.png'
import zomImg from './assets/zombie.png'
import bulImg from './assets/bullet.png'
import gameoverImg from './assets/gameover.png'

let ironGoal = 6;
const ironGoals = [6,12,15,16,25];
let i = 0;
let damage = 5;
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
let gameover;
let zombies;
let text2;
let cooldown = false;
let zomAngle=0


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
    this.load.image('sight', sightImg)
    this.load.image('zombieImg', zomImg)
    this.load.image('bulletImg', bulImg)
    this.load.image('fail', gameover)
}

class Zombie extends Phaser.GameObjects.Sprite {

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

    text = this.add.text(500, 20, `Iron: ${ironCount}/ ${ironGoal}`, {
        fontSize: '20px',
        fill: '#ffffff'
    });
    text.setScrollFactor(0);
    coords = this.add.text(20, 40, `X: ${player.x}Y: ${player.y}`, {
        fontSize: `20px`,
        fill: `#ffffff`
    })
    coords.setScrollFactor(0)

    text2 = this.add.text(20, 20, health, {
        fontSize: '20px',
        fill: '#ffffff'
    });
    text2.setScrollFactor(0);



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
    let yco = 80
    for (let i = 0; i < 50; i++) {
        zombie = new Zombie(this, Phaser.Math.Between(0, 1784), Phaser.Math.Between(0, 1784), 'zombieImg')
        zombies.add(zombie)
        yco = yco +40
        this.physics.add.collider(zombies, player, takeDamage, null, this)
    }
    zombies.children.each(child => {
        child.health=100;
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
    text.setText(`Iron: ${ironCount}/ ${ironGoal}`);
}

function zomDie(zombie,bullet){
    zombie.destroy(zombie.x, zombie.y)
    bullet.destroy(bullet.x, bullet.y)
}

function takeDamage() {
    if (cooldown == false) {
        health = health - damage;
        console.log(health)
        cooldown = true;
        this.time.delayedCall(200, function hello(){
            cooldown = false;
        })
        text2.setText(health)
    }
    if (health <= 0){
        game.destroy()
    }
}

function update ()
{
    this.physics.add.collider(Zombie, player)

    zombies.children.each(child => {
        this.physics.moveToObject(child, player, 120)
        child.rotation = Phaser.Math.Angle.BetweenPoints(child, player)
    })

    angle = Phaser.Math.Angle.Between(player.x, player.y, this.input.mousePointer.worldX, this.input.mousePointer.worldY)
    player.rotation = angle;

    let gameover = this.physics.add.collider(player.x,player.y,'fail')
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
