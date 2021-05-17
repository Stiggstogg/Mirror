import TextStyle from "../helper/textStyles";
import MusicPlayer from "../helper/musicPlayer";

/**
 * "Home" scene: Main game menu scene
 */
export default class homeScene extends Phaser.Scene {

    /**
     * Constructor
     * @constructor
     */
    constructor() {
        super({
            key: 'Home'
        });
    }

    /**
     * Get data from the previous scene (chord sequence)
     * @param {Object} data - data object containing the chord sequence
     */
    init(data) {

        this.sequence = data.sequence;      // chord sequence

    }

    /**
     * Shows the home screen and waits for the the user to select a menu entry
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

        // mirror image of the title (tween will be added later)
        this.titleFlipped = this.add.text(this.gw / 2, this.gh * 0.2 + 35, 'Inspection in Sector 723', this.styles.get(7))
            .setOrigin(0.5, 0.5).setFlipY(true).setAlpha(0);

        // eyes (tween will be added later)
        this.eyes = this.add.sprite(this.gw / 2, 360, 'eyes', 5).setOrigin(0.5);    // sprite (looking to the right)
        this.eyesRight = true;                                                                           // are the eyes looking to the right? In the beginning: yes, they start at right
        this.eyeAnimTime = 2280;                                                                         // delay until the eyes move again. In total the animation including the delay takes 2500 ms (delay start after the animation which has 11 frames)

        // blocks (tween will be added later)
        this.block1left = this.add.sprite(this.gw / 2 - 250, 360, 'block1', 1);
        this.block2left = this.add.sprite(this.gw / 2 - 180, 360, 'block2', 1);
        this.block1right = this.add.sprite(this.gw / 2 + 250, 360, 'block1', 1).setFlipX(true);
        this.block2right = this.add.sprite(this.gw / 2 + 180, 360, 'block2', 1).setFlipX(true);

        // Instruction / press key text
        this.add.text(this.gw / 2, this.gh - 46,
            'Use arrow keys or W, A, S, D to select\nUse [SPACE] or [ENTER] to confirm', this.styles.get(1)).setOrigin(0.5);

        // Create the menu with it's entries
        this.createMenu([
            'Start (2 Player Co-op)',
            'How to Play',
            'Composer'
        ]);

        // Add keyboard inputs
        this.addKeys();

        // Sound
        this.addSound();
        this.musicMenu.start();     // start the menu music

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

        // start position and y space between the entries
        let start = {x: this.gw / 2, y: this.title.y + this.gh * 0.2};      // start position
        let ySpace = this.gh * 0.1;                                         // ySpace between the entries

        this.items = [];

        // create menu items (loop through each item)
        for (let i in menuEntries) {
            this.items.push(this.add.text(start.x, start.y + i * ySpace, menuEntries[i])
                .setOrigin(0.5));
        }

        this.selected = 0;              // set which entry is selected (0: first one)
        this.highlightSelected();       // highlight the selected entry
    }

    /**
     * Adds all the tweens of the home scene
     */
    addTweens() {

        // mirror image of title (flickering mirror image)
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

        // eyes (of the inspector)
        this.eyes.playAfterDelay('rightToLeft', this.eyeAnimTime);      // move the eyes from right to left (animation) after a delay

        this.eyes.on('animationcomplete', function(){               // listener is added to listen for the animation complete event. This creates an infinite loop of animations
           this.eyesRight = !this.eyesRight;                                 // toggle the orientation of the eyes

           if (this.eyesRight) {                                                // if the eyes are right move the eyes from right to left (animation) after a delay
               this.eyes.playAfterDelay('rightToLeft', this.eyeAnimTime);
           }
           else {                                                               // if the eyes are left move the eyes from left to right (animation) after a delay
               this.eyes.playAfterDelay('leftToRight', this.eyeAnimTime);
           }

        }, this);

        // create the tweens for the blocks (jumping when the inspector is not looking in their direction)
        // the tweens are created only for one execution (block 1 jumps twice, block two jumps three times)
        // The repetion of every cycle is afterwards added with a timed event which triggers the jumps again
        this.block1left.jump = this.tweens.add({                // block 1 left
            targets: this.block1left, delay: 0, repeatDelay: 500, y: 330, duration: 400, paused: true, yoyo: true, repeat: 1, ease: 'Cubic.easeOut'});

        this.block1right.jump = this.tweens.add({               // block 1 right
            targets: this.block1right, delay: 2500, repeatDelay: 500, y: 330, duration: 400, paused: true, yoyo: true, repeat: 1, ease: 'Cubic.easeOut'});

        this.block2left.jump = this.tweens.add({                // block 2 left
            targets: this.block2left, delay: 0, repeatDelay: 100, y: 320, duration: 200, paused: true, yoyo: true, repeat: 2, ease: 'Cubic.easeOut'});

        this.block2right.jump = this.tweens.add({               // block 2 right
            targets: this.block2right, delay: 2500, repeatDelay:100, y: 320, duration: 200, paused: true, yoyo: true, repeat: 2, ease: 'Cubic.easeOut'});

        // add timed event for the repetition of the jumps
        this.time.addEvent({delay: 5000, repeat: -1, callbackScope: this, callback: function () {
            this.block1left.jump.play();
            this.block1right.jump.play();
            this.block2left.jump.play();
            this.block2right.jump.play();
        }});

        // perform the first jump (not performed as the first execution happens after the delay)
        this.block1left.jump.play();
        this.block1right.jump.play();
        this.block2left.jump.play();
        this.block2right.jump.play();

    }

    /**
     * Select the next menu entry (when clicking down)
     */
    selectNext() {

        // select the next, or if it is the last entry select the first again
        if (this.selected >= this.items.length - 1) {
            this.selected = 0;              // select the first entry
        }
        else {
            this.selected++;                // select the previous entry
        }

        // highlight the selected entry
        this.highlightSelected();

    }

    /**
     * Select the previous menu entry (when clicking up)
     */
    selectPrevious() {

        // select the previous, or if it is the first entry select the last again
        if (this.selected <= 0) {
            this.selected = this.items.length -1;   // select the last entry
        }
        else {
            this.selected--;                        // select the previous entry
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

        // up and down keys (moving the selection of the entries)
        this.input.keyboard.addKey('Down').on('down', function() { this.selectNext() }, this);
        this.input.keyboard.addKey('S').on('down', function() { this.selectNext() }, this);
        this.input.keyboard.addKey('Up').on('down', function() { this.selectPrevious() }, this);
        this.input.keyboard.addKey('W').on('down', function() { this.selectPrevious() }, this);

        // enter and space key (confirming a selection)
        this.input.keyboard.addKey('Enter').on('down', function() { this.spaceEnterKey() }, this);
        this.input.keyboard.addKey('Space').on('down', function() { this.spaceEnterKey() }, this);

    }

    /**
     * Action which happens when the enter or space key is pressed.
     */
    spaceEnterKey() {

        switch(this.selected) {
            case 0:                 // start the game when the first entry is selected ("Start")
                this.startGame();
                break;
            case 1:                 // start the "Howto" scene when the "How To Play" entry is selected
                this.scene.start('Howto', {musicMenu: this.musicMenu});
                break;
            case 2:                 // start the "Composer" scene when the "Music Composer" entry is selected
                this.scene.start('Composer', {musicMenu: this.musicMenu, musicPlaying: this.musicPlaying});
                break;
            default:
                this.startGame();   // start the game by default
                break;
        }

    }

    /**
     * Starts the main game sceen with all parameters
     */
    startGame() {
        // starts the main game scene with all the parameters:
        // newGame: true as it is always a new game when coming from the home screen
        // finished: false as the game is not finished when coming from the home screen
        // musicMenu: the menu music (created in this scene)
        // musicPlaying: the playing music (created in this scene)
        this.scene.start('Game', {newGame: true, finished: false, musicMenu: this.musicMenu, musicPlaying: this.musicPlaying});
    }

    /**
     * Creates the music using the current chord progression (sequence)
     */
    addSound() {
        // creates the menu music, using the current chord progression (sequence)
        this.musicMenu = new MusicPlayer(this, [
            ['cmenu'],
            ['fmenu'],
            ['gmenu'],
            ['amenu']
        ], this.sequence);

        // creates the playing music (with its two tempi), using the current chord progression (sequence)
        this.musicPlaying = new MusicPlayer(this, [
            ['cnorm', 'cfast'],
            ['fnorm', 'ffast'],
            ['gnorm', 'gfast'],
            ['anorm', 'afast'],
        ], this.sequence);
    }

    /**
     * Starts the menu music only when it is save to start (no other music runing)
     */
    saveStartMenuMusic() {

        // Only start the menu music when no other music is playing. TODO: This is a dirty workaround to get rid of some timing bugs when changing scenes, to avoid having to music playing at the same time. It should be addressed properly, e.g. global variable? Additionally this may lead to the bug that the playing music is played in the menu
        if (!this.musicMenu.isPlaying && !this.musicPlaying.isPlaying) {
            this.musicMenu.start();
        }

    }

}