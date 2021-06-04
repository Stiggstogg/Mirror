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
     * @param {number[]} missions - missions to complete (checkpoints to pass), 1: tree, 2: rocket, 3: potato
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

        // setup the sprite (orientation, borders, activation state)
        this.setupSprite();

    }

    /**
     * Setup the sprite (orientation, borders, activation state)
     */
    setupSprite() {

        // blocks should be always on top! Therefore depth is set to 1
        this.depth = 1;

        /**
         * x and y movement boundaries coordinate (left side). If block is used on the right side, the shift is added
         * later. Each array contains the min and max values.
         * @type {{x: number[], y: number[]}}
         */
        this.moveBounds = {
            x: [10 + this.width/2, 310 - this.width/2],
            y: [10 + this.height/2, 310 - this.height/2]
        };

        /**
         * Movement multiplier. If left / right / up / down key is pressed the multiplier is applied to the movement,
         * e.g. to reverse the movements. Only relevant for the pirate who moves differently.
         * @type {number}
         */
        this.moveMultiplier = 1;

        // set different properties according to the side in which the block is in

        if (this.side === 'left') {             // left side
            this.createMissionState();          // create only for the left side the mission state images, otherwise they are doubled
        }
        else {                                  // right side

            this.flipX = true;                  // flip orientation for the right side

            // add shift for x coordinates to movement boundaries to match the right side movement boundaries
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

        let yStart = 345;                                       // y start position (top left image)
        let xStart = 43                                         // x start position (top right image)
        let rowSpace = 50;                                      // space between the rows of missions
        let colSpace = 38;                                      // space between the columns of missions

        let y = yStart + (this.block - 1) * rowSpace;           // y position (based on the block: top: normal, middle: pirate, bottom: glasses), the same for all images in a row
        let xArrow = 0;                                         // (temporary) position of the arrow
        let xMission = 0;                                       // (temporary) position of the mission image

        // create icon (block which needs to fulfill the mission)
        this.missionStateImages.add(this.scene.add.image(xStart,y, this.texture.key, 1));

        // create arrows and mission icons for each mission
        for (let i in this.missions) {

            xArrow = xStart + colSpace * (1 + i*2);         // x position of the arrow based on the number of the mission
            xMission = xStart + colSpace * (2 + i*2);       // x position of the mission image based on the number of the mission

            this.scene.add.image(xArrow, y, 'arrow');                                                                       // add arrow
            this.missionStateImages.add(this.scene.add.sprite(xMission, y, 'checkpoint', this.missions[i] - 1));      // add mission image to scene and add it to the group

        }

    }

    /**
     * Checks if a block has the provided checkpoint (based on the number: 1: tree, 2: rocket, 3: potato) in the list as the NEXT mission.
     * If yes, true is returned.
     * @param {Phaser.GameObjects.Sprite} checkpoint - Checkpoint (usually the checkpoint on which the block is currently standing).
     */
    checkMission(checkpoint) {
        return checkpoint.cpNum === this.missions[0];       // checks if the provided checkpoint number matches the NEXT mission of the block
    }

    /**
     * Checks if a block has the provided checkpoint (based on the number: 1: tree, 2: rocket, 3: potato) in the list
     * as the next mission and fulfills it (usually when both blocks are standing on their next checkpoints) by removing
     * it from the list of missions. Mark the corresponding mission image as fulfilled (needs to be done only for the left side).
     * @param {Phaser.GameObjects.Sprite} checkpoint - Checkpoint (usually the checkpoint on which the block is currently standing).
     */
    fulfillMission(checkpoint) {

        if (checkpoint.cpNum === this.missions[0]) {                                      // checkpoint number (1: tree, 2: rocket, 3: potato) matches the number of the next mission
            this.missions.shift();                                                        // remove mission from the list of this block (shift: removes the first element)

            // if it is a block on the left side adapt the corresponding mission state bar, by marking the mission as fulfilled
            if (this.side ==='left') {

                let missionImageNr = this.missionStateImages.getLength() - this.missions.length - 1;    // calculate the mission image number (starting at 0), by substracting from the total number of images (length of the mission statement image group) the remaining missions (length of the mission array of this block) and substracting -1 (array starts at 0)

                // play tween
                // image of the fulfilled mission flashes (scale up and down) and finally set alpha to 0.5
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
     * Movement when the right key is pressed (change velocity)
     */
    keyRight() {

        // increase the velocity of the block in the corresponding direction
        this.increaseVelocity(this.acceleration * this.moveMultiplier, 'x');    // positive sign as it moves to the right (except pirate, which moves exactly the other way round, based on the movement multiplier)

    }

    /**
     * Movement when the left key is pressed (change velocity)
     */
    keyLeft() {

        // increase the velocity of the block in the corresponding direction
        this.increaseVelocity(-this.acceleration * this.moveMultiplier, 'x');   // negative sign as it moves to the left (except pirate, which moves exactly the other way round, based on the movement multiplier)

    }

    /**
     * Movement when the up key is pressed (change velocity)
     */
    keyUp() {

        // increase the velocity of the block in the corresponding direction
        this.increaseVelocity(-this.acceleration * this.moveMultiplier, 'y');   // negative sign as it moves up (except pirate, which moves exactly the other way round, based on the movement multiplier)

    }

    /**
     * Movement when the down key is pressed (change velocity)
     */
    keyDown() {

        // increase the velocity of the block in the corresponding direction
        this.increaseVelocity(this.acceleration * this.moveMultiplier, 'y');    // positive sign as it moves down (except pirate, which moves exactly the other way round, based on the movement multiplier)

    }

    /**
     * Increases (or decreases) the velocity in the corresponding direction
     * @param {number} acceleration - acceleration in the corresponding direction (px/frame^2)
     * @param {string} direction - string to indicate in which direction the velocity should be increased, is 'x' or 'y'
     */
    increaseVelocity(acceleration, direction) {

        // change velocity based on the acceleration and direction
        switch (direction) {
            case 'x':                                               // x (left/right) movement
                this.velocity.x += acceleration;                    // increase velocity, based on acceleration (positive acceleration: movement to the right, negative acceleration: movement to the left)

                // check if the maximum velocity is reached and if yes set the velocity to this value
                if (this.velocity.x > this.maxVelocity) {           // maximum velocity in movement to the right is reached
                    this.velocity.x = this.maxVelocity;             // set to maximum velocity
                }
                else if (this.velocity.x < - this.maxVelocity) {    // maximum velocity in movement to the left is reached
                    this.velocity.x = -this.maxVelocity;            // set to maximum velocity
                }

                break;
            case 'y':                                               // x (up/down) movement
                this.velocity.y += acceleration;                    // increase velocity, based on acceleration (positive acceleration: movement down, negative acceleration: movement up)

                // check if the maximum velocity is reached and if yes set the velocity to this value
                if (this.velocity.y > this.maxVelocity) {           // maximum velocity in movement down is reached
                    this.velocity.y = this.maxVelocity;             // set to maximum velocity
                }
                else if (this.velocity.y < - this.maxVelocity) {    // maximum velocity in movement up is reached
                    this.velocity.y = -this.maxVelocity;            // set to maximum velocity
                }

                break;
        }

    }

    /**
     * Applies friction to the moving block (reduce velocity), updates the current position and checks if it is out of
     * bounds and adjust it.
     * @param args
     */
    update(args) {

        // get movement direction for x and apply friction accordingly
        if (this.velocity.x > 0) {                  // moving right

            this.velocity.x -= this.friction;       // subtract friction from the velocity

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

        // update the position by adding the velocity to it in x and y direction
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // check if the block is out of bounds and adjust coordinates accordingly (bring back into bounds)
        this.checkBounds();
    }

    /**
     * Check if the block is out of bounds and adjust coordinates accordingly (to bring back to bounds)
     */
    checkBounds() {

        if (this.x < this.moveBounds.x[0]) {this.x = this.moveBounds.x[0]}      // check left x and move it back if needed
        if (this.x > this.moveBounds.x[1]) {this.x = this.moveBounds.x[1]}      // check right x and move it back if needed
        if (this.y < this.moveBounds.y[0]) {this.y = this.moveBounds.y[0]}      // check top y and move it back if needed
        if (this.y > this.moveBounds.y[1]) {this.y = this.moveBounds.y[1]}      // check bottom y and move it back if needed
    }

    /**
     * Activate this block by changing the image of the block.
     */
    act() {
        this.setFrame(1);       // change the image of this block to the activated image (different frame)
    }

    /**
     * Deactivate this block by changing the image of the block and immediately stop it.
     */
    deact() {
        this.setFrame(0);       // change the image of this block to the activated image (different frame)

        // stop movement (set velocity to 0)
        this.velocity.x = 0;
        this.velocity.y = 0;

    }

}