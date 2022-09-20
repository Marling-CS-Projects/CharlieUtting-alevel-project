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
let sight;
let angle = 90;
let input;
let mouse;
let control = false;
let delay = 600;
let coords;
let health = 100;
let zombie;
let cooldown = false;
let angle2 = 90
let obj2;
let gameover;
let zomboid
let zombieLayer
let zombies;

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
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

    health;

    constructor (scene, x, y, texture)
    {
        super(scene, x, y, texture);
        this.scene.add.existing(this);

    }

    setTarget(target)
    {
        this.target = target
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
        if (!this.target)
        {
            return
        }

        const tx = this.target.x
        const ty = this.target.y

        const x = this.x
        const y = this.y

        const rotation = Phaser.Math.Angle.Between(x, y, tx, ty)
        this.setRotation(rotation)
    }
}

function create () {
    input = this.input;
    mouse = this.input.mousePointer;

    const map = this.make.tilemap({key: "map"});

    const tileset = map.addTilesetImage('mytileset', 'tileset');

    belowLayer = map.createLayer("Lower", tileset, 0, 0);
    worldLayer = map.createLayer("World", tileset, 0, 0);

    // player = this.physics.add.sprite(1608,1080,'person')
    player = this.physics.add.sprite(100, 200, 'person')


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

    text = this.add.text(500, 40, `Iron: ${ironCount}/ ${ironGoal}`, {
        fontSize: '20px',
        fill: '#ffffff'
    });
    text.setScrollFactor(0);
    coords = this.add.text(50, 50, `X: ${player.x}Y: ${player.y}`, {
        fontSize: `20px`,
        fill: `#ffffff`
    })
    coords.setScrollFactor(0)

    // zombieLayer = map.getObjectLayer('Zombie')
    //
    // zombie = this.physics.add.group()
    //
    // zombieLayer.objects.forEach(zomObj => {
    //     let obj = zombie.create(zomObj.x, zomObj.y, "zombieImg")
    //     obj.setScale(zomObj.width / 16, zomObj.height / 16);
    //     obj.setOrigin(0, 1);
    //     obj.body.width = zomObj.width / 2;
    //     obj.body.height = zomObj.height / 2;
    //
    //     function update() {
    //         this.physics.moveToObject(zombie, player)
    //     }
    // })

    this.physics.add.collider(player, iron, collectIron, null, this)

    // this.physics.add.collider(player, zombie, takeDamage, null, this)

    worldLayer.setCollisionByProperty({collides: true});

    this.physics.add.collider(worldLayer, player);

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    player.body.collideWorldBounds = true;

    //this.physics.add.collider(zombie, zombie)

    //this.physics.add.collider(zombie, player, takeDamage)

    //this.physics.add.collider(worldLayer, zombie)

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player, false);
    // zomboid = this.physics.add.existing(new Zombie(this, 100, 150))
    // let xco=300
    // for(let spawn = 0; spawn<=10; spawn++){
    //     zomboid = this.physics.add.existing(new Zombie(this,xco,100, player))
    //     xco= xco+10
    //     // this.physics.add.collider(zomboid, player)
    //     // this.physics.moveToObject(zomboid, player, 100)
    // }

    zombies = this.physics.add.group({
        runChildUpdate: true
    })
    let yco = 80
    for (let i = 0; i < 50; i++) {
        zombie = new Zombie(this, this.game.config.width / 6, yco, 'zombieImg')
        zombies.add(zombie)
        yco = yco +40
    }
    zombies.children.each(child => {
        child.health=100;
    })
    this.physics.add.collider(zombies,zombies)
    this.physics.add.collider(zombies, worldLayer)
    this.physics.add.collider(zombies,player)
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

    return false;
}

function zomDie(zombie,sight){

    zombie.destroy(zombie.x, zombie.y)
    sight.destroy(sight.x, sight.y)
}

function takeDamage(){
    if(cooldown == false) {
        health = health - damage;
        console.log(health)
        cooldown = true;
        this.time.delayedCall(500, function damageDelay(){
                cooldown = false;
        })
    }
}

function bullet() {
    control = false;
}
function destroyBullet(){
    sight.destroy(sight.x, sight.y)
}
function update ()
{
    zombies.children.each(child => {
        this.physics.moveToObject(child, player)
    })
    // zombies.children.each(child => {
    //     this.physics.moveToObject(zombie, player)
    // })
    // for(let spawn = 0; spawn < 3; spawn++){
    //     this.physics.add()
    // }
    // this.physics.moveToObject(Zombie, player, 100)
    angle = Phaser.Math.Angle.Between(player.x,player.y, this.input.mousePointer.worldX, this.input.mousePointer.worldY)
    player.rotation = angle;

    // let gameover = this.physics.add.collider(player.x,player.y,'fail')
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
    }
    else if (cursors.up.isDown) {
        player.setVelocityY(-160)
    }
    else if (cursors.down.isDown) {
        player.setVelocityY(160)
    }
    else
    {
        player.setVelocityX(0);
        player.setVelocityY(0);

    }

    coords.setText(`X: ${Math.round(player.x)} Y: ${Math.round(player.y)}`)
    if(mouse.isDown && control == false)
    {
        sight = this.physics.add.sprite(player.x,player.y,'bulletImg');

        this.physics.moveTo(sight,this.input.mousePointer.worldX,this.input.mousePointer.worldY,500)
        sight.rotation = Phaser.Math.Angle.Between(player.x, player.y,this.input.mousePointer.worldX,this.input.mousePointer.worldY)-80


        control = true;
        this.time.delayedCall(delay, bullet);
        this.physics.add.collider(sight, worldLayer, destroyBullet)
        this.physics.add.collider(sight, zombies, zomDie)
    }
}
