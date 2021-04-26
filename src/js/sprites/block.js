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

        // movement parameters
        this.maxVelocity = 3;                           // maximum velocity (px/frame)
        this.velocity = {x: 0, y: 0};                   // current velocity (px/frame)
        this.acceleration = 0.3;                        // acceleration (px/frame^2)
        this.friction = 0.15;                           // friction (px/frame^2)

        this.missionSound = this.scene.sound.add('mission');    // sound played when a mission is completed

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
         * Movement multiplier. If left / right / up / down key is is pressed the multiplier is applied to the movement,
         * e.g. to reverse the movements.
         * @type {number}
         */
        this.moveMultiplier = 1;

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

        // change properties to special properties of a specific block
        if (this.block === 2) {
            this.moveMultiplier = -1;         // movement vector for pirate: both directions reversed
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

                // play tween
                this.scene.tweens.add({
                    targets: this.missionStateImages.getChildren()[missionImageNr],
                    scaleX: 1.4,
                    scaleY: 1.4,
                    duration: 200,
                    yoyo: true,
                    callbackScope: this,
                    onComplete: function() { this.missionStateImages.getChildren()[missionImageNr].setAlpha(0.5); }
                });

                // play sound
                this.missionSound.play();

            }

        }

    }

    /**
     * Movement when the right key is pressed
     */
    keyRight() {

        this.increaseVelocity(this.acceleration * this.moveMultiplier, 'x');

    }

    /**
     * Movement when the left key is pressed
     */
    keyLeft() {

        this.increaseVelocity(-this.acceleration * this.moveMultiplier, 'x');

    }

    /**
     * Movement when the up key is pressed
     */
    keyUp() {

        this.increaseVelocity(-this.acceleration * this.moveMultiplier, 'y');

    }

    /**
     * Movement when the down key is pressed
     */
    keyDown() {

        this.increaseVelocity(this.acceleration * this.moveMultiplier, 'y');

    }

    increaseVelocity(acceleration, direction) {

        // change velocity based on the acceleration and direction
        switch (direction) {
            case 'x':
                this.velocity.x += acceleration;                    // increase velocity

                if (this.velocity.x > this.maxVelocity) {                 // check if the maximum velocity is reached and if yes set the velocity to this value
                    this.velocity.x = this.maxVelocity;
                }
                else if (this.velocity.x < - this.maxVelocity) {
                    this.velocity.x = -this.maxVelocity;
                }

                break;
            case 'y':
                this.velocity.y += acceleration;                    // increase velocity

                if (this.velocity.y > this.maxVelocity) {                 // check if the maximum velocity is reached and if yes set the velocity to this value
                    this.velocity.y = this.maxVelocity;
                }
                else if (this.velocity.y < - this.maxVelocity) {
                    this.velocity.y = -this.maxVelocity;
                }

                break;
        }

    }

    update(args) {

        // get movement direction for x and apply friction accordingly
        if (this.velocity.x > 0) {                  // moving right

            this.velocity.x -= this.friction;       // substract friction from the velocity

            if (this.velocity.x < 0) {              // check if velocity is smaller than zero (negative friction applied!) and set it back to 0
                this.velocity.x = 0;
            }

        } else if (this.velocity.x < 0) {           // moving left

            this.velocity.x += this.friction;       // add (because it is in negative direction) friction from the velocity

            if (this.velocity.x > 0) {              // check if velocity is higher than zero (negative friction applied!) and set it back to 0
                this.velocity.x = 0;
            }

        }

        // get movement direction for y and apply friction accordingly
        if (this.velocity.y > 0) {                  // moving down

            this.velocity.y -= this.friction;       // substract friction from the velocity

            if (this.velocity.y < 0) {              // check if velocity is smaller than zero (negative friction applied!) and set it back to 0
                this.velocity.y = 0;
            }

        } else if (this.velocity.y < 0) {           // moving up

            this.velocity.y += this.friction;       // add (because it is in negative direction) friction from the velocity

            if (this.velocity.y > 0) {              // check if velocity is higher than zero (negative friction applied!) and set it back to 0
                this.velocity.y = 0;
            }

        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;

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
        this.setFrame(0);       // set inactive frame

        // stop movement
        this.velocity.x = 0;
        this.velocity.y = 0;

    }

}