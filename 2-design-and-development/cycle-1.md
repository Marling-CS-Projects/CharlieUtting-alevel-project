# 2.2.1 Cycle 1

## Design

### Objectives

Make Phaser work and display something.

* [x] Make Phaser run.
* [x] Make it display a background.
* [x] Make platforms.
* [x] Make physics.
* [x] Add player.
* [x] Make player collide with platforms.
* [x] Add keyboard controls.
* [x] Add star collectibles.
* [x] Add scores.
* [ ] Add bombs.

### Usability Features

### Key Variables

| Variable Name | Use                                                                    |
| ------------- | ---------------------------------------------------------------------- |
| config        | This object allows you to configure the game including the game window |
| game          | Local variable which Phaser.Game is assigned to.                       |
| player        | Object for the playable character.                                     |
| platform      | Game object for the platforms that the player will bounce on.          |
| score         | Variable to hold the amount the player has scored whilst playing.      |
| scoreText     | Used to display the score text at the top left of the screen.          |

### Pseudocode

```
define config
    width = 800,
    height = 600, //Defines the window size
    physics
        arcade
            gravity = 300 // Sets gravity with arcade type to 300.
    scene:
        preload: preload,
        create: create,
        update: update
define game = new phaser.game(config) //Defines the game.
function preload
    load image sky, star.png
    load image ground, ground.png
    load image star, star.png
    load image bomb, bomb.png
    load spritesheet dude, dude.png //Loads the sprites and other game objects.

define player
define platforms
define score
define scoreText

function create
    add image(width: 400, height: 300, sky) //Adds a platform for the floor.
    
    platforms = this.physics
    
    add image(width: 400,height: 568, ground)
    add image(width: 600,height: 400, ground)
    add image(width: 50,height: 250, ground)
    add image(width: 750,height: 220, ground) //Adds 4 more platforms.
    
    player = physics.add.sprite(100, 450, dude) //Defines player.
    player collide with world bounds = true
    player bounce(0.2)
    
    animation()
        key:left
        frames: dude(0,1, 2, 3) //Uses frames 0, 1 , 2, and 3.
        repeat = -1 //Tells the animation to loop.
        framerate: 10
    animation()
        key:turn
        frames: dude(4)
        framerate:10
    animation()
        key: right
        frames: dude(5, 6, 7, 8)
        repeat = -1
        framerate:10
    
function update
    if(left_arrow_down = true)
        player_velocity_x = -160
        
        play_anim(left)
    else if(right_arrow_down = true)
        player_velocity_x = 160
        
        play_anim(right)
    else
        player_velocity = 0
        
        play_anim(turn)
    
    if(up_arrow_down = true + on_ground = true)
        player_velocity_y = -330
```

## Development

### Outcome

### Challenges

Description of challenges

## Testing

Evidence for testing

### Tests

| Test | Instructions         | What I expect                                                              | What actually happens | Pass/Fail |
| ---- | -------------------- | -------------------------------------------------------------------------- | --------------------- | --------- |
| 1    | Run Server           | When I go to the local host it displays my web-page.                       | As expected           | Pass      |
| 2    | Display a background | When the code is run It displays a sky background.                         | As expected           | Pass      |
| 3    | Make Platforms       | Have platforms that use the ground png.                                    | As expected           | Pass      |
| 4    | Make Physics         | Have arcade physics for the platformer.                                    | As expected           | Pass      |
| 5    | Add player           | Make a sprite using the guy sprite sheet that will eventually be playable. | As expected           | Pass      |

### Evidence

![Picture of server running and background.](<../.gitbook/assets/2022-04-08-174251\_1920x1080\_scrot (1).png>)

![Platforms that the player will jump on.](../.gitbook/assets/image.png)

![Player that has fallen to the ground due to the physics and has collided with the platforms.](<../.gitbook/assets/image (2).png>)
