import TextStyle from "../helper/textStyles";
import Levels from "../helper/levels";
import Frame from "../helper/frame";

/**
 * "How to Play" scene: Show how to play the game
 */
export default class howtoScene extends Phaser.Scene {

    /**
     * Constructor
     */
    constructor() {
        super({
            key: 'Howto'
        });
    }

    init(data) {

        // parameters for the level drawing
        this.originLeft = {x: 10, y: 10};                       // origin of the left side (top left) (px)
        this.originRight = {x: 630, y: this.originLeft.y};      // origin of the right side (top right) (px)
        this.gridSize = 12.5;                                   // size of the grid to place objects (px)

        this.musicMenu = data.musicMenu;                        // get the menu music

    }

    /**
     * Shows the home screen and waits for the the user to start the game
     */
    create() {

        // text styles
        this.styles = new TextStyle();

        // add background
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        // draw level (non-interactive)
        this.level = new Levels(this.originLeft, this.originRight, this.gridSize);
        this.level.createNonInteractiveLevel(this);

        // add indicator
        let indicator = this.add.image(485, 400, 'indicator').setOrigin(0.5);
        this.mirrorPointer = this.add.sprite(indicator.x - indicator.width / 2 + 12, indicator.y + indicator.height / 2 - 14, 'pointer').setOrigin(0.5);

        // add eyes
        this.eyes = this.add.sprite(485, 345, 'eyes', 0).setOrigin(0.5);

        // add eyes
        this.add.text(485, 445, '00:00', this.styles.get(2)).setOrigin(0.5);

        // Add keyboard inputs
        this.addKeys();

        // Add frame
        this.frame = new Frame(this, 320, 240, 470, 290, 'Title','Text', this.styles);

        // Highlighters
        this.highlighter = this.add.rectangle(8, 8, 304, 304).setOrigin(0).setDepth(1.5);
        this.highlighter.setStrokeStyle(4, 0x8cefb6);
        this.highlighterColors = [0x8cefb6, 0x474476, 0x6dbcb9, 0x4888b7];
        this.highlighterCounter = 0;
        this.highlighter.setVisible(false);

        this.highlighter2 = this.add.rectangle(8, 8, 304, 304).setOrigin(0).setDepth(1.5);
        this.highlighter2.setStrokeStyle(4, 0x8cefb6);
        this.highlighter2.setVisible(false);

        // change color of the highlighter
        this.time.addEvent({
            delay: 300,
            repeat: -1, // -1 means it will repeat forever
            callback: function () {

                if (this.highlighterCounter < this.highlighterColors.length - 1) {
                    this.highlighterCounter++;
                }
                else {
                    this.highlighterCounter = 0;
                }

                this.highlighter.setStrokeStyle(4, this.highlighterColors[this.highlighterCounter]);
                this.highlighter2.setStrokeStyle(4, this.highlighterColors[this.highlighterCounter]);

            },
            callbackScope: this
        });


        // add object array
        this.objectArray = [];

        // Stage
        this.stage = 0;

        // start first stage
        this.spaceEnterKey();


    }

    update(time, delta) {

    }

    /**
     * Add keyboard input to the scene.
     */
    addKeys() {

        // enter and space key
        this.input.keyboard.addKey('Enter').on('down', function() { this.spaceEnterKey() }, this);
        this.input.keyboard.addKey('Space').on('down', function() { this.spaceEnterKey() }, this);
        this.input.keyboard.addKey('Esc').on('down', function() { this.escKey() }, this);

    }

    /**
     * Action which happens when the enter or space key is pressed.
     */
    spaceEnterKey() {

        switch(this.stage) {
            case 0:
                this.stage++;

                this.frame.changeText('Story', 'The Block universe is divided into 5879 sectors and ruled by the mighty Inspectors.');
                this.objectArray.push(this.add.image(this.frame.x, this.frame.y + 10, 'eyes', 0).setDepth(3));

                break;
            case 1:
                this.stage++;
                this.destroyAll();

                this.frame.changeText('Story', 'Each sector is inhabited by multiple blocks and contains one huge mirror.');
                this.objectArray.push(this.add.image(this.frame.x - 50, this.frame.y + 10, 'block1', 1).setDepth(3));
                this.objectArray.push(this.add.image(this.frame.x, this.frame.y + 10, 'block2', 1).setDepth(3));
                this.objectArray.push(this.add.image(this.frame.x + 50, this.frame.y + 10, 'block3', 1).setDepth(3));

                break;
            case 2:
                this.stage++;
                this.destroyAll();

                this.frame.changeText('Story', 'Every day the blocks get tasks from the Inspectors which they need to fulfil. ' +
                    'These tasks consist of visiting and touching the three holy pictures Tree, Rocket and Potato in a specific order. ' +
                    'While doing that they should not touch each other and the dangerous X blocks.');
                this.objectArray.push(this.add.image(this.frame.x , this.frame.y + 23, 'checkpoint', 0).setDepth(3));
                this.objectArray.push(this.add.image(this.frame.x + 50, this.frame.y + 23, 'checkpoint', 1).setDepth(3));
                this.objectArray.push(this.add.image(this.frame.x + 100, this.frame.y + 23, 'checkpoint', 2).setDepth(3));
                this.objectArray.push(this.add.image(this.frame.x + 50, this.frame.y + 57, 'danger', 0).setDepth(3));

                break;
            case 3:
                this.stage++;
                this.destroyAll();

                this.frame.changeText('Story', 'If the blocks do not fulfil their tasks, they will receive the maximum penalty: ' +
                    'They will be transformed into circles!');

                this.objectArray.push(this.add.image(this.frame.x - 50, this.frame.y + 10, 'block1', 1).setDepth(3));
                this.objectArray.push(this.add.image(this.frame.x, this.frame.y + 10, 'block2', 1).setDepth(3));
                this.objectArray.push(this.add.image(this.frame.x + 50, this.frame.y + 10, 'block3', 1).setDepth(3));

                let round = false;

                this.squareToRound = this.time.addEvent({
                    delay: 1000,
                    repeat: -1,
                    callback: function() {
                        if (round) {
                            this.objectArray[0].setFrame(1);
                            this.objectArray[1].setFrame(1);
                            this.objectArray[2].setFrame(1);
                        }
                        else {
                            this.objectArray[0].setFrame(2);
                            this.objectArray[1].setFrame(2);
                            this.objectArray[2].setFrame(2);
                        }

                        round = !round;

                    },
                    callbackScope: this
                });


                break;
            case 4:
                this.squareToRound.destroy();
                this.stage++;
                this.destroyAll();

                this.frame.changeText('Story', 'However, there are not enough Inspectors to monitor all sectors every day and ' +
                    'each sector will be inspected for three days a year.');

                break;
            case 5:
                this.stage++;

                this.frame.changeText('Story', 'Sector 723 has always been a role model for all other sectors. ' +
                    'They performed their tasks always fast and without any errors.\n' +
                    'However, 13 days ago something strange happened! The mirror images of the blocks detached from their counterpart and started their own life. ' +
                    'All six blocks enjoyed the new freedom and celebrate it with wild parties!');

                break;
            case 6:
                this.stage++;

                this.frame.changeText('Story', 'However, today the Inspection Days start!\n\n' +
                    'The six blocks need to pretend that everything is normal for the next three days to pass the inspection. ' +
                    'They need to fulfil their tasks and the mirror images and their real counterpart need to move in sync to each other...\nGood Luck!');

                break;
            case 7:
                this.stage++;

                this.frame.changeText('How To Play', 'This is a cooperative 2 player game where you ' +
                    'need to work together to deceive the Inspector and maintain the freedom in Sector 723!');

                break;
            case 8:
                this.stage++;

                this.highlighter.setPosition(8, 8).setSize(304, 304);
                this.highlighter.setVisible(true);

                this.frame.setSize(479, 200);
                this.frame.setPosition(380, 362)

                this.frame.changeText('How To Play', 'Player 1 controls the real blocks on the left side by moving them with W, A, S, D ' +
                    'and changing between the blocks with SPACE.');

                break;
            case 9:
                this.stage++;

                this.highlighter.setPosition(328, 8).setSize(304, 304);

                this.frame.setPosition(260, 362)

                this.frame.changeText('How To Play', 'Player 2 controls the mirror blocks on the right side by moving them with the Arrow Keys ' +
                    'and changing between the blocks with ENTER.');

                break;
            case 10:
                this.stage++;

                this.highlighter.setPosition(8, 145.5).setSize(29, 29);
                this.highlighter2.setPosition(603, 145.5).setVisible(true).setSize(29, 29);

                this.frame.setPosition(320, 362);

                this.frame.changeText('How To Play', 'Watch out, the pirates move always in the opposite direction of what you tell them!');

                break;
            case 11:
                this.stage++;

                this.highlighter.setPosition(26, 328).setSize(265, 135);
                this.highlighter.setVisible(true);
                this.highlighter2.setVisible(false);

                this.frame.setPosition(320, 150)

                this.frame.changeText('How To Play', 'Fulfil all tasks of every block to pass the day. ' +
                    'Make sure the right side mirrors the movement on the left side so that the Inspector does not realize ' +
                    'that they are independent.');

                break;
            case 12:
                this.stage++;

                this.highlighter.setPosition(350, 370).setSize(270, 60);

                this.frame.changeText('How To Play', 'The Mirror-O-Meter and the music tell you how well you mirror the movements. ' +
                    'If the pointer moves too far right the Inspector will detect the deception and you will fail the Inspection.');

                break;
            case 13:
                this.stage++;

                this.highlighter.setPosition(440, 430).setSize(90, 35);

                this.frame.changeText('How To Play', 'Try to beat the level and game as fast as possible and ' +
                    'beat the Par time (best time of the games developer).');

                break;
            case 14:
                this.stage++;

                this.highlighter.setVisible(false);

                this.frame.setPosition(320, 240);
                this.frame.setSize(470, 290);

                this.frame.changeText('Have Fun', 'You and your friend should now know everything to ' +
                    'save Sector 723. Good Luck, Sector 723 counts on you!');

                this.frame.changePressText('\nPress [ENTER] or [SPACE] to go back to Main Menu');

                break;
            default:
                this.escKey();
                break;
        }


    }

    /**
     * Action which happens when the esc key is pressed.
     */
    escKey() {

        this.musicMenu.stop();
        this.scene.start('Home');

    }

    destroyAll() {
        for (let i in this.objectArray) {
            this.objectArray[i].destroy();
            }

        this.objectArray = [];

    }

}