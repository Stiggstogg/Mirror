// import objects
import BlockManager from '../helper/blockManager.js';
import Levels from '../helper/levels.js';
import TextStyle from "../helper/textStyles.js";

// "Game" scene: This is the main scene of the game
export default class gameScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'Game'
        });
    }

    // initiate scene parameters
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

    }

    // load assets
    preload() {

    }

    // create objects (executed once after preload())
    create() {

        // add background
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        // add indicator and pointer
        let indicator = this.add.image(485, 360, 'indicator').setOrigin(0.5);
        this.mirrorPointer = this.add.sprite(indicator.x - indicator.width / 2 + 12, indicator.y + indicator.height / 2 - 14, 'pointer').setOrigin(0.5);

        // add frame
        this.frame = this.add.image(320, 235, 'frame').setOrigin(0.5, 0.5).setDepth(2);
        this.frame.setVisible(false);
        this.frameTopLeft = {x: this.frame.x - this.frame.width/2 + 16, y: this.frame.y - this.frame.height/2 + 16};
        this.frameTopMiddle = {x: this.frame.x, y: this.frameTopLeft.y};
        this.frameBottomMiddle = {x: this.frame.x, y: this.frame.y + this.frame.height/2 - 16};

        // set text properties
        this.styles = new TextStyle();                  // create the text style object

        // game timer
        this.gameTime = this.add.text(50, 50, this.convertTime(0), this.styles.get(0)).setOrigin(0.5);

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
        this.input.keyboard.addKey('Esc').on('down', function() { this.escKey() }, this);

        // mirror value
        this.mirrorValue = 0;

        // write text before the level starts
        this.before(this.finished);

    }

    /**
     * Update method
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
     * Executed when the game is over. Triggers any actions and goes back to home screen.
     * @param {string} reason - reason why game over was triggered ('danger': collision of block with danger, 'block': collision of block with another block)
     */
    gameOver(reason) {

        this.state = 2;                // set the state to the game over state
        this.frame.setVisible(true);   // make the frame visible

        this.add.text(this.frameTopMiddle.x, this.frameTopMiddle.y + 30,
            'Day ' + this.levels.selectedLevel, this.styles.get(0))
            .setOrigin(0.5).setDepth(3);

        let overText = this.add.text(this.frameTopMiddle.x, this.frame.y,
            'GAME OVER', this.styles.get(3))
            .setOrigin(0.5).setDepth(3);

        let startText = this.add.text(this.frameTopMiddle.x, this.frameBottomMiddle.y - 30,
            'Press [ENTER] or [SPACE] to Restart\nPress [ESC] to go back to Main Menu' , this.styles.get(1))
            .setOrigin(0.5).setDepth(3);
    }

    /**
     * Actions which happen when the space key is pressed (depending on the state)
     */
    spaceKey() {

        switch (this.state) {
            case -1:
                this.startGame();
                break;
            case 0:
                this.blockManagerLeft.activateNext();
                break;
            case 1:
                this.scene.start('Game', {newGame: true, finished: false});
                break;
            case 2:
                this.scene.start('Game', {newGame: true, finished: false});
                break;
        }

    }

    /**
     * Actions which happen when the enter key is pressed (depending on the state)
     */
    enterKey() {

        switch (this.state) {
            case -1:
                this.startGame();
                break;
            case 0:
                this.blockManagerRight.activateNext();
                break;
            case 1:
                this.scene.start('Game', {newGame: true, finished: false});
                break;
            case 2:
                this.scene.start('Game', {newGame: true, finished: false});
                break;
        }

    }

    /**
     * Actions which happen when the esc key is pressed (depending on the state)
     */
    escKey() {

        this.scene.start('Home');           // go back to main menu

    }

    startGame() {

        this.state = 0;                 // change state to gaming

        // destroy all texts from the "before" state
        for (let i in this.texts) {
            this.texts[i].destroy();
        }

        this.texts = [];                    // empty array
        this.frame.setVisible(false);       // hide frame
        this.gameStartTime = new Date();    // set game start time

    }

    /**
     * Initiates the screen (frame and text) before the level starts (or when the game is finished).
     * @param finished {boolean} - If this is true then the game is finished.
     */
    before(finished) {

        // set the state depending on if the game is finished or not
        if (finished) {
            this.state = 1;
        }
        else {
            this.state = -1;
        }

        this.frame.setVisible(true);   // make the frame visible
        this.texts = [];               // create empty array for texts (as they need to be deleted)

        let titleText;
        let pressText;
        let lastLevel = this.levels.selectedLevel - 1;

        // add the title (level) and press (start) based on the state and the level (different for first level)
        if (this.levels.selectedLevel === 1){                   // first level
            titleText = 'Day ' + this.levels.selectedLevel;
            pressText = 'Press [ENTER] or [SPACE] to Start Day ' + this.levels.selectedLevel + '\nPress [ESC] to go back to Main Menu';
        }
        else if (finished) {                                    // game is finished
            titleText = 'All Days Completed!';
            pressText = 'Press [ENTER] or [SPACE] to Restart\nPress [ESC] to go back to Main Menu';
        }
        else {                                                  // any other levels
            titleText = 'Day ' + lastLevel + ': Completed!';
            pressText = 'Press [ENTER] or [SPACE] to Start Day ' + this.levels.selectedLevel + '\nPress [ESC] to go back to Main Menu';
        }

        let levelText = this.add.text(this.frameTopMiddle.x, this.frameTopMiddle.y + 30, titleText, this.styles.get(0))
            .setOrigin(0.5).setDepth(3);
        this.texts.push(levelText);

        // add the times (also dependent on the state)
        let ySpace = 20;
        let xSpace = 130;
        let topLeft = {x: this.frameTopLeft.x + 50, y: levelText.y + 40};

        this.texts.push(this.add.text(topLeft.x + xSpace, topLeft.y,'Your Time', this.styles.get(6)).setOrigin(0.5).setDepth(3));       // headers of the 'table'
        this.texts.push(this.add.text(topLeft.x + xSpace * 2, topLeft.y,'Par Time', this.styles.get(6)).setOrigin(0.5).setDepth(3));

        let level = 0;
        let totalTime = 0;
        let totalParTime = 0;
        let yourTimeText = '';
        let parTimeText = '';

        for (let i = 0; i < this.levels.numLevels; i++) {

            level = i+1;        // level number

            this.texts.push(this.add.text(topLeft.x, topLeft.y + ySpace * (i+1), 'Day ' + level, this.styles.get(6))
                .setOrigin(0, 0.5).setDepth(3));                // day row label

            // show only the time of the levels which are already played. In case the game is finished all times are shown
             if (i+1 < this.levels.selectedLevel || finished) {

                totalTime += this.levels.levelTimes[i];             // calculate the total time of the players
                totalParTime += this.levels.getCurrentLevel().par;  // calculate the total par time

                yourTimeText = this.convertTime(this.levels.levelTimes[i]);
                parTimeText = this.convertTime(this.levels.getCurrentLevel().par);

            }
            else {                          // if the levels are not played yet, the times will be empty
                yourTimeText = '--';
                parTimeText = '--';
            }

            // add the times
            this.texts.push(this.add.text(topLeft.x + xSpace, topLeft.y + ySpace * (i+1), yourTimeText,
                this.styles.get(6)).setOrigin(0.5).setDepth(3));
            this.texts.push(this.add.text(topLeft.x + xSpace * 2, topLeft.y + ySpace * (i+1), parTimeText, this.styles.get(6)).setOrigin(0.5).setDepth(3));

        }

        // add the divider and the total times
        this.texts.push(this.add.text(topLeft.x, topLeft.y + ySpace * 4, '--------------------------------', this.styles.get(6)).setOrigin(0, 0.5).setDepth(3));
        this.texts.push(this.add.text(topLeft.x, topLeft.y + ySpace * 5, 'Total', this.styles.get(6)).setOrigin(0, 0.5).setDepth(3));
        this.texts.push(this.add.text(topLeft.x + xSpace, topLeft.y + ySpace * 5, this.convertTime(totalTime), this.styles.get(6)).setOrigin(0.5).setDepth(3));
        this.texts.push(this.add.text(topLeft.x + xSpace * 2, topLeft.y + ySpace * 5, this.convertTime(totalParTime), this.styles.get(6)).setOrigin(0.5).setDepth(3));


        // add the start text
        this.texts.push(this.add.text(this.frameTopMiddle.x, this.frameBottomMiddle.y - 30,
            pressText, this.styles.get(1)).setOrigin(0.5).setDepth(3));

    }

    /**
     * Checks if there are any open missions. If no the level is completed.
     * @param {BlockManager} blockManLeft - Block manager of the left side
     * @param {BlockManager} blockManRight - Block manager of the right side
     */
    missionsFulfilled(blockManLeft, blockManRight) {

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

        // store the time used for this level
        this.levels.levelTimes.push(new Date() - this.gameStartTime);

        // If it is the last level, start a new level but with finished = true, so that the game finished things will
        // trigger. If it is not the last level, increase the level and start it.
        if (this.levels.lastLevel()) {
            this.scene.start('Game', {newGame: false, finished: true, levels: this.levels});
        }
        else {
            this.levels.nextLevel();
            this.scene.start('Game', {newGame: false, finished: false, levels: this.levels});
        }
    }

    /**
     * Checks the collision between blocks and dangers on one side. If a collision happens: Game Over!
     * @param {BlockManager} blockMan - Block manager from one side
     * @param {Phaser.GameObjects.Group} dangerGrp - Danger group from the same side
     */
    collisionBlockDanger(blockMan, dangerGrp) {

        let blocks = blockMan.blocks.getChildren();
        let dangers = dangerGrp.getChildren();

        for (let i in blocks) {
            for (let j in dangers) {
                if (Phaser.Geom.Intersects.RectangleToRectangle(blocks[i].getBounds(), dangers.[j].getBounds())) {
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

        let blocksLeft = blockManLeft.blocks.getChildren();
        let blocksRight = blockManRight.blocks.getChildren();

        let checkpointsLeft = checkpointsGrpLeft.getChildren();
        let checkpointsRight = checkpointsGrpRight.getChildren();

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

        let blocks = blockMan.blocks.getChildren();

        for (let i = 0; i < blocks.length; i++) {
            for (let j = i+1; j < blocks.length; j++) {
                if (Phaser.Geom.Intersects.RectangleToRectangle(blocks.[i].getBounds(), blocks.[j].getBounds())) {
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

        let blocksLeft = blockManLeft.blocks.getChildren();
        let blocksRight = blockManRight.blocks.getChildren();

        let left = {x: 0, y: 0};
        let right = {x: 0, y:0};
        let diff = {x: 0, y: 0};

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

        // update pointer
        this.mirrorPointer.x = 367 + (this.mirrorValue / this.mirrorTolerance * 236);

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

        let mm = Math.floor(time / 1000 / 60);      // minutes part of the time
        let ss = time / 1000 - mm * 60;                 // seconds part of the time

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

        return mmDisplay + ':' + ssDisplay;

    }

    /**
     * Updates the timer.
     */
    updateTime() {

        let now = new Date();
        let currentGameTime = now - this.gameStartTime;

        this.gameTime.setText(this.convertTime(currentGameTime));

    }

}