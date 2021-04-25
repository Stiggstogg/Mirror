/**
 * Block manager which manages the blocks of one side.
 */
export default class BlockManager {

    /**
     * @constructor
     * @param {Phaser.Scene} scene - Scene where the block will be placed
     */
    constructor(scene) {

        this.scene = scene;
        this.blocks = scene.add.group();
        this.activeBlock = 0;                   // number of the active block

    }

    /**
     * Add a block to the manager.
     * @param {Block} block - block which should be added.
     */
    addBlock(block) {

        this.blocks.add(this.scene.add.existing(block));

        // activate it if it is the first block
        if (this.blocks.getLength() === 1) {
            this.getActive().act();
        }

    }

    /**
     * Activate the next block.
     */
    activateNext() {

        this.getActive().deact();

        if (this.activeBlock >= this.blocks.getLength() - 1) {
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

        let blocks = this.blocks.getChildren();

        return blocks[this.activeBlock];
    }

    /**
     * Make circles out of all blocks
     */
    circles() {
        for (let i in this.blocks.getChildren()) {
            this.blocks.getChildren()[i].setFrame(2);
        }
    }

}