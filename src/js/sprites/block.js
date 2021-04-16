/**
 * Block sprite
 */
export default class Block extends Phaser.GameObjects.Sprite {

    /**
     * Constructor
     * @param scene Scene in which the sprite is used
     * @param x x-coordinate
     * @param y y-coordinate
     * @param speed speed of the block
     */
    constructor(scene, x, y, speed) {

        super(scene, x, y, 'block1');

        this.speed = speed;

    }

    // what should happen if it is clicked on
    click(pointer) {
        console.log('spongibongy');
        this.scene.scene.start('Home');
    }
}