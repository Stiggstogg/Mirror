/**
 * Block manager which manages the blocks of one side.
 */
export default class BlockManager {

    /**
     * @constructor
     * @param {Block} firstBlock - First block which is added to the block manager
     * @param {Phaser.Scene} scene - Scene where the block will be placed
     */
    constructor(scene) {

        this.scene = scene;
        this.blocks = [];
        this.activeBlock = 0;                   // number of the active block

    }

    /**
     * Add a block to the manager.
     * @param {Block} block - block which should be added.
     */
    addBlock(block) {

        this.scene.add.existing(block);
        this.blocks.push(block);

        // activate it if it is the first block
        if (this.blocks.length === 1) {
            this.getActive().act();
        }

    }

    /**
     * Activate the next block.
     */
    activateNext() {

        this.getActive().deact();

        if (this.activeBlock >= this.blocks.length - 1) {
            this.activeBlock = 0;
        }
        else {
            this.activeBlock += 1;
        }

        this.getActive().act();

    }

    /**
     * Returns the currently active block.
     * @returns {Block}
     */
    getActive() {
        return this.blocks[this.activeBlock];
    }

}