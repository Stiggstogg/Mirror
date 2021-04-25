import TextStyle from "../helper/textStyles";
import MusicPlayer from "../helper/musicPlayer";

/**
 * "Home" scene: Main game menu scene
 */
export default class homeScene extends Phaser.Scene {

    /**
     * Constructor
     */
    constructor() {
        super({
            key: 'Home'
        });
    }

    /**
     * Shows the home screen and waits for the the user to start the game
     */
    create() {

        // get game width and height
        this.gw = this.sys.game.config.width;
        this.gh = this.sys.game.config.height;

        // text styles
        this.styles = new TextStyle();

        // add background
        this.add.image(0, 0, 'menu').setOrigin(0, 0);

        // Title
        this.title = this.add.text(this.gw / 2, this.gh * 0.2, 'Inspection in Sector 723', this.styles.get(7))
            .setOrigin(0.5, 0.5);

        this.titleFlipped = this.add.text(this.gw / 2, this.gh * 0.2 + 35, 'Inspection in Sector 723', this.styles.get(7))
            .setOrigin(0.5, 0.5).setFlipY(true).setAlpha(0);

        // eyes
        this.eyes = this.add.sprite(this.gw / 2, 360, 'eyes', 5).setOrigin(0.5);
        this.eyesRight = true;
        this.eyeAnimTime = 2280;

        // blocks
        this.block1left = this.add.sprite(this.gw / 2 - 250, 360, 'block1', 1);
        this.block2left = this.add.sprite(this.gw / 2 - 180, 360, 'block2', 1);
        this.block1right = this.add.sprite(this.gw / 2 + 250, 360, 'block1', 1).setFlipX(true);
        this.block2right = this.add.sprite(this.gw / 2 + 180, 360, 'block2', 1).setFlipX(true);

        // Instruction text
        this.add.text(this.gw / 2, this.gh - 46,
            'Use arrow keys or W, A, S, D to select\nUse [SPACE] or [ENTER] to confirm', this.styles.get(1)).setOrigin(0.5);

        // Menu
        this.createMenu([
            'Start',
            'How to Play'
        ]);

        // Add keyboard inputs
        this.addKeys();

        // Sound
        this.addSound();
        this.musicMenu.start();

        // add tweens
        this.addTweens();

    }

    /**
     * Creates the menu with its entries and sets the styles for it
     * @param {string[]} menuEntries - entries which should appear in the menu
     */
    createMenu(menuEntries) {

        // styles of the menu entries (active or inactive)
        this.inactiveStyle = this.styles.get(8);
        this.activeStyle = this.styles.get(9);

        // position and space between
        let start = {x: this.gw / 2, y: this.title.y + this.gh * 0.2};
        let ySpace = this.gh * 0.1;

        this.items = [];

        // create menu items
        for (let i in menuEntries) {
            this.items.push(this.add.text(start.x, start.y + i * ySpace, menuEntries[i])
                .setOrigin(0.5));
        }

        this.selected = 0;
        this.highlightSelected();
    }

    addTweens() {

        // mirror image of title
        this.tweens.add({
            targets: this.titleFlipped,
            delay: 1000,
            repeatDelay: 1000,
            alpha: 1,
            duration: 500,
            paused: false,
            yoyo: true,
            repeat: -1,
            ease: 'Expo.easeIn'
        });

        // eyes
        this.eyes.playAfterDelay('rightToLeft', this.eyeAnimTime);

        this.eyes.on('animationcomplete', function(){
           this.eyesRight = !this.eyesRight;

           if (this.eyesRight) {
               this.eyes.playAfterDelay('rightToLeft', this.eyeAnimTime);
           }
           else {
               this.eyes.playAfterDelay('leftToRight', this.eyeAnimTime);
           }

        }, this);

        // block 1 left
        this.block1left.jump = this.tweens.add({
            targets: this.block1left, delay: 0, repeatDelay: 500, y: 330, duration: 400, paused: true, yoyo: true, repeat: 1, ease: 'Cubic.easeOut'});

        // block 1 right
        this.block1right.jump = this.tweens.add({
            targets: this.block1right, delay: 2500, repeatDelay: 500, y: 330, duration: 400, paused: true, yoyo: true, repeat: 1, ease: 'Cubic.easeOut'});

        // block 2 left
        this.block2left.jump = this.tweens.add({
            targets: this.block2left, delay: 0, repeatDelay: 100, y: 320, duration: 200, paused: true, yoyo: true, repeat: 2, ease: 'Cubic.easeOut'});

        // block 2 right
        this.block2right.jump = this.tweens.add({
            targets: this.block2right, delay: 2500, repeatDelay:100, y: 320, duration: 200, paused: true, yoyo: true, repeat: 2, ease: 'Cubic.easeOut'});

        // add timed event for repetition
        this.time.addEvent({delay: 5000, repeat: -1, callbackScope: this, callback: function () {
            this.block1left.jump.play();
            this.block1right.jump.play();
            this.block2left.jump.play();
            this.block2right.jump.play();
            }});

        // perform the first jump
        this.block1left.jump.play();
        this.block1right.jump.play();
        this.block2left.jump.play();
        this.block2right.jump.play();





    }

    /**
     * Select the next menu entry
     */
    selectNext() {

        // select the next, or if it is the last entry select the first again
        if (this.selected >= this.items.length - 1) {
            this.selected = 0;
        }
        else {
            this.selected++;
        }

        // highlight the selected entry
        this.highlightSelected();

    }

    /**
     * Select the previous menu entry
     */
    selectPrevious() {

        // select the previous, or if it is the first entry select the last again
        if (this.selected <= 0) {
            this.selected = this.items.length -1;
        }
        else {
            this.selected--;
        }

        // highlight the selected entry
        this.highlightSelected();

    }

    /**
     * Highlights the selected entry (changing the styles of the deselected and selected entries)
     */
    highlightSelected() {

        for (let i in this.items) {
            this.items[i].setStyle(this.inactiveStyle);         // change the style of all entries to the inactive style
        }

        this.items[this.selected].setStyle(this.activeStyle);   // change the style of the selected entry to the active style

    }

    /**
     * Add keyboard input to the scene.
     */
    addKeys() {

        // up and down keys
        this.input.keyboard.addKey('Down').on('down', function() { this.selectNext() }, this);
        this.input.keyboard.addKey('W').on('down', function() { this.selectNext() }, this);
        this.input.keyboard.addKey('Up').on('down', function() { this.selectPrevious() }, this);
        this.input.keyboard.addKey('S').on('down', function() { this.selectPrevious() }, this);

        // enter and space key
        this.input.keyboard.addKey('Enter').on('down', function() { this.spaceEnterKey() }, this);
        this.input.keyboard.addKey('Space').on('down', function() { this.spaceEnterKey() }, this);

    }

    /**
     * Action which happens when the enter or space key is pressed.
     */
    spaceEnterKey() {

        switch(this.selected) {
            case 0:
                this.startGame();
                break;
            case 1:
                this.scene.start('Howto', {musicMenu: this.musicMenu});
                break;
            default:
                this.startGame();
                break;
        }

    }

    /**
     * Start the game
     */
    startGame() {
        this.scene.start('Game', {newGame: true, finished: false, musicMenu: this.musicMenu, musicPlaying: this.musicPlaying});
    }

    /**
     * add music
     */
    addSound() {
        this.musicMenu = new MusicPlayer(this, [
            ['cmenu'],
            ['fmenu'],
            ['gmenu'],
            ['amenu']
        ],[0, 1, 2, 3]);

        this.musicPlaying = new MusicPlayer(this, [
            ['cnorm', 'cfast'],
            ['fnorm', 'ffast'],
            ['gnorm', 'gfast'],
            ['anorm', 'afast'],
        ], [0, 1, 2, 3]);
    }


}