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
     */
    constructor(scene, x, y, block, side) {

        super(scene, x, y, 'block' + block.toString());

        this.block = block;                       // type of type of the block: 1: normal; 2: pirate; 3: glasses
        this.side = side;                       // side of the mirror where the block is placed ('left' or 'right')

        this.setupSprite();

    }

    /**
     * Setup the sprite (orientation, borders, activation state)
     */
    setupSprite() {

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
        this.speed = 10;

        // set properties according to the side
        if (this.side === 'right') {

            this.flipX = true;              // orientation

            // movement boundaries
            this.moveBounds.x[0] += 320;
            this.moveBounds.x[1] += 320;

        }
        else {

        }

        // change properties in case it is not the normal block
        switch (this.block) {
            case 2:                 // pirate

                this.speed = 10;    // speed

                this.moveVector = {         // movement vector for pirate: both directions reversed
                    leftright: -1,
                    updown: -1
                };

                break;

            case 3:                 // glasses

                this.speed = 10;    // speed

                this.moveVector = {         // movement vector for glasses: Left / right movement reversed
                    leftright: -1,
                    updown: 1
                };

                break;
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