import TextStyle from "../helper/textStyles";
import MusicPlayer from "../helper/musicPlayer";

/**
 * "Home" scene: Main game menu scene
 */
export default class gameScene extends Phaser.Scene {

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

        // Title
        this.title = this.add.text(this.gw / 2, this.gh * 0.2, 'Inspection in Sector 723', this.styles.get(7))
            .setOrigin(0.5, 0.5);

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
                console.log('How to play!');
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