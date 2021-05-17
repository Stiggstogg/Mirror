import TextStyle from "../helper/textStyles";
import Levels from "../helper/levels";
import Frame from "../helper/frame";

/**
 * "How to Play" scene: Show how to play the game in a clearly defined sequence of instructions
 */
export default class howtoScene extends Phaser.Scene {

    /**
     * Constructor
     * @constructor
     */
    constructor() {
        super({
            key: 'Howto'
        });
    }

    /**
     * Initialize the scene with some positions of the playing area, the grid size and get the menu music from the
     * previous scene
     * @param data
     */
    init(data) {

        // parameters for the level drawing
        this.originLeft = {x: 10, y: 10};                       // origin of the left side (top left) (px)
        this.originRight = {x: 630, y: this.originLeft.y};      // origin of the right side (top right) (px)
        this.gridSize = 12.5;                                   // size of the grid to place objects (px)

        this.musicMenu = data.musicMenu;                        // get the menu music from the previous scene ("home" scene)

    }

    /**
     * Creates the "How to Play" scene with all of it's elements
     */
    create() {

        // text styles
        this.styles = new TextStyle();

        // add background
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        // draw level (non-interactive as it is not used to play)
        this.level = new Levels(this.originLeft, this.originRight, this.gridSize);  // create the level object
        this.level.createNonInteractiveLevel(this);                                 // create a non-interactive level

        // add mirror indicator
        let indicator = this.add.image(485, 400, 'indicator').setOrigin(0.5);   // add the mirror image
        this.mirrorPointer = this.add.sprite(indicator.x - indicator.width / 2 + 12, indicator.y + indicator.height / 2 - 14, 'pointer').setOrigin(0.5); // add the pointer of the mirror on the left side

        // add the inspector eyes
        this.eyes = this.add.sprite(485, 345, 'eyes', 0).setOrigin(0.5);

        // add the timer (set to 00:00)
        this.add.text(485, 445, '00:00', this.styles.get(2)).setOrigin(0.5);

        // Add keyboard inputs
        this.addKeys();

        // Add a new frame object (for the "How to Play" explanations)
        this.frame = new Frame(this, 320, 240, 470, 290, 'Title','Text', this.styles);

        // Add highlighters to highlight aspects of the game (flashing (changing color) rectangles)
        this.highlighter = this.add.rectangle(8, 8, 304, 304).setOrigin(0).setDepth(1.5);      // first highlighter
        this.highlighter.setStrokeStyle(4, 0x8cefb6);
        this.highlighterColors = [0x8cefb6, 0x474476, 0x6dbcb9, 0x4888b7];                                          // different highlighter colors which will change in a certain frequency
        this.highlighterCounter = 0;                                                                                // counter to count which color is currently shown
        this.highlighter.setVisible(false);                                                                         // make the highlighters invisible first

        this.highlighter2 = this.add.rectangle(8, 8, 304, 304).setOrigin(0).setDepth(1.5);     // second highlighter (when two objects need to be highlighted)
        this.highlighter2.setStrokeStyle(4, 0x8cefb6);
        this.highlighter2.setVisible(false);                                                                        // make the highlighters invisible first

        // timed event to change the color of the highlighter (make it flashing)
        this.time.addEvent({
            delay: 300,
            repeat: -1, // -1 means it will repeat forever
            callback: function () {                         // change the color of the highlighter to the next color

                // increase the highlighter counter (which chooses the color) by one or reset it back to the first one
                if (this.highlighterCounter < this.highlighterColors.length - 1) {
                    this.highlighterCounter++;                                              // if it is not the last color, change to the next one
                }
                else {
                    this.highlighterCounter = 0;                                            // if it is the last color, change to the first one
                }

                // change the color of both frames based on the counter
                this.highlighter.setStrokeStyle(4, this.highlighterColors[this.highlighterCounter]);
                this.highlighter2.setStrokeStyle(4, this.highlighterColors[this.highlighterCounter]);

            },
            callbackScope: this
        });

        // add object array for different objects which are added to a certain part (stage) of the "How to Play" usually in the frames
        // this allows to destroy the objects in one action ("destroyAll" method)
        this.objectArray = [];

        // stage counter, which counts at which stage the player is in the "How to Play"
        this.stage = 0;

        // start first stage (by triggering the space key action)
        this.spaceEnterKey();


    }

    update(time, delta) {

    }

    /**
     * Add keyboard input to the scene.
     */
    addKeys() {

        // enter, space and backspace key
        this.input.keyboard.addKey('Enter').on('down', function() { this.spaceEnterKey() }, this);  // next stage
        this.input.keyboard.addKey('Space').on('down', function() { this.spaceEnterKey() }, this);  // next stage
        this.input.keyboard.addKey('Backspace').on('down', function() { this.backKey() }, this);    // go back to home scene

    }

    /**
     * Action which happens when the enter or space key is pressed. The player(s) will be guided through the different
     * stages / parts / sections of the "How to Play". At the end it will jump back to the "Home" scene
     */
    spaceEnterKey() {

        // based on the current stage a different instruction is shown
        // in this way the player(s) will be going through the instructions step-by-step (stage)
        switch(this.stage) {
            case 0:             // Story, world description
                this.stage++;   // make sure next stage is shown after this

                this.frame.changeText('Story', 'The Block universe is divided into 5879 sectors and ruled by the mighty Inspectors.');  // text
                this.objectArray.push(this.add.image(this.frame.x, this.frame.y + 10, 'eyes', 0).setDepth(3));      // add the inspector eyes

                break;
            case 1:                 // Story, sector description
                this.stage++;       // make sure next stage is shown after this
                this.destroyAll();  // destroy all objects of the previous stage

                this.frame.changeText('Story', 'Each sector is inhabited by multiple blocks and contains one huge mirror.');        // text
                this.objectArray.push(this.add.image(this.frame.x - 50, this.frame.y + 10, 'block1', 1).setDepth(3));              // add the blocks
                this.objectArray.push(this.add.image(this.frame.x, this.frame.y + 10, 'block2', 1).setDepth(3));
                this.objectArray.push(this.add.image(this.frame.x + 50, this.frame.y + 10, 'block3', 1).setDepth(3));

                break;
            case 2:                 // Story, tasks description
                this.stage++;       // make sure next stage is shown after this
                this.destroyAll();  // destroy all objects of the previous stage

                this.frame.changeText('Story', 'Every day the blocks get tasks from the Inspectors which they need to fulfil. ' +
                    'These tasks consist of visiting and touching the three holy pictures Tree, Rocket and Potato in a specific order. ' +
                    'While doing that they should not touch each other and the dangerous X blocks.');                                                       // text
                this.objectArray.push(this.add.image(this.frame.x , this.frame.y + 23, 'checkpoint', 0).setDepth(3));                       // add the checkpoints
                this.objectArray.push(this.add.image(this.frame.x + 50, this.frame.y + 23, 'checkpoint', 1).setDepth(3));
                this.objectArray.push(this.add.image(this.frame.x + 100, this.frame.y + 23, 'checkpoint', 2).setDepth(3));
                this.objectArray.push(this.add.image(this.frame.x + 50, this.frame.y + 57, 'danger', 0).setDepth(3));                   // add the danger blocks

                break;
            case 3:                 // Story, penalty
                this.stage++;       // make sure next stage is shown after this
                this.destroyAll();  // destroy all objects of the previous stage

                this.frame.changeText('Story', 'If the blocks do not fulfil their tasks, they will receive the maximum penalty: ' +
                    'They will be transformed into circles!');                                                                                              // text

                this.objectArray.push(this.add.image(this.frame.x - 50, this.frame.y + 10, 'block1', 1).setDepth(3));                     // add the blocks
                this.objectArray.push(this.add.image(this.frame.x, this.frame.y + 10, 'block2', 1).setDepth(3));
                this.objectArray.push(this.add.image(this.frame.x + 50, this.frame.y + 10, 'block3', 1).setDepth(3));

                let round = false;                                          // switch to indicate if the blocks are round

                // change the blocks from square to round and back (timed event repeated infinitely)
                this.squareToRound = this.time.addEvent({
                    delay: 1000,
                    repeat: -1,
                    callback: function() {
                        if (round) {
                            this.objectArray[0].setFrame(1);            // change to squares if they are round
                            this.objectArray[1].setFrame(1);
                            this.objectArray[2].setFrame(1);
                        }
                        else {
                            this.objectArray[0].setFrame(2);            // change to circles if they are not round
                            this.objectArray[1].setFrame(2);
                            this.objectArray[2].setFrame(2);
                        }

                        round = !round;                                 // toggle swich

                    },
                    callbackScope: this
                });

                break;
            case 4:                             // Story, inspection description
                this.squareToRound.destroy();   // destroy timed event (square to round changes)
                this.stage++;                   // make sure next stage is shown after this
                this.destroyAll();              // destroy all objects of the previous stage

                this.frame.changeText('Story', 'However, there are not enough Inspectors to monitor all sectors every day and ' +
                    'each sector will be inspected for three days a year.');                // text

                break;
            case 5:                 // Story, detachment
                this.stage++;       // make sure next stage is shown after this

                this.frame.changeText('Story', 'Sector 723 has always been a role model for all other sectors. ' +
                    'They performed their tasks always fast and without any errors.\n' +
                    'However, 13 days ago something strange happened! The mirror images of the blocks detached from their counterparts and started their own life. ' +
                    'All six blocks enjoyed the new freedom and celebrated it with wild parties!');     // text

                break;
            case 6:                 // Story, inspection day!
                this.stage++;       // make sure next stage is shown after this

                this.frame.changeText('Story', 'However, today the Inspection Days start!\n\n' +
                    'The six blocks need to pretend that everything is normal for the next three days to pass the Inspection. ' +
                    'They need to fulfil their tasks and the mirror images and their real counterparts need to move in sync to each other...\nGood Luck!'); // text

                break;
            case 7:                 // How to Play, general description
                this.stage++;       // make sure next stage is shown after this

                this.frame.changeText('How To Play', 'This is a cooperative 2 player game where you ' +
                    'need to work together to deceive the Inspector and maintain the freedom in Sector 723!');      // text

                break;
            case 8:                 // How to Play, player 1 side and controls
                this.stage++;       // make sure next stage is shown after this

                this.highlighter.setPosition(8, 8).setSize(304, 304);   // set highlighter for left playing area
                this.highlighter.setVisible(true);                                        // make highlighter visible

                this.frame.setSize(479, 200);                                 // change size of the frame
                this.frame.setPosition(380, 362)                                     // change position of the frame (bottom right)

                this.frame.changeText('How To Play', 'Player 1 controls the real blocks on the left side by moving them with W, A, S, D ' +
                    'and changing between the blocks with SPACE.');                        // text

                break;
            case 9:                 // How to Play, player 2 side and controls
                this.stage++;       // make sure next stage is shown after this

                this.highlighter.setPosition(328, 8).setSize(304, 304);     // move the highlighter to the right playing area

                this.frame.setPosition(260, 362)                                        // change position of the frame (bottom left)

                this.frame.changeText('How To Play', 'Player 2 controls the mirror blocks on the right side by moving them with the Arrow Keys ' +
                    'and changing between the blocks with ENTER.');                           // text

                break;
            case 10:                // How to Play, pirate special movement
                this.stage++;       // make sure next stage is shown after this

                // highlight the pirates
                this.highlighter.setPosition(8, 145.5).setSize(29, 29);                         // highlight left pirate
                this.highlighter2.setPosition(603, 145.5).setVisible(true).setSize(29, 29);     // highlight right pirate

                this.frame.setPosition(320, 362);                                       // change position of the frame (bottom middle)

                this.frame.changeText('How To Play', 'Watch out, the pirates move always in the opposite direction of what you tell them!');    // text

                this.objectArray.push(this.add.image(this.frame.x, this.frame.y + 10, 'block2', 1).setDepth(3));    // add pirate block into frame

                break;
            case 11:                // How to Play, goal
                this.stage++;       // make sure next stage is shown after this
                this.destroyAll();  // destroy all objects of the previous stage

                this.highlighter.setPosition(26, 328).setSize(265, 135);          // highlight the tasks section
                this.highlighter.setVisible(true);                                                  // make first highlighter visible again (obsolete?)
                this.highlighter2.setVisible(false);                                                // make second highlighter invisible (not used anymore)

                this.frame.setPosition(320, 150);                                              // move frame (top middle)

                this.frame.changeText('How To Play', 'Fulfil all tasks of every block to pass the day. ' +
                    'Make sure the right side mirrors the movement on the left side so that the Inspector does not realize ' +
                    'that they are independent.');                                                  // text

                break;
            case 12:                // How to Play, mirror-o-meter
                this.stage++;       // make sure next stage is shown after this

                this.highlighter.setPosition(350, 370).setSize(270, 60);        // highlight the mirror-o-meter

                this.frame.changeText('How To Play', 'The Mirror-O-Meter and the music tell you how well you mirror the movements. ' +
                    'If the pointer moves too far right the Inspector will detect the deception and you will fail the Inspection.');        // text

                break;
            case 13:                // How to Play, par time
                this.stage++;       // make sure next stage is shown after this

                this.highlighter.setPosition(440, 430).setSize(90, 35);         // highlight timer

                this.frame.changeText('How To Play', 'Try to beat the level and game as fast as possible and ' +
                    'beat the Par time (best time of the games developer).');       // text

                break;
            case 14:                // Have fun
                this.stage++;       // make sure next stage is shown after this

                this.highlighter.setVisible(false);         // make highlighter invisible

                this.frame.setPosition(320, 240);           // move frame to middle
                this.frame.setSize(470, 290);         // make frame large again

                this.frame.changeText('Have Fun', 'You and your friend should now know everything to ' +
                    'save Sector 723. Good Luck, Sector 723 counts on you!');       // text

                this.frame.changePressText('\nPress [ENTER] or [SPACE] to go back to Main Menu');   // change the "press" text from default to back to main menu

                break;
            default:                // if the last stage is reached go back to the main menu
                this.backKey();     // go back to the main menu by triggering the "backspace" action
                break;
        }


    }

    /**
     * Action which happens when the backspace key is pressed. Go back to the "Home" scene.
     */
    backKey() {

        this.musicMenu.stop();      // stop the menu music
        this.scene.start('Home', {sequence: this.musicMenu.getSequence()}); // change to "home" scene and provide the current chord progression / sequence

    }

    /**
     * Destroys all objects of a stage, to simplify the destruction.
     */
    destroyAll() {

        // destroy each object of the array
        for (let i in this.objectArray) {
            this.objectArray[i].destroy();
            }

        // reinitialize the array
        this.objectArray = [];

    }
}