class TestScene extends Phaser.Scene {
    player: Phaser.GameObjects.Sprite;
    cursors: any;

    constructor() {
        super({
            key: 'TestScene'
        });
    }

    preload() {
        //preloads tiles set
        this.load.image("tiles", "../../assets/tilesets/A4.png");
        //preloads tilemap
        this.load.tilemapTiledJSON("map", "../../assets/tilemaps/kinda_map_moment.json");
        this.load.image('player', '/assets/sprites/mushroom.png');
    }

    create() {
        const map = this.make.tilemap({key: "map"});

        const tileset = map.addTilesetImage("A4", "tiles");

        const layer = map.createStaticLayer("Tile Layer 1", tileset, 0, 0);

        const spawnPoint = map.findObject("Layer", obj => obj.name === "Spawn Point");

        this.player = this.add.sprite(100, 100, "player")

        this.cursors = this.input.keyboard.createCursorKeys()

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, false);
    }


    update() {
        if (this.cursors.left.isDown) {
            this.player.x -= 5;
        }
        if (this.cursors.right.isDown) {
            this.player.x += 5;
        }
        if (this.cursors.down.isDown) {
            this.player.y += 5;
        }
        if (this.cursors.up.isDown) {
            this.player.y -= 5;
        }
	}
}

export default TestScene;