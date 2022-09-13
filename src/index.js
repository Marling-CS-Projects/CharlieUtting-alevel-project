import Phaser from 'phaser'
import personImg from './assets/person.png'
import tilesetImg from './assets/mytileset.png'
import tilemap from './assets/Zombie.json'
import ironImg from './assets/iron.png'
import sightImg from './assets/sight.png'

let ironGoal = 6;
const ironGoals = [6,12,15,16,25];
let i = 0;
let damage = 5;
let player;
let cursors;
let target = 0;
let belowLayer
let iron;
let ironLayer;
let ironCount = 0;
let text;
let sight;
let angle = 90;
let targetVec = 0;
let input;

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
}

function create ()
{
    input=this.input;

    const map = this.make.tilemap({key: "map"});

    const tileset = map.addTilesetImage('mytileset', 'tileset');

    belowLayer = map.createLayer("Lower", tileset, 0, 0);
    const worldLayer = map.createLayer("World", tileset, 0,0);


    player = this.physics.add.sprite(200,200,'person')

    cursors = this.input.keyboard.createCursorKeys();

    ironLayer = map.getObjectLayer('Iron')['objects'];
    iron = this.physics.add.staticGroup()

    ironLayer.forEach(object => {
        let obj = iron.create(object.x, object.y, "iron");
        obj.setScale(object.width/32, object.height/32);
        obj.setOrigin(0,1);
        obj.body.width = object.width/2;
        obj.body.height = object.height/2;
        obj.body.setOffset(23,-6);
    });

    text = this.add.text(570, 70, `Iron: ${ironCount}/ ${ironGoal}`, {
        fontSize: '20px',
        fill: '#ffffff'
    });
    text.setScrollFactor(0);

    this.physics.add.collider(player, iron, collectIron, null, this)

    worldLayer.setCollisionByProperty({ collides: true });

    this.physics.add.collider(worldLayer,player);

    this.physics.world.setBounds( 0, 0, map.widthInPixels, map.heightInPixels );
    player.body.collideWorldBounds = true;

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player, false);
}

function collectIron(player, iron){
    iron.destroy(iron.x, iron.y);
    ironCount++
    if(ironCount == ironGoal){
        i++
        ironCount = 0;
        ironGoal = ironGoals[i];
        damage= damage*2;
    }
    text.setText(`Iron: ${ironCount}/ ${ironGoal}`);

    return false;
}

function update ()
{
    angle = Phaser.Math.Angle.Between(player.x,player.y, this.input.mousePointer.worldX, this.input.mousePointer.worldY)

    player.rotation = angle;
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
    else if(input.isDown)
    {
        sight = this.physics.add.sprite(384,256,'cannonBall');

        this.physics.moveTo(sight,input.x,input.y,500);
    }
    else
    {
        player.setVelocityX(0);
        player.setVelocityY(0);

    }
}
