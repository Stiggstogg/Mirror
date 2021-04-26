import TextStyle from "../helper/textStyles";
import Frame from "../helper/frame";

/**
 * "Composer" scene: Scene for the Music Composer
 */
export default class homeScene extends Phaser.Scene {

    /**
     * Constructor
     * @constructor
     */
    constructor() {
        super({
            key: 'Composer'
        });
    }

    /**
     * Initialize. Get data from the previous scene (music)
     * @param {Object} data - data object containing the musics (from menu and playing)
     */
    init(data) {

        // get music and store it
        this.musicMenu = data.musicMenu;
        this.musicPlaying = data.musicPlaying;

    }

    /**
     * Creates all objects of this scene
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
        this.title = this.add.text(this.gw / 2, this.gh * 0.15, 'Music Composer', this.styles.get(7))
            .setOrigin(0.5, 0.5);

        // Composer instruction text
        this.instruction = this.add.text(this.gw / 2, this.gh * 0.25, 'Change the chord progression of the music!', this.styles.get(5)).setOrigin(0.5, 0.5);

        // Keyboard explanation text
        this.add.text(this.gw / 2, this.gh - 60,
            'Use arrow left / right or W / A to move along the progression\n' +
            'Press [SPACE] or [ENTER] to change the chord\n' +
            'Press [BACKSPACE] to go back to Main Menu', this.styles.get(1)).setOrigin(0.5);

        // Add keyboard inputs
        this.addKeys();

        // Position of chords
        this.distance = 60;
        this.xStart = 100;
        this.yPosition = this.gh * 0.55;
        this.highlighterOffsetY = 2;
        this.noteOffsetY = -40;

        // draw chord sequence
        this.drawSequence();

        // highlighter (highlights which chord is selected)
        this.highlighter = this.add.rectangle(this.xStart, this.yPosition + this.highlighterOffsetY, 50, 40).setOrigin(0.5).setDepth(2);
        this.highlighter.setStrokeStyle(4, 0x8cefb6);
        this.selected = 0;

        // note (is shown above the currently playing chord)
        this.note = this.add.sprite(this.xStart, this.yPosition + this.noteOffsetY, 'note').setOrigin(0.5);

        // add tweens (tween for note)
        this.addTweens();

        // add frame if web monetization is not available
        this.frameVisible = true;

        this.frame = new Frame(this, 320, 287, 470, 290, 'Web-Monetization','This content is Web-Monetized.\n\n' +
            'The Block universe needs some money to pay their mighty Inspectors.\nTo support the Block universe and get access to the Music Composer get your coil subscription on coil.com.', this.styles);

        this.frame.changePressText('Press [BACKSPACE] to go back to Main Menu');

        this.eyes = this.add.image(this.frame.x, this.frame.y + 60, 'eyes', 0).setDepth(3); // add eyes

        // change frame text when web monetization is available (thank you message)
        if (document.monetization) {

            this.eyes.destroy();

            this.frame.changeText('Thank you!', 'This content is Web-Monetized.\n\n' +
            'Coil subscription was detected! All inhabitants of the Block universe thank you for the support!');
            this.frame.changePressText('Press [SPACE] or [ENTER] to start composing');

            this.block1 = this.add.image(this.frame.x - 50, this.frame.y + 45, 'block1', 1).setDepth(3);    // add blocks
            this.block2 = this.add.image(this.frame.x, this.frame.y + 45, 'block2', 1).setDepth(3);
            this.block3 = this.add.image(this.frame.x + 50, this.frame.y + 45, 'block3', 1).setDepth(3);

        }

    }

    /**
     * Update function for the game loop
     * @param {number} time
     * @param {number} delta
     */
    update(time, delta) {

        // place the note above the currently playing chord
        this.note.setX(this.xStart + this.musicMenu.playing * this.distance);

    }

    /**
     * Draws the currently used sequence
     */
    drawSequence() {

        // chords which are used in the sequence (in the correct order!)
        this.chords = ['C', 'F', 'G', 'Am'];

        // get the current sequence
        this.sequence = this.musicMenu.getSequence();

        this.chordTexts = [];
        let chord;

        // draw each chord of the sequence
        for (let i in this.sequence) {

            chord = this.add.text(this.xStart + i * this.distance, this.yPosition, this.chords[this.sequence[i]], this.styles.get(7)).setOrigin(0.5);
            this.chordTexts.push(chord);

        }

    }

    /**
     * Adds the tween for the "jumping" note
     */
    addTweens() {

        // jumping note tween
        this.tweens.add({
            targets: this.note,
            y: this.yPosition + this.noteOffsetY - 20,
            duration: 250,
            paused: false,
            yoyo: true,
            repeat: -1,
            ease: 'Quart.easeIn'
        });

    }

    /**
     * Select the next chord (right)
     */
    selectNext() {

        // select the next, or if it is the last entry select the first again
        if (this.selected >= this.sequence.length - 1) {
            this.selected = 0;
        }
        else {
            this.selected++;
        }

        // highlight the selected entry
        this.highlightSelected();

    }

    /**
     * Select the previous chord (left)
     */
    selectPrevious() {

        // select the previous, or if it is the first entry select the last again
        if (this.selected <= 0) {
            this.selected = this.sequence.length -1;
        }
        else {
            this.selected--;
        }

        // highlight the selected entry
        this.highlightSelected();

    }

    /**
     * Highlights the selected entry (adding a frame around it)
     */
    highlightSelected() {

        this.highlighter.setPosition(this.xStart + this.selected * this.distance, this.yPosition + this.highlighterOffsetY);

    }

    /**
     * Add keyboard input to the scene.
     */
    addKeys() {

        // only make right / left, A / D and Enter / Space keys available if web monetization is available
        if (document.monetization) {
            // up and down keys
            this.input.keyboard.addKey('Right').on('down', function() { this.selectNext() }, this);
            this.input.keyboard.addKey('D').on('down', function() { this.selectNext() }, this);
            this.input.keyboard.addKey('Left').on('down', function() { this.selectPrevious() }, this);
            this.input.keyboard.addKey('A').on('down', function() { this.selectPrevious() }, this);

            // enter and space key
            this.input.keyboard.addKey('Enter').on('down', function() { this.spaceEnterKey() }, this);
            this.input.keyboard.addKey('Space').on('down', function() { this.spaceEnterKey() }, this);
        }

        // backspace (can always be pressed)
        this.input.keyboard.addKey('Backspace').on('down', function() { this.backKey() }, this);

    }

    /**
     * Action which happens when the enter or space key is pressed. Triggers only when web monetization is available
     */
    spaceEnterKey() {

        // if the frame is still visible make it invisible and destrois the blocks.
        // else: change the chord in the progression
        if (this.frameVisible) {
            this.frame.visible(false);
            this.frameVisible = false;

            // destroy blocks
            this.block1.destroy();
            this.block2.destroy();
            this.block3.destroy();

        }
        else {
            // get the chord number (0 for "C", 1 for "F",...) of the currently selected chord
            let chordNumber = this.sequence[this.selected];

            // change it to the next chord
            chordNumber++;

            // if it is higher then the number of chords change it to the first chord
            if (chordNumber >= this.chords.length) {
                chordNumber = 0;
            }

            // change the text of this chord to the new chord text
            this.chordTexts[this.selected].setText(this.chords[chordNumber]);

            // change this chord in the music
            this.musicMenu.changeChord(this.selected, chordNumber);
            this.musicPlaying.changeChord(this.selected, chordNumber);
        }

    }

    /**
     * Action which happens when the backspace key is pressed. Go back to main menu
     */
    backKey() {

        // stop the music
        this.musicMenu.stop();

        // go back to the main menu, but provide the new chord progression to it
        this.scene.start('Home', {sequence: this.musicMenu.getSequence()});

    }

}