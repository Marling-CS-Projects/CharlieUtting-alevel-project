# 2.2.1 Cycle 1

## Design

### Objectives

Make phaser work and display something.

* [ ] Make phaser run.
* [ ] Make it display something.

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
    add image(width: 400, height: 300, star)
```

## Development

### Outcome

### Challenges

Description of challenges

## Testing

Evidence for testing

### Tests

| Test | Instructions  | What I expect     | What actually happens | Pass/Fail |
| ---- | ------------- | ----------------- | --------------------- | --------- |
| 1    | Run code      | Thing happens     | As expected           | Pass      |
| 2    | Press buttons | Something happens | As expected           | Pass      |

### Evidence
