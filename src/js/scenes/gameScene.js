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

        // create danger group
        this.dangerGroupLeft = this.add.group();
        this.dangerGroupRight = this.add.group();

        // create checkpoint group
        this.checkpointGroupLeft = this.add.group();
        this.checkpointGroupRight = this.add.group();

        // create level
        this.levels = new Levels();
        this.levels.selectLevel(1);
        this.levels.createLevel(this,
            this.blockManagerLeft, this.blockManagerRight,
            this.dangerGroupLeft, this.dangerGroupRight,
            this.checkpointGroupLeft, this.checkpointGroupRight);

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

        // check for collisions
        this.collisionBlockCheckpoint(this.blockManagerLeft, this.checkpointGroupLeft);     // blocks and checkpoint
        this.collisionBlockCheckpoint(this.blockManagerRight, this.checkpointGroupRight);
        this.collisionBlockDanger(this.blockManagerLeft, this.dangerGroupLeft);             // blocks and danger
        this.collisionBlockDanger(this.blockManagerRight, this.dangerGroupRight);
        this.collisionBlockBlock(this.blockManagerLeft);                                    // blocks and blocks
        this.collisionBlockBlock(this.blockManagerRight);



    }

    /**
     * Executed when the game is over. Triggers any actions and goes back to home screen.
     * @param {string} reason - reason why game over was triggered ('danger': collision of block with danger, 'block': collision of block with another block)
     */
    gameOver(reason) {

        switch (reason) {
            case 'danger':
                console.log('Game Over: Collision with Danger!');
                break;
            case 'block':
                console.log('Game Over: Collision with Block!');
                break;
            default:

                break;
        }

        // go back to home scene
        this.scene.start('Home');

    }

    /**
     * Checks the collision between blocks and dangers on one side. If a collision happens: Game Over!
     * @param {BlockManager} blockMan - Block manager from one side
     * @param {Phaser.GameObjects.Group} dangerGrp - Danger group from the same side
     */
    collisionBlockDanger(blockMan, dangerGrp) {

        let blocks = blockMan.blocks.getChildren();
        let dangers = dangerGrp.getChildren();

        for (let i in blocks) {
            for (let j in dangers) {
                if (Phaser.Geom.Intersects.RectangleToRectangle(blocks[i].getBounds(), dangers.[j].getBounds())) {
                    this.gameOver('danger');
                }
            }
        }

    }

    /**
     * Checks the collision between blocks and the checkpoints. If a collision happens: Check if this checkpoint is
     * the next in this blocks mission and proceed accordingly. If it is not the next checkpoint, nothing happens.
     * @param {BlockManager} blockMan - Block manager from one side
     * @param {Phaser.GameObjects.Group} checkpointGrp - Checkpoint group from the same side
     */
    collisionBlockCheckpoint(blockMan, checkpointGrp) {

        let blocks = blockMan.blocks.getChildren();
        let checkpoints = checkpointGrp.getChildren();

        for (let i in blocks) {
            for (let j in checkpoints) {
                if (Phaser.Geom.Intersects.RectangleToRectangle(blocks[i].getBounds(), checkpoints[j].getBounds())) {

                    blocks[i].checkMission(checkpoints[j]);

                }
            }
        }

    }

    /**
     * Checks the collision between the blocks on one side. If a collision happens: Game Over!
     * @param {BlockManager} blockMan - Block manager from one side
     */
    collisionBlockBlock(blockMan) {

        let blocks = blockMan.blocks.getChildren();

        for (let i = 0; i < blocks.length; i++) {
            for (let j = i+1; j < blocks.length; j++) {
                if (Phaser.Geom.Intersects.RectangleToRectangle(blocks.[i].getBounds(), blocks.[j].getBounds())) {
                    this.gameOver('block');
                }
            }
        }

    }



}