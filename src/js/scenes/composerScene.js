import TextStyle from "../helper/textStyles";
import MusicPlayer from "../helper/musicPlayer";
import Frame from "../helper/frame";

/**
 * "Composer" scene: Main game menu scene
 */
export default class homeScene extends Phaser.Scene {

    /**
     * Constructor
     */
    constructor() {
        super({
            key: 'Composer'
        });
    }

    init(data) {

        this.musicMenu = data.musicMenu;
        this.musicPlaying = data.musicPlaying;

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
        this.title = this.add.text(this.gw / 2, this.gh * 0.15, 'Music Composer', this.styles.get(7))
            .setOrigin(0.5, 0.5);

        this.instruction = this.add.text(this.gw / 2, this.gh * 0.30, 'Change the chord progression of the music!', this.styles.get(5)).setOrigin(0.5, 0.5);

        // Instruction text
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

        // highlighter
        this.highlighter = this.add.rectangle(this.xStart, this.yPosition + this.highlighterOffsetY, 50, 40).setOrigin(0.5).setDepth(2);
        this.highlighter.setStrokeStyle(4, 0x8cefb6);
        this.selected = 0;

        // note
        this.note = this.add.sprite(this.xStart, this.yPosition + this.noteOffsetY, 'note').setOrigin(0.5);

        // add tweens
        this.addTweens();

        // add frame if webmonetization is not available
        this.frameVisible = true;

        this.frame = new Frame(this, 320, 240, 470, 290, 'Web Monetization','This content is Web-Monetized.\n\n' +
            'The Block universe needs some money to pay their mighty Inspectors.\n To support the Block universes and get access to the Music Composer get your coil subscription on coil.com.', this.styles);

        this.frame.changePressText('Press [BACKSPACE] to go back to Main Menu');

        this.eyes = this.add.image(this.frame.x, this.frame.y + 60, 'eyes', 0).setDepth(3);

        if (document.monetization) {

            this.eyes.destroy();

            this.frame.changeText('Thank you!', 'This content is Web-Monetized.\n\n' +
            'Coil subscription was detected! All inhabitants of the Block universe thank you for the support!');
            this.frame.changePressText('Press [SPACE] or [ENTER] to start composing');

            this.block1 = this.add.image(this.frame.x - 50, this.frame.y + 45, 'block1', 1).setDepth(3);
            this.block2 = this.add.image(this.frame.x, this.frame.y + 45, 'block2', 1).setDepth(3);
            this.block3 = this.add.image(this.frame.x + 50, this.frame.y + 45, 'block3', 1).setDepth(3);

        }

    }

    update(time, delta) {

        this.note.setX(this.xStart + this.musicMenu.playing * this.distance);

    }

    drawSequence() {

        this.chords = ['C', 'F', 'G', 'Am'];

        // get the current sequence
        this.sequence = this.musicMenu.getSequence();

        this.chordTexts = [];
        let chord;

        for (let i in this.sequence) {

            chord = this.add.text(this.xStart + i * this.distance, this.yPosition, this.chords[this.sequence[i]], this.styles.get(7)).setOrigin(0.5);
            this.chordTexts.push(chord);

        }

    }

    addTweens() {

        // mirror image of title
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
     * Select the next chord (left)
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
     * Select the previous chord (right)
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
     * Highlights the selected entry (changing the styles of the deselected and selected entries)
     */
    highlightSelected() {

        this.highlighter.setPosition(this.xStart + this.selected * this.distance, this.yPosition + this.highlighterOffsetY);

    }

    /**
     * Add keyboard input to the scene.
     */
    addKeys() {

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

        // backspace
        this.input.keyboard.addKey('Backspace').on('down', function() { this.backKey() }, this);

    }

    /**
     * Action which happens when the enter or space key is pressed.
     */
    spaceEnterKey() {

        if (this.frameVisible) {
            this.frame.visible(false);
            this.frameVisible = false;

            this.block1.destroy();
            this.block2.destroy();
            this.block3.destroy();

        }
        else {
            let chordNumber = this.sequence[this.selected];

            chordNumber++;

            if (chordNumber >= this.chords.length) {
                chordNumber = 0;
            }

            this.chordTexts[this.selected].setText(this.chords[chordNumber]);

            this.musicMenu.changeChord(this.selected, chordNumber);
            this.musicPlaying.changeChord(this.selected, chordNumber);
        }

    }

    backKey() {

        this.musicMenu.stop();
        this.scene.start('Home', {sequence: this.musicMenu.getSequence()});

    }

}