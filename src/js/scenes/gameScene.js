// import objects
import Block from '../sprites/block.js'

// "Game" scene: This is the main scene of the game
export default class gameScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'Game'
        });
    }

    // initiate scene parameters
    init() {

    }

    // load assets
    preload() {

    }

    // create objects (executed once after preload())
    create() {

        // add background
        this.add.sprite(0, 0, 'background').setOrigin(0, 0);

        // add block
        this.block = this.add.existing(new Block(this, 100, 100, 10));

        // add keys
        //this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keys = this.input.keyboard.addKeys('UP,DOWN,LEFT,RIGHT');

    }

    // update method
    update(time, delta) {

        if (this.keys.UP.isDown) { this.block.y -= this.block.speed; }
        if (this.keys.DOWN.isDown) { this.block.y += this.block.speed; }
        if (this.keys.LEFT.isDown) { this.block.x -= this.block.speed; }
        if (this.keys.RIGHT.isDown) { this.block.x += this.block.speed; }


    }

}