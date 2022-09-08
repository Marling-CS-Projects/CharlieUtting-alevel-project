import Phaser from 'phaser'
import personImg from './assets/person.png'
import tilesetImg from './assets/mytileset.png'
import tilemap from './assets/Zombie.json'
import { Mrpas } from 'mrpas'
let player;
let cursors;
let target = 0;
let fov;
let belowLayer

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
    }
};


const game = new Phaser.Game(config);

function preload ()
{
    this.load.image("tileset", tilesetImg);
    this.load.tilemapTiledJSON("map", tilemap);
    this.load.image('person', personImg);
}

function create ()
{

    const map = this.make.tilemap({key: "map"});

    const tileset = map.addTilesetImage('mytileset', 'tileset');

    belowLayer = map.createLayer("Lower", tileset, 0, 0);
    const worldLayer = map.createLayer("World", tileset, 0,0);

    player = this.physics.add.sprite(100,100,'person')


    cursors = this.input.keyboard.createCursorKeys();


    worldLayer.setCollisionByProperty({ collides: true });
    //objectLayer.setCollisionByProperty({collides:true});

    this.physics.add.collider(worldLayer,player);
    //this.physics.add.collider(objectLayer,player);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player, false);

    player.body.collideWorldBounds = true;

    this.input.on('pointermove', function(pointer) {
        target = Phaser.Math.Angle.BetweenPoints(player, pointer);
    });

    // this.fov = new Mrpas(this.map.width, this.map.height, (x, y) => {
    //     const tile = this.belowLayer.getTileAt(x, y)
    //     return tile && !tile.collides
    // })
}

function update ()
{
    player.rotation = target;
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
}
