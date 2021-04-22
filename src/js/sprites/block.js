/**
 * Block sprite
 */
export default class Block extends Phaser.GameObjects.Sprite {

    /**
     * Constructor
     * @constructor
     * @param {Phaser.Scene} scene - Scene in which the sprite is used
     * @param {number} x - x-coordinate
     * @param {number} y - y-coordinate
     * @param {number} block - type of the block, 1: normal, 2: pirate, 3: glasses
     * @param {string} side - side of the mirror where the block is placed ('left' or 'right')
     * @param {number[]} missions - missions to complete (checkpoints to pass)
     */
    constructor(scene, x, y, block, side, missions) {

        super(scene, x, y, 'block' + block.toString());

        this.scene = scene;                             // scene where the block is in
        this.block = block;                             // type of type of the block: 1: normal; 2: pirate; 3: glasses
        this.side = side;                               // side of the mirror where the block is placed ('left' or 'right')
        this.missions = missions                        // missions to complete (checkpoints to pass)

        this.setupSprite();

    }

    /**
     * Setup the sprite (orientation, borders, activation state)
     */
    setupSprite() {

        // blocks should be always on top!
        this.depth = 1;

        /**
         * Movement boundaries for x and y coordinate. Each array contains the min and max values.
         * @type {{x: number[], y: number[]}}
         */
        this.moveBounds = {
            x: [10 + this.width/2, 310 - this.width/2],
            y: [10 + this.height/2, 310 - this.height/2]
        };

        /**
         * Movement multiplier. If left / right or up / down key is is pressed the multiplier is applied to the movement,
         * e.g. to reverse the movements.
         * @type {{updown: number, leftright: number}}
         */
        this.moveVector = {
            leftright: 1,
            updown: 1
        };

        /**
         * Speed of the block.
         * @type {number}
         */
        this.speed = 3;

        // set properties according to the side
        if (this.side === 'left') {
            this.createMissionState();          // create only for the left side the mission state images, otherwise they are doubled
        }
        else {

            this.flipX = true;              // orientation

            // movement boundaries
            this.moveBounds.x[0] += 320;
            this.moveBounds.x[1] += 320;

        }

        // change properties in case it is not the normal block
        switch (this.block) {
            case 2:                 // pirate

                this.speed = 3;    // speed

                this.moveVector = {         // movement vector for pirate: both directions reversed
                    leftright: -1,
                    updown: -1
                };

                break;

            case 3:                 // glasses

                this.speed = 3;    // speed

                this.moveVector = {         // movement vector for glasses: Left / right movement reversed
                    leftright: -1,
                    updown: 1
                };

                break;
        }

    }

    /**
     * Creates the mission state information at the bottom part of the screen (icons which missions need to be fulfilled)
     * This is only created for the blocks on the left side, otherwise it would be doubled.
     */
    createMissionState() {

        this.missionStateImages = this.scene.add.group();    // images for the mission state bar

        let yStart = 345;
        let xStart = 43
        let rowSpace = 50;
        let colSpace = 38;

        let y = yStart + (this.block - 1) * rowSpace;
        let xArrow = 0;
        let xMission = 0;

        // create icon
        this.missionStateImages.add(this.scene.add.image(xStart, y, this.texture.key, 1));

        // create arrows and mission icons
        for (let i in this.missions) {

            xArrow = xStart + colSpace * (1 + i*2);
            xMission = xStart + colSpace * (2 + i*2);

            this.scene.add.image(xArrow, y, 'arrow');
            this.missionStateImages.add(this.scene.add.sprite(xMission, y, 'checkpoint', this.missions[i] - 1));

        }

    }

    /**
     * Checks if a block has the provided checkpoint in the list as the next mission. If yes, true is returned.
     * @param {Phaser.GameObjects.Group} checkpoint - Checkpoint (usually the checkpoint on which the block is currently standing).
     */
    checkMission(checkpoint) {
        return checkpoint.cpNum === this.missions[0];
    }

    /**
     * Checks if a block has the provided checkpoint in the list as the next mission and fulfills it (usually when
     * both blocks are standing on their next checkpoints) by removing it from the list of missions. Mark the corresponding
     * mission image as fulfilled (needs to be done only for the left side).
     * @param {Phaser.GameObjects.Group} checkpoint - Checkpoint (usually the checkpoint on which the block is currently standing).
     */
    fulfillMission(checkpoint) {

        if (checkpoint.cpNum === this.missions[0]) {
            this.missions.shift();                                                        // remove mission from the list

            // if it is a block on the left side adapt the corresponding mission state bar, by marking the mission as fulfilled
            if (this.side ==='left') {

                let missionImageNr = this.missionStateImages.getLength() - this.missions.length - 1;
                this.missionStateImages.getChildren()[missionImageNr].setAlpha(0.5);
            }

        }

    }

    /**
     * Movement when the right key is pressed
     */
    keyRight() {

        this.x += this.moveVector.leftright * this.speed;

        this.checkBounds();

    }

    /**
     * Movement when the left key is pressed
     */
    keyLeft() {

        this.x -= this.moveVector.leftright * this.speed;

        this.checkBounds();

    }

    /**
     * Movement when the up key is pressed
     */
    keyUp() {

        this.y -= this.moveVector.updown * this.speed;

        this.checkBounds();

    }

    /**
     * Movement when the down key is pressed
     */
    keyDown() {

        this.y += this.moveVector.updown * this.speed;

        this.checkBounds();

    }

    /**
     * Check if the block is out of bounds and adjust coordinates accordingly (to bring back to bounds)
     */
    checkBounds() {

        if (this.x < this.moveBounds.x[0]) {this.x = this.moveBounds.x[0]}      // check left x
        if (this.x > this.moveBounds.x[1]) {this.x = this.moveBounds.x[1]}      // check right x
        if (this.y < this.moveBounds.y[0]) {this.y = this.moveBounds.y[0]}      // check top y
        if (this.y > this.moveBounds.y[1]) {this.y = this.moveBounds.y[1]}      // check bottom y
    }

    /**
     * Activate this block.
     */
    act() {
        this.setFrame(1);
    }

    /**
     * Deactivate this block.
     */
    deact() {
        this.setFrame(0);
    }

}