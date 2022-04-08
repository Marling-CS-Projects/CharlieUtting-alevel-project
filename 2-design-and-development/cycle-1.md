# 2.2.1 Cycle 1

## Design

### Objectives

Make Phaser work and display something.

* [x] Make Phaser run.
* [x] Make it display a background.
* [x] Make platforms.
* [ ] Make physics.

### Usability Features

### Key Variables

| Variable Name | Use                                                                    |
| ------------- | ---------------------------------------------------------------------- |
| config        | This object allows you to configure the game including the game window |
| game          | Local variable which Phaser.Game is assigned to.                       |

### Pseudocode

```
define config
    width = 800,
    height = 600,
    physics
        arcade
            gravity = 300
    scene:
        preload: preload,
        create: create,
        update: update
define game = new phaser.game(config)
function preload
    load image sky, star.png
    load image ground, ground.png
    load image star, star.png
    load image bomb, bomb.png
    load spritesheet dude, dude.png
function create
    add image(width: 400, height: 300, sky)
    
    platforms = this.physics
    
    add image(width: 400,height: 568, ground)
    add image(width: 600,height: 400, ground)
    add image(width: 50,height: 250, ground)
    add image(width: 750,height: 220, ground)
```

## Development

### Outcome

### Challenges

Description of challenges

## Testing

Evidence for testing

### Tests

| Test | Instructions         | What I expect                                        | What actually happens | Pass/Fail |
| ---- | -------------------- | ---------------------------------------------------- | --------------------- | --------- |
| 1    | Run Server           | When I go to the local host it displays my web-page. | As expected           | Pass      |
| 2    | Display a background | When the code is run It displays a sky background.   | As expected           | Pass      |
| 3    | Make Platforms       | Have platforms that use the ground png.              | As expected           | Pass      |
| 4    | Make Physics         | Have arcade physics for the platformer.              |                       |           |

### Evidence

![Picture of website](../.gitbook/assets/2022-04-08-174251\_1920x1080\_scrot.png)
