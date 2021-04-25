import WebFontFile from "../helper/webFontLoader";

/**
 * "Loading" scene: Loads all assets and shows a progress bar while loading
 */
export default class loadingScene extends Phaser.Scene {

    /**
     * Constructor
     */
    constructor() {
        super({
            key: 'Loading'
        });
    }

    /**
     * load all assets (for all scenes)
     */
    preload() {

        // get game width and height
        let gw = this.sys.game.config.width;
        let gh = this.sys.game.config.height;

        // load fonts
        this.load.addFile(new WebFontFile(this.load, ['VT323']));

        // show logo
        let logo = this.add.sprite(gw/2, gh / 2, 'logo').setScale(5, 5); // logo is already preloaded in 'Boot' scene

        // text
        this.add.text(gw/2, gh * 0.20, 'CLOWNGAMING', {fontSize: '70px', color: '#FFFF00', fontStyle: 'bold'}).setOrigin(0.5);
        this.add.text(gw/2, gh * 0.73, 'Loading', {fontSize: '30px', color: '#4888b7'}).setOrigin(0.5);

        // progress bar background (e.g grey)
        let bgBar = this.add.graphics();
        let barW = gw * 0.3;            // progress bar width
        let barH = barW * 0.1;          // progress bar height
        let barX = gw / 2 - barW / 2;       // progress bar x coordinate (origin is 0, 0)
        let barY = gh * 0.8 - barH / 2;   // progress bar y coordinate (origin is 0, 0)
        bgBar.setPosition(barX, barY);
        bgBar.fillStyle(0x4888b7, 1);
        bgBar.fillRect(0, 0, barW, barH);    // position is 0, 0 as it was already set with ".setPosition()"

        // progress bar
        let progressBar = this.add.graphics();
        progressBar.setPosition(barX, barY);

        // listen to the 'progress' event (fires every time an asset is loaded and 'value' is the relative progress)
        this.load.on('progress', function(value) {

            // clearing progress bar (to draw it again)
            progressBar.clear();

            // set style
            progressBar.fillStyle(0x8cefb6, 1);

            // draw rectangle
            progressBar.fillRect(0, 0, value * barW, barH);

        }, this);

        // load images
        this.load.image('background', 'assets/images/background.png');  // game background
        this.load.image('menu', 'assets/images/Menu.png');  // game background
        this.load.image('danger', 'assets/images/Danger.png');          // danger block
        this.load.image('indicator', 'assets/images/Indicator.png');    // indicator
        this.load.image('pointer', 'assets/images/Pointer.png');        // pointer
        this.load.image('arrow', 'assets/images/Arrow.png');            // arrow
        this.load.image('frame', 'assets/images/Frame.png');            // frame (for text)

        // load spritesheets
        this.load.spritesheet('block1', 'assets/images/Block1.png', {frameWidth: 25, frameHeight: 25});             // block 1 (normal)
        this.load.spritesheet('block2', 'assets/images/Block2.png', {frameWidth: 25, frameHeight: 25});             // block 2 (pirate)
        this.load.spritesheet('block3', 'assets/images/Block3.png', {frameWidth: 25, frameHeight: 25});             // block 3 (glasses)
        this.load.spritesheet('checkpoint', 'assets/images/Checkpoints.png', {frameWidth: 25, frameHeight: 25});    // checkpoints
        this.load.spritesheet('eyes', 'assets/images/Eyes.png', {frameWidth: 240, frameHeight: 44});              // Eyes

        // load audio
        this.load.audio('cnorm', 'assets/audio/Cnorm.mp3');
        this.load.audio('fnorm', 'assets/audio/Fnorm.mp3');
        this.load.audio('gnorm', 'assets/audio/Gnorm.mp3');
        this.load.audio('anorm', 'assets/audio/Anorm.mp3');
        this.load.audio('cfast', 'assets/audio/Cfast.mp3');
        this.load.audio('ffast', 'assets/audio/Ffast.mp3');
        this.load.audio('gfast', 'assets/audio/Gfast.mp3');
        this.load.audio('afast', 'assets/audio/Afast.mp3');
        this.load.audio('cmenu', 'assets/audio/Cmenu.mp3');
        this.load.audio('fmenu', 'assets/audio/Fmenu.mp3');
        this.load.audio('gmenu', 'assets/audio/Gmenu.mp3');
        this.load.audio('amenu', 'assets/audio/Amenu.mp3');
        this.load.audio('gameover', 'assets/audio/GameOver.mp3');
        this.load.audio('level', 'assets/audio/LevelComplete.mp3');
        this.load.audio('mission', 'assets/audio/Mission.mp3');

    }

    /**
     * change to "Home" scene
     */
    create() {

        // add animations
        this.addAnimations();

        this.scene.start('Home');
    }

    addAnimations() {

        // eyes animations
        let frameRate = 50;

        this.anims.create({
            key: 'midToRight',
            frames: this.anims.generateFrameNames('eyes', {frames: [0, 1, 2, 3, 4, 5]}),
            frameRate: frameRate,
            paused: true
        });

        this.anims.create({
            key: 'rightToMid',
            frames: this.anims.generateFrameNames('eyes', {frames: [5, 4, 3, 2, 1, 0]}),
            frameRate: frameRate,
            paused: true
        });

        this.anims.create({
            key: 'midToLeft',
            frames: this.anims.generateFrameNames('eyes', {frames: [0, 6, 7, 8, 9, 10]}),
            frameRate: frameRate,
            paused: true
        });

        this.anims.create({
            key: 'leftToMid',
            frames: this.anims.generateFrameNames('eyes', {frames: [10, 9, 8, 7, 6, 0]}),
            frameRate: frameRate,
            paused: true
        });

        this.anims.create({
            key: 'leftToRight',
            frames: this.anims.generateFrameNames('eyes', {frames: [10, 9, 8, 7, 6, 0, 1, 2, 3, 4, 5]}),
            frameRate: frameRate,
            paused: true
        });

        this.anims.create({
            key: 'rightToLeft',
            frames: this.anims.generateFrameNames('eyes', {frames: [5, 4, 3, 2, 1, 0, 6, 7, 8, 9, 10]}),
            frameRate: frameRate,
            paused: true
        });

    }

}