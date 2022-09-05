import Phaser from 'phaser'
import personImg from './assets/person.png'
import tilesetImg from './assets/mytileset.png'
import tilemap from './assets/Map.json'
let player;
let cursors;

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

    const tileset = map.addTilesetImage("mytileset", "tileset");

    const belowLayer = map.createLayer("Lower", tileset, 0, 0);
    const worldLayer = map.createLayer("World", tileset, 0,0)

    player = this.physics.add.sprite(100,100,'person')


    cursors = this.input.keyboard.createCursorKeys();


    worldLayer.setCollisionByProperty({ collides: true });

    this.physics.add.collider(worldLayer,player)

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player, false);


}

function update ()
{
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
