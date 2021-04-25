/**
 * "Boot" scene
 */
export default class bootScene extends Phaser.Scene {

    /**
     * Constructor
     */
    constructor() {
        super({
            key: 'Boot'
        });
    }

    /**
     * load basic asset for "Loading" scene (e.g. logo), this asset should be small
     */
    preload() {

        // load logo
        this.load.image('logo', 'assets/images/Logo.png');

    }

    /**
     * change to "Loading" scene
     */
    create() {

        this.scene.start('Loading');

    }

}
