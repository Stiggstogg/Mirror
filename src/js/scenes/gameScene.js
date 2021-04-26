// import objects
import BlockManager from '../helper/blockManager.js';
import Levels from '../helper/levels.js';
import TextStyle from "../helper/textStyles.js";

/**
 * "Game" scene: Scene for the main game
 */
export default class gameScene extends Phaser.Scene {

    /**
     * Constructor
     * @constructor
     */
    constructor() {
        super({
            key: 'Game'
        });
    }

    /**
     * Initialize parameters. Get data from the previous scene (music and finishing state)
     * @param {Object} data - data object containing the musics and if the game is finished or not
     */
    init(data) {

        // parameters
        this.originLeft = {x: 10, y: 10};                       // origin of the left side (top left) (px)
        this.originRight = {x: 630, y: this.originLeft.y};      // origin of the right side (top right) (px)
        this.gridSize = 12.5;                                   // size of the grid to place objects (px)

        this.mirrorTolerance = 100;                              // mirror tolerance (px)

        this.maxVelocity = 3;                                   // maximum velocity of a block in (px/frame)

        // create the level object if it is a new game, continue with the provided level object if it is an ongoing game
        if (data.newGame) {
            this.levels = new Levels(this.originLeft, this.originRight, this.gridSize);
        }
        else {
            this.levels = data.levels;
        }

        this.state = -1;                // state of the game: -1: before the level, 0: while playing, 1: game finished, 2: game over
        this.finished = data.finished;  // true if the game is finished!

        // get the music objects
        this.musicMenu = data.musicMenu;
        this.musicPlaying = data.musicPlaying;

    }

    /**
     * Creates all objects of this scene
     */
    create() {

        // add background
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        // add indicator and pointer
        let indicator = this.add.image(485, 400, 'indicator').setOrigin(0.5);
        this.mirrorPointer = this.add.sprite(indicator.x - indicator.width / 2 + 12, indicator.y + indicator.height / 2 - 14, 'pointer').setOrigin(0.5);

        // add eyes
        this.eyes = this.add.sprite(485, 345, 'eyes', 0).setOrigin(0.5);

        // add frame
        this.frame = this.add.image(320, 235, 'frame').setOrigin(0.5, 0.5).setDepth(2);
        this.frame.setVisible(false);
        this.frameTopLeft = {x: this.frame.x - this.frame.width/2 + 16, y: this.frame.y - this.frame.height/2 + 16};
        this.frameTopMiddle = {x: this.frame.x, y: this.frameTopLeft.y};
        this.frameBottomMiddle = {x: this.frame.x, y: this.frame.y + this.frame.height/2 - 16};

        // set text properties
        this.styles = new TextStyle();                  // create the text style object

        // game timer
        this.gameTime = this.add.text(485, 445, this.convertTime(0), this.styles.get(2)).setOrigin(0.5);

        // create block managers
        this.blockManagerLeft = new BlockManager(this);
        this.blockManagerRight = new BlockManager(this);

        // create danger group
        this.dangerGroupLeft = this.add.group();
        this.dangerGroupRight = this.add.group();

        // create checkpoint group
        this.checkpointGroupLeft = this.add.group();
        this.checkpointGroupRight = this.add.group();

        // create and draw level
        this.levels.createLevel(this,
            this.blockManagerLeft, this.blockManagerRight,
            this.dangerGroupLeft, this.dangerGroupRight,
            this.checkpointGroupLeft, this.checkpointGroupRight);

        // add keys
        this.keysLeft = this.input.keyboard.addKeys('w,a,s,d,SPACE');
        this.keysRight = this.input.keyboard.addKeys('UP,LEFT,DOWN,RIGHT,ENTER');

        // add block change keys and event
        this.input.keyboard.addKey('Space').on('down', function() { this.spaceKey() }, this);
        this.input.keyboard.addKey('Enter').on('down', function() { this.enterKey() }, this);
        this.input.keyboard.addKey('Backspace').on('down', function() { this.backKey() }, this);

        // mirror value
        this.mirrorValue = 0;

        // add sounds and their listeners
        this.gameOverSound = this.sound.add('gameover');
        this.gameOverSound.on('complete', function() { this.saveStartMenuMusic(); }, this); // (save) start menu music as soon as the game over sound is over.
        this.levelCompleteSound = this.sound.add('level');
        this.levelCompleteSound.on('complete', function() { this.saveStartMenuMusic(); }, this); // (save) start menu music as soon as the level is complete sound is over
        this.gameCompleteSound = this.sound.add('game');
        this.gameCompleteSound.on('complete', function() { this.saveStartMenuMusic(); }, this); // (save) start menu music as soon as the level is complete sound is over

        // write text before the level starts, provide if the game is finished!
        this.before(this.finished);

        // fade in at the beginning
        this.cameras.main.fadeIn(500, 55, 33, 52);

    }

    /**
     * Update function for the game loop. Gets movement key inputs, updates blocks, checks for collisions, does the
     * mirror check, check for mission fulfilment and updates the timer
     * @param {number} time
     * @param {number} delta
     */
    update(time, delta) {

        // update while gaming
        if (this.state === 0) {
            // movement left side
            if (this.keysLeft.w.isDown) { this.blockManagerLeft.getActive().keyUp(); }
            if (this.keysLeft.a.isDown) { this.blockManagerLeft.getActive().keyLeft(); }
            if (this.keysLeft.s.isDown) { this.blockManagerLeft.getActive().keyDown(); }
            if (this.keysLeft.d.isDown) { this.blockManagerLeft.getActive().keyRight(); }

            // movement right side
            if (this.keysRight.UP.isDown) { this.blockManagerRight.getActive().keyUp(); }
            if (this.keysRight.LEFT.isDown) { this.blockManagerRight.getActive().keyLeft(); }
            if (this.keysRight.DOWN.isDown) { this.blockManagerRight.getActive().keyDown(); }
            if (this.keysRight.RIGHT.isDown) { this.blockManagerRight.getActive().keyRight(); }

            // Update all blocks
            this.blockManagerLeft.updateAll();
            this.blockManagerRight.updateAll();

            // check for collisions
            this.collisionBlockCheckpoint(this.blockManagerLeft, this.blockManagerRight, this.checkpointGroupLeft, this.checkpointGroupRight);     // blocks and checkpoint
            this.collisionBlockDanger(this.blockManagerLeft, this.dangerGroupLeft);             // blocks and danger
            this.collisionBlockDanger(this.blockManagerRight, this.dangerGroupRight);
            this.collisionBlockBlock(this.blockManagerLeft);                                    // blocks and blocks
            this.collisionBlockBlock(this.blockManagerRight);

            // check if the block are still mirrored (within tolerance)
            this.mirrorCheck(this.blockManagerLeft, this.blockManagerRight);

            // check if all missions are fulfilled
            this.missionsFulfilled(this.blockManagerLeft, this.blockManagerRight);

            // update timer
            this.updateTime();

        }

    }

    /**
     * Executed when the game is over. Stops the music, plays the game over sound, shakes camera, shows the frame
     * @param {string} reason - reason why game over was triggered ('danger': collision of block with danger, 'block': collision of block with another block)
     */
    gameOver(reason) {

        // stop playing music start menu music
        this.musicPlaying.stop();

        // camera shake
        this.cameras.main.shake(250);

        // play the game over sound and also start the menu sound as soon as it is finished
        this.gameOverSound.play();

        // set the state to the game over state
        this.state = 2;

        // stop the eye animation
        this.eyes.stop();

        // frame
        this.frame.setVisible(true);        // set visibility

        this.add.text(this.frameTopMiddle.x, this.frameTopMiddle.y + 30,        // add title text
            'Inspection Failed!', this.styles.get(0))
            .setOrigin(0.5).setDepth(3);

        let overText = this.add.text(this.frameTopLeft.x + 32, this.frameTopLeft.y + 70,    // create game over text
            'GAME OVER', this.styles.get(3)).setOrigin(0).setDepth(3);

        switch (reason) {               // set game over text based on the reason for the game over
            case 'danger':
                overText.setText('You touched a dangerous X block!\n\nYou will be transformed into circles!');
                break;
            case 'block':
                overText.setText('You touched each other!\n\nYou will be transformed into circles!');
                break;
            case 'mirror':
                overText.setText('Your mirror image was not in sync and the inspector detected your deception!\n\nYou will be transformed into circles!');
                break;
            default:
                overText.setText('\n\n\nYou will be transformed into circles!');
                break;
        }

        let startText = this.add.text(this.frameTopMiddle.x, this.frameBottomMiddle.y - 30,         // key instruction text
            'Press [ENTER] or [SPACE] to Restart\nPress [BACKSPACE] to go back to Main Menu' , this.styles.get(1))
            .setOrigin(0.5).setDepth(3);

        // show blocks in frame
        let block1 = this.add.image(this.frame.x - 50, this.frame.y + 45, 'block1', 1).setDepth(3);
        let block2 = this.add.image(this.frame.x, this.frame.y + 45, 'block2', 1).setDepth(3);
        let block3 = this.add.image(this.frame.x + 50, this.frame.y + 45, 'block3', 1).setDepth(3);

        // transform all blocks after one second into circles
        this.time.addEvent({delay: 1000, repeat: 0, callback: function() {

            block1.setFrame(2);
            block2.setFrame(2);
            block3.setFrame(2);

            this.blockManagerLeft.circles();
            this.blockManagerRight.circles();

        },
        callbackScope: this
        });

    }

    /**
     * Actions which happen when the space key is pressed (depending on the state)
     */
    spaceKey() {

        switch (this.state) {
            case -1:                        // if in state "before playing": start playing
                this.startGame();
                break;
            case 0:                         // if in state "playing": Activate the next block
                this.blockManagerLeft.activateNext();
                break;
            case 1:                         // if in state "game finished" restart a new game
                this.scene.start('Game', {newGame: true, finished: false, musicMenu: this.musicMenu, musicPlaying: this.musicPlaying});
                break;
            case 2:                         // if in state "game over" restart a new game
                this.scene.start('Game', {newGame: true, finished: false, musicMenu: this.musicMenu, musicPlaying: this.musicPlaying});
                break;
        }

    }

    /**
     * Actions which happen when the enter key is pressed (depending on the state)
     */
    enterKey() {

        switch (this.state) {
            case -1:                        // if in state "before playing": start playing
                this.startGame();
                break;
            case 0:                         // if in state "playing": Activate the next block
                this.blockManagerRight.activateNext();
                break;
            case 1:                         // if in state "game finished" restart a new game
                this.scene.start('Game', {newGame: true, finished: false, musicMenu: this.musicMenu, musicPlaying: this.musicPlaying});
                break;
            case 2:                         // if in state "game over" restart a new game
                this.scene.start('Game', {newGame: true, finished: false, musicMenu: this.musicMenu, musicPlaying: this.musicPlaying});
                break;
        }

    }

    /**
     * Actions which happen when the backspace key is pressed: go back to main menu
     */
    backKey() {

        this.scene.start('Home', {sequence: this.musicMenu.getSequence()});           // go back to main menu (providing the current chord sequence)
        this.musicMenu.stop();                                                                  // stop menu music
        this.musicPlaying.stop();                                                               // stop playing music

    }

    /**
     * Actions when the game starts (players start playing).
     */
    startGame() {

        // stop the menu music and start the playing music in normal mode
        this.musicMenu.stop();
        this.musicPlaying.changeMode(0);
        this.musicPlaying.start();

        // change state to gaming
        this.state = 0;

        // destroy all texts from the "before" state
        for (let i in this.texts) {
            this.texts[i].destroy();
        }

        this.texts = [];                    // empty array
        this.frame.setVisible(false);       // hide frame

        // set game start time
        this.gameStartTime = new Date();

        // start the eye animations
        this.eyeAnimations();

    }

    /**
     * Initiates the screen (frame and text) before the level starts (or when the game is finished).
     * @param finished {boolean} - If this is true then the game is finished.
     */
    before(finished) {

        // set the state depending on if the game is finished or not
        if (finished) {
            this.state = 1;         // game is finished
        }
        else {
            this.state = -1;        // game is in state "before playing"
        }

        // Frame and text
        this.frame.setVisible(true);   // make the frame visible
        this.texts = [];               // create empty array for texts (as they need to be deleted)

        let titleText;                                  // text for the title
        let pressText;                                  // text with key press instructions
        let lastLevel = this.levels.selectedLevel - 1;  // get the number of the last level (from the levels object)

        // add the title (level) and press (start) based on the state and the level (different for first level and if the game is finished)
        if (this.levels.selectedLevel === 1){                   // first level
            titleText = 'Day ' + this.levels.selectedLevel;
            pressText = 'Press [ENTER] or [SPACE] to Start Day ' + this.levels.selectedLevel + '\nPress [BACKSPACE] to go back to Main Menu';
        }
        else if (finished) {                                    // game is finished
            titleText = 'Inspection Passed!';
            pressText = 'Press [ENTER] or [SPACE] to Restart\nPress [BACKSPACE] to go back to Main Menu';
        }
        else {                                                  // any other levels
            titleText = 'Day ' + lastLevel + ': Passed!';
            pressText = 'Press [ENTER] or [SPACE] to Start Day ' + this.levels.selectedLevel + '\nPress [BACKSPACE] to go back to Main Menu';
        }

        let levelText = this.add.text(this.frameTopMiddle.x, this.frameTopMiddle.y + 30, titleText, this.styles.get(0))     // title text object
            .setOrigin(0.5).setDepth(3);
        this.texts.push(levelText);                                                     // push to the text array object

        // add the times (also dependent on the state)
        let ySpace = 20;                                                                // y space between the times
        let xSpace = 130;                                                               // x space between the times
        let topLeft = {x: this.frameTopLeft.x + 50, y: levelText.y + 40};               // top left starting point of the times

        this.texts.push(this.add.text(topLeft.x + xSpace, topLeft.y,'Your Time', this.styles.get(6)).setOrigin(0.5).setDepth(3));       // headers of the 'table'
        this.texts.push(this.add.text(topLeft.x + xSpace * 2, topLeft.y,'Par Time', this.styles.get(6)).setOrigin(0.5).setDepth(3));

        let level = 0;              // temporary time and text objects
        let totalTime = 0;
        let totalParTime = 0;
        let yourTimeText = '';
        let parTimeText = '';

        for (let i = 0; i < this.levels.numLevels; i++) {           // go through all levels and add the times (or empty values if the levels are not played yet)

            level = i+1;        // level number

            this.texts.push(this.add.text(topLeft.x, topLeft.y + ySpace * (i+1), 'Day ' + level, this.styles.get(6))    // Day label
                .setOrigin(0, 0.5).setDepth(3));                // day row label

            // show only the time of the levels which are already played. In case the game is finished all times are shown
             if (i + 1 < this.levels.selectedLevel || finished) {

                totalTime += this.levels.levelTimes[i];             // calculate the total time of the players
                totalParTime += this.levels.levels[i].par;          // calculate the total par time

                yourTimeText = this.convertTime(this.levels.levelTimes[i]);     // convert it to string
                parTimeText = this.convertTime(this.levels.levels[i].par);

            }
            else {                          // if the levels are not played yet, the times will be empty
                yourTimeText = '--';
                parTimeText = '--';
            }

            // add the times (your and par)
            this.texts.push(this.add.text(topLeft.x + xSpace, topLeft.y + ySpace * (i+1), yourTimeText,
                this.styles.get(6)).setOrigin(0.5).setDepth(3));
            this.texts.push(this.add.text(topLeft.x + xSpace * 2, topLeft.y + ySpace * (i+1), parTimeText, this.styles.get(6)).setOrigin(0.5).setDepth(3));

        }

        // add the divider and the total times
        this.texts.push(this.add.text(topLeft.x, topLeft.y + ySpace * 4, '--------------------------------', this.styles.get(6)).setOrigin(0, 0.5).setDepth(3));
        this.texts.push(this.add.text(topLeft.x, topLeft.y + ySpace * 5, 'Total', this.styles.get(6)).setOrigin(0, 0.5).setDepth(3));
        this.texts.push(this.add.text(topLeft.x + xSpace, topLeft.y + ySpace * 5, this.convertTime(totalTime), this.styles.get(6)).setOrigin(0.5).setDepth(3));
        this.texts.push(this.add.text(topLeft.x + xSpace * 2, topLeft.y + ySpace * 5, this.convertTime(totalParTime), this.styles.get(6)).setOrigin(0.5).setDepth(3));


        // add the press / start text
        this.texts.push(this.add.text(this.frameTopMiddle.x, this.frameBottomMiddle.y - 30,
            pressText, this.styles.get(1)).setOrigin(0.5).setDepth(3));

    }

    /**
     * Checks if there are any open missions. If no the level is completed.
     * @param {BlockManager} blockManLeft - Block manager of the left side
     * @param {BlockManager} blockManRight - Block manager of the right side
     */
    missionsFulfilled(blockManLeft, blockManRight) {

        // get the blocks as array
        let blocksLeft = blockManLeft.blocks.getChildren();
        let blocksRight = blockManRight.blocks.getChildren();

        let openMissions = 0;

        // check for each block how many open missions do exist and sum them up
        for (let i in blocksLeft) {

            openMissions += blocksLeft[i].missions.length + blocksRight[i].missions.length;

        }

        // if there are no open missions anymore the level is completed
        if (openMissions < 1) {
            this.levelComplete();
        }

    }

    /**
     * Does all required actions when the level is complete.
     */
    levelComplete() {

        // stop the playing music
        this.musicPlaying.stop();

        // store the time used for this level
        this.levels.levelTimes.push(new Date() - this.gameStartTime);

        // If it is the last level, start a new level but with finished = true, so that the game finished things will
        // trigger. If it is not the last level, increase the level and start it.
        if (this.levels.lastLevel()) {
            this.gameCompleteSound.play();             // play the game complete sound and start afterwards the menu sound (has an event tied to it!)
            this.scene.start('Game', {newGame: false, finished: true, levels: this.levels, musicMenu: this.musicMenu, musicPlaying: this.musicPlaying});
        }
        else {
            this.levelCompleteSound.play();             // play the level complete sound and start afterwards the menu sound (has an event tied to it!)
            this.levels.nextLevel();
            this.scene.start('Game', {newGame: false, finished: false, levels: this.levels, musicMenu: this.musicMenu, musicPlaying: this.musicPlaying});
        }

    }

    /**
     * Checks the collision between blocks and dangers on one side. If a collision happens: Game Over!
     * @param {BlockManager} blockMan - Block manager from one side
     * @param {Phaser.GameObjects.Group} dangerGrp - Danger group from the same side
     */
    collisionBlockDanger(blockMan, dangerGrp) {

        // get blocks and dangers as arrays
        let blocks = blockMan.blocks.getChildren();
        let dangers = dangerGrp.getChildren();

        // go through all blocks and dangers and check if they intersect (collide)
        for (let i in blocks) {
            for (let j in dangers) {
                if (Phaser.Geom.Intersects.RectangleToRectangle(blocks[i].getBounds(), dangers.[j].getBounds())) {      // collision check
                    this.gameOver('danger');
                }
            }
        }

    }

    /**
     * Checks the collision between blocks and the checkpoints. If a collision happens: Check if this checkpoint is
     * the next in this blocks mission and proceed accordingly. If it is not the next checkpoint, nothing happens.
     * @param {BlockManager} blockMan - Block manager from one side
     * @param {Phaser.GameObjects.Group} checkpointGrp - Checkpoint group from the same side
     */
    collisionBlockCheckpoint(blockManLeft, blockManRight, checkpointsGrpLeft, checkpointsGrpRight) {

        // get blocks and checkpoints as arrays
        let blocksLeft = blockManLeft.blocks.getChildren();
        let blocksRight = blockManRight.blocks.getChildren();

        let checkpointsLeft = checkpointsGrpLeft.getChildren();
        let checkpointsRight = checkpointsGrpRight.getChildren();

        // go through the blocks and the checkpoints on the left side and check if there is a collision on both sides
        // if yes, the corresponding missions of this block is fulfilled.
        for (let i in blocksLeft) {
            for (let j in checkpointsLeft) {

                if (
                    Phaser.Geom.Intersects.RectangleToRectangle(blocksLeft[i].getBounds(), checkpointsLeft[j].getBounds()) &&
                    Phaser.Geom.Intersects.RectangleToRectangle(blocksRight[i].getBounds(), checkpointsRight[j].getBounds()) &&
                    blocksLeft[i].checkMission(checkpointsLeft[j]) && blocksRight[i].checkMission(checkpointsRight[j])
                ) {
                    blocksLeft[i].fulfillMission(checkpointsLeft[j]);
                    blocksRight[i].fulfillMission(checkpointsRight[j]);
                }

            }
        }

    }

    /**
     * Checks the collision between the blocks on one side. If a collision happens: Game Over!
     * @param {BlockManager} blockMan - Block manager from one side
     */
    collisionBlockBlock(blockMan) {

        // get the blocks as arrays
        let blocks = blockMan.blocks.getChildren();

        // check for each block if it collides with another one
        for (let i = 0; i < blocks.length; i++) {
            for (let j = i+1; j < blocks.length; j++) {
                if (Phaser.Geom.Intersects.RectangleToRectangle(blocks.[i].getBounds(), blocks.[j].getBounds())) {  // collision detection
                    this.gameOver('block');
                }
            }
        }

    }

    /**
     * Calculates the "mirror value", which represents the difference between the two sides (how much they are
     * mirrored). Based on this value the indicator is adapted and if the difference is too high game over is triggered.
     * @param {BlockManager} blockManLeft - Block manager of the left side
     * @param {BlockManager} blockManRight - Block manager of the right side
     */
    mirrorCheck(blockManLeft, blockManRight) {

        this.mirrorValue = 0;           // reset mirror value

        // get the blocks as arrays
        let blocksLeft = blockManLeft.blocks.getChildren();
        let blocksRight = blockManRight.blocks.getChildren();

        // create the objects for the calculation
        let left = {x: 0, y: 0};            // coordinate of a specific block relative to the origin (left side: top left; right side: top right)
        let right = {x: 0, y:0};
        let diff = {x: 0, y: 0};            // difference between the two coordinates

        // calculate the difference between the positions for all blocks and add it up
        for (let i = 0; i < blocksLeft.length; i++) {

            // calculate coordinate of the corresponding block to the origin. Origin left side: top left; Origin right side: top right
            left = {
                x: blocksLeft[i].x - this.originLeft.x,
                y: blocksLeft[i].y - this.originLeft.y
            };
            right = {
                x: this.originRight.x - blocksRight[i].x,
                y: blocksRight[i].y - this.originRight.y
            };

            // calculate difference between the coordinates
            diff = {
                x: Math.abs(left.x - right.x),
                y: Math.abs(left.y - right.y)
            }

            // add differences (x and y) to the total mirror value
            this.mirrorValue += diff.x + diff.y;

        }

        // update the mirror pointer based on the mirror value
        this.mirrorPointer.x = 367 + (this.mirrorValue / this.mirrorTolerance * 236);

        // change music mode if mirrorValue is above 50 % (from normal to fast)
        if (this.mirrorValue >= this.mirrorTolerance*0.50) {
            this.musicPlaying.changeMode(1);
        }
        else {
            this.musicPlaying.changeMode(0);
        }

        // trigger game over if mirrorValue is above Tolerance
        if (this.mirrorValue >= this.mirrorTolerance){
            this.mirrorPointer.x = 603;
            this.gameOver('mirror');
        }

    }

    /**
     * Converts the time from milliseconds in a string with format mm:ss.
     * @param {number} time - time in milliseconds
     * @returns {string} - time string in format mm:ss
     */
    convertTime(time) {

        // get minutes and seconds part of the time
        let mm = Math.floor(time / 1000 / 60);      // minutes part of the time
        let ss = time / 1000 - mm * 60;                 // seconds part of the time

        // variables for the display
        let mmDisplay;
        let ssDisplay;

        // add 0 as prefix if numbers are smaller then 10
        if (mm < 10) {
            mmDisplay = '0' + mm.toFixed(0);
        } else {
            mmDisplay = mm.toFixed(0);
        }

        if (Math.round(ss) < 10) {
            ssDisplay = '0' + ss.toFixed(0);
        } else {
            ssDisplay = ss.toFixed(0);
        }

        // return string
        return mmDisplay + ':' + ssDisplay;

    }

    /**
     * Updates the game timer.
     */
    updateTime() {

        let now = new Date();                           // get the current time
        let currentGameTime = now - this.gameStartTime; // calculate the time difference to the time when the game has started

        this.gameTime.setText(this.convertTime(currentGameTime));   // convert the time and show it

    }

    /**
     * Creates the eye animations which will run forever.
     */
    eyeAnimations() {

        this.eyeAnimationSequence = [];     // eye animation sequence array
        this.eyeAnimationCurrent = 0;       // counter for the current eye animation (which animation is currently playing)

        // sequence of the animations (including their delay)
        this.eyeAnimationSequence.push({key: 'midToRight', delay: 1000});
        this.eyeAnimationSequence.push({key: 'rightToMid', delay: 1500});
        this.eyeAnimationSequence.push({key: 'midToLeft', delay: 2000});
        this.eyeAnimationSequence.push({key: 'leftToRight', delay: 3000});
        this.eyeAnimationSequence.push({key: 'rightToMid', delay: 1000});
        this.eyeAnimationSequence.push({key: 'midToRight', delay: 500});
        this.eyeAnimationSequence.push({key: 'rightToMid', delay: 500});
        this.eyeAnimationSequence.push({key: 'midToLeft', delay: 1000});
        this.eyeAnimationSequence.push({key: 'leftToMid', delay: 2000});

        // waits until an animation is complete and then starts the next one
        this.eyes.on('animationcomplete', function(){

            // go to the next animation (or back to the first if it was the last)
            if (this.eyeAnimationCurrent >= this.eyeAnimationSequence.length - 1) {
                this.eyeAnimationCurrent = 0;
            }
            else {
                this.eyeAnimationCurrent++;
            }

            // start the animation (with delay)
            this.eyes.playAfterDelay(this.eyeAnimationSequence[this.eyeAnimationCurrent].key, this.eyeAnimationSequence[this.eyeAnimationCurrent].delay);

        }, this);

        // start the first animation (to initialize the animation, afterwards it runs forever)
        this.eyes.playAfterDelay(this.eyeAnimationSequence[this.eyeAnimationCurrent].key, this.eyeAnimationSequence[this.eyeAnimationCurrent].delay);

    }

    /**
     * Save start of the menu music, to prevent that it runs two times!
     * Starts the menu music only if no other music is playing and the current game scene is still active!
     */
    saveStartMenuMusic() {

        if (!this.musicMenu.isPlaying && !this.musicPlaying.isPlaying && this.scene.isActive('Game')) {
            this.musicMenu.start();
        }

    }

}