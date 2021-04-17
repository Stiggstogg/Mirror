// import objects
import BlockManager from '../helper/blockManager.js';
import Levels from '../helper/levels.js';

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


        // create block managers
        this.blockManagerLeft = new BlockManager(this);
        this.blockManagerRight = new BlockManager(this);

        // create level
        this.levels = new Levels();
        this.levels.selectLevel(1);
        this.levels.createLevel(this.blockManagerLeft, this.blockManagerRight);

        // add keys
        this.keysLeft = this.input.keyboard.addKeys('w,a,s,d,SPACE');
        this.keysRight = this.input.keyboard.addKeys('UP,LEFT,DOWN,RIGHT,ENTER');

        // add block change keys and event
        this.input.keyboard.addKey('Space').on('down', function () { this.blockManagerLeft.activateNext() }, this);
        this.input.keyboard.addKey('Enter').on('down', function () { this.blockManagerRight.activateNext() }, this);

    }

    /**
     * Update method
     * @param {number} time
     * @param {number} delta
     */
    update(time, delta) {

        // movement left side
        if (this.keysLeft.w.isDown) { this.blockManagerLeft.getActive().keyUp(); }
        if (this.keysLeft.a.isDown) { this.blockManagerLeft.getActive().keyLeft(); }
        if (this.keysLeft.s.isDown) { this.blockManagerLeft.getActive().keyDown(); }
        if (this.keysLeft.d.isDown) { this.blockManagerLeft.getActive().keyRight(); }

        // movement right side
        if (this.keysRight.UP.isDown) { this.blockManagerRight.getActive().keyUp(); }
        if (this.keysRight.LEFT.isDown) { this.blockManagerRight.getActive().keyLeft(); }
        if (this.keysRight.DOWN.isDown) { this.blockManagerRight.getActive().keyDown(); }
        if (this.keysRight.RIGHT.isDown) { this.blockManagerRight.getActive().keyRight(); }

    }

}