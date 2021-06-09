/**
 * Block manager which manages the blocks of one side.
 */
export default class BlockManager {

    /**
     * Block manager which manages the blocks of one side.
     * @constructor
     * @param {Phaser.Scene} scene - Scene where the blocks will be placed
     */
    constructor(scene) {

        this.scene = scene;                     // scene where the block will be placed ('Game' scene)
        this.blocks = scene.add.group();        // group of blocks (all blocks are added to this group
        this.activeBlock = 0;                   // number of the active block (0: normal, 1: pirate, 2: glasses)

    }

    /**
     * Add a block to the manager.
     * @param {Block} block - block object which should be added.
     */
    addBlock(block) {

        this.blocks.add(this.scene.add.existing(block));    // add block to the group

        // activate the block if it is the first block
        if (this.blocks.getLength() === 1) {
            this.getActive().act();                         // activate the first block
        }

    }

    /**
     * Activate the next block. In the order 0 -> 1 -> 2 -> 0 -> 1 ->...
     */
    activateNext() {

        this.getActive().deact();                               // deactivate the current block

        // activate the next block (set the block number to the 'activeBlock' property)
        if (this.activeBlock >= this.blocks.getLength() - 1) {  // activate the first block (0) if it is the last block (set block number)
            this.activeBlock = 0;
        }
        else {
            this.activeBlock += 1;                              // activate the next block (set block number)
        }

        this.getActive().act();                                 // activate the block

    }

    /**
     * Returns the currently active block.
     * @returns {Block}
     */
    getActive() {

        let blocks = this.blocks.getChildren();                 // get all the blocks as an array

        return blocks[this.activeBlock];                        // return the active block (based on the number)
    }

    /**
     * Make circles out of all blocks (for the game over and how to play)
     */
    circles() {
        for (let i in this.blocks.getChildren()) {
            this.blocks.getChildren()[i].setFrame(2);           // change the frame of all block to the circle frame
        }
    }

    /**
     * Update all blocks (mainly the movement)
     */
    updateAll() {

        for (let i in this.blocks.getChildren()) {
            this.blocks.getChildren()[i].update();          // call the update method for every block, which updates the movement and checks (and adjust) if a block is out of the level boundaries
        }

    }

}