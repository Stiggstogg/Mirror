import Block from "../sprites/block";

/**
 * Contains all levels, creates (draws) and manages them.
 */
export default class Levels {

    /**
     * Contains all levels, creates (draws) and manages them
     * @constructor
     * @param {{x: number, y: number}} originLeft - origin (coordinates) of the top left corner of the left side
     * @param {{x: number, y: number}} originRight - origin (coordinates) of the top right corner of the right side
     * @param {number} gridSize - grid size for the placement of objects in the level (usually 12.5)
     */
    constructor(originLeft, originRight, gridSize) {

        this.levels = [];                       // create the level array which contains the different level layouts and missions

        this.gridSize = gridSize;               // store grid size for placing the different blocks. This size is half of the blocks to avoid to have holes which are exactly the same size as the blocks and it is not clear if a block can pass it. Holes should therefore be always either 1 grid size or 3.

        this.originLeft = originLeft;           // store the top left origin (corner) of the left side on the screen
        this.originRight = originRight;         // store the top right origin (corner) of the right side on the screen

        // add all levels to the array
        this.levels.push(this.level1());        // add level 1
        this.levels.push(this.level2());        // add level 2
        this.levels.push(this.level3());        // add level 3

        this.selectedLevel = 1;                 // set the currently selected level to the first one. Counter starts at 1 (and not 0)!
        this.numLevels = this.levels.length;    // get the total number of levels

        this.levelTimes = [];                   // array to store the time used for each level

    }

    /**
     * Selects a level
     * @param {number} level - number of the level (starting at 1!)
     */
    selectLevel(level) {
        this.selectedLevel = level;     // select the level with this number
    }

    /**
     * Selects the next level
     */
    nextLevel() {
        this.selectedLevel += 1;        // select the next level
    }

    /**
     * Returns true if this is the last level, else it returns false.
     * @returns {boolean} - true if it is the last level, false if it is not
     */
    lastLevel() {
        return this.selectedLevel >= this.numLevels;    // return if this is the last level
    }

    /**
     * Return the current level.
     * @returns {{layout: number[][], missions: number[][]}} - object of the current level which contains the layout (array) and the missions (array)
     */
    getCurrentLevel() {
        return this.levels[this.selectedLevel - 1];     // provide the layout and missions
    }

    /**
     * Create and draws the level based on the layout nad the missions, by adding all sprites to the two sides (left and right)
     * @param {Phaser.Scene} scene - scene for the level
     * @param {BlockManager} blockManLeft - Block manager for the left side, where all blocks from the level are added
     * @param {BlockManager} blockManRight - Block manager for the right side, where all blocks from the level are added
     * @param {Phaser.GameObjects.Group} dangerGrpLeft - Group of all danger sprites for the left side
     * @param {Phaser.GameObjects.Group} dangerGrpRight - Group of all danger sprites for the right side
     * @param {Phaser.GameObjects.Group} cpGrpLeft - Group of all checkpoint sprites for the left side
     * @param {Phaser.GameObjects.Group} cpGrpRight - Group of all checkpoint sprites for the right side
     */
    createLevel(scene, blockManLeft, blockManRight, dangerGrpLeft, dangerGrpRight, cpGrpLeft, cpGrpRight) {

        // temporary position (coordinates) variable, which is used to place the sprites in the loop to the corresponding position
        // in the canvas
        let position = {
            left: {x: 0, y: 0},     // coordinates of the left side
            right: {x: 0, y: 0}     // coordinates of the right side
        };

        // temporary checkpoint sprite variable, which is used to create the checkpoint sprite and add the number
        // before it is added to the group
        let cpLeft;                 // left side
        let cpRight;                // right side

        // get level layout of the current level
        const layout = this.getCurrentLevel().layout;

        // get missions of the current level
        const block1mission = this.getCurrentLevel().missions[0];       // mission of block 1 (normal)
        const block2mission = this.getCurrentLevel().missions[1];       // mission of block 2 (pirate)
        const block3mission = this.getCurrentLevel().missions[2];       // mission of block 3 (glasses)

        // loop through the layout of the level and draw all sprites on both sides
        for (let r = 0; r < layout.length; r++) {               // rows of the layout
            for (let c = 0; c < layout[r].length; c++) {        // each column of a row (of the layout)

                // calculate the current position on the left side (coordinates of the current element in the grid)
                position.left = {
                    x: this.originLeft.x + this.gridSize * c,   // x coordinate: origin + grid size * column number
                    y: this.originRight.y + this.gridSize * r   // y coordinate: origin + grid size * row number
                }

                // calculate the current position on the right side (coordinates of the current element in the grid)
                position.right = {
                    x: this.originRight.x - this.gridSize * c,   // x coordinate: origin - grid size * column number (as the grid is mirrored on the right side it starts on the top right)
                    y: position.left.y                           // y coordinate: the same for the left side as it is only horizontally mirrored
                }

                // based on the number in the layout place the corresponding sprite / object at both sides
                switch (layout[r][c]) {
                    case 1:                                                                                             // block: normal
                        // create block on the left and right side and add it to the corresponding block manager
                        blockManLeft.addBlock(new Block(scene, position.left.x, position.left.y, 1, 'left', block1mission));
                        blockManRight.addBlock(new Block(scene, position.right.x, position.right.y, 1, 'right', block1mission));
                        break;
                    case 2:                                                                                             // block: pirate
                        // create block on the left and right side and add it to the corresponding block manager
                        blockManLeft.addBlock(new Block(scene, position.left.x, position.left.y, 2, 'left', block2mission));
                        blockManRight.addBlock(new Block(scene, position.right.x, position.right.y, 2, 'right', block2mission));
                        break;
                    case 3:                                                                                             // block: glasses
                        // create block on the left and right side and add it to the corresponding block manager
                        blockManLeft.addBlock(new Block(scene, position.left.x, position.left.y, 3, 'left', block3mission));
                        blockManRight.addBlock(new Block(scene, position.right.x, position.right.y, 3, 'right', block3mission));
                        break;
                    case 4:                                                                                             // danger block
                        // create block on the left and right side and add it to the danger block group
                        dangerGrpLeft.add(scene.add.sprite(position.left.x, position.left.y, 'danger'));
                        dangerGrpRight.add(scene.add.sprite(position.right.x, position.right.y, 'danger'));
                        break;
                    case 5:                                                                                             // checkpoint 1: tree
                        cpLeft = scene.add.sprite(position.left.x, position.left.y, 'checkpoint', 0);      // create sprite
                        cpRight = scene.add.sprite(position.right.x, position.right.y, 'checkpoint', 0);
                        cpLeft.cpNum = 1;                                                                               // add checkpoint number to the sprite
                        cpRight.cpNum = 1;
                        cpGrpLeft.add(cpLeft);                                                                          // add sprite to group
                        cpGrpRight.add(cpRight);
                        break;
                    case 6:                                                                                             // checkpoint 2: rocket
                        cpLeft = scene.add.sprite(position.left.x, position.left.y, 'checkpoint', 1);       // create sprite
                        cpRight = scene.add.sprite(position.right.x, position.right.y, 'checkpoint', 1);
                        cpLeft.cpNum = 2;                                                                               // add checkpoint number to the sprite
                        cpRight.cpNum = 2;
                        cpGrpLeft.add(cpLeft);                                                                          // add sprite to group
                        cpGrpRight.add(cpRight);
                        break;
                    case 7:                                                                                             // checkpoint 3: potato
                        cpLeft = scene.add.sprite(position.left.x, position.left.y, 'checkpoint', 2);       // create sprite
                        cpRight = scene.add.sprite(position.right.x, position.right.y, 'checkpoint', 2);
                        cpLeft.cpNum = 3;                                                                               // add checkpoint number to the sprite
                        cpRight.cpNum = 3;
                        cpGrpLeft.add(cpLeft);                                                                          // add sprite to group
                        cpGrpRight.add(cpRight);
                        break;
                    default:                                                                                            // do nothing, usually when 0 is in the layout
                        break;
                }

            }

        }

    }

    /**
     * Creates a non interactive level, by adding all sprite to the two sides (left and right). Used for the
     * 'How to play' scene where the level is non-interactive
     * @param {Phaser.Scene} scene - scene for the level
     */
    createNonInteractiveLevel(scene) {

        // temporary position (coordinates) variable, which is used to place the sprites in the loop to the corresponding position
        // in the canvas
        let position = {
            left: {x: 0, y: 0},     // coordinates of the left side
            right: {x: 0, y: 0}     // coordinates of the right side
        };

        // get level layout of the current level
        const layout = this.getCurrentLevel().layout;

        // get missions of the current level
        const block1mission = this.getCurrentLevel().missions[0];       // mission of block 1 (normal)
        const block2mission = this.getCurrentLevel().missions[1];       // mission of block 2 (pirate)
        const block3mission = this.getCurrentLevel().missions[2];       // mission of block 3 (glasses)

        // loop through the layout of the level and draw all sprites on both sides
        for (let r = 0; r < layout.length; r++) {
            for (let c = 0; c < layout[r].length; c++) {

                position.left = {
                    x: this.originLeft.x + this.gridSize * c,
                    y: this.originRight.y + this.gridSize * r
                }

                position.right = {
                    x: this.originRight.x - this.gridSize * c,
                    y: position.left.y
                }

                switch (layout[r][c]) {
                    case 1:                                                                                             // block: normal
                        // create block on the left and right side
                        scene.add.existing(new Block(scene, position.left.x, position.left.y, 1, 'left', block1mission)).act();
                        scene.add.existing(new Block(scene, position.right.x, position.right.y, 1, 'right', block1mission)).act();
                        break;
                    case 2:                                                                                             // block: pirate
                        // create block on the left and right side
                        scene.add.existing(new Block(scene, position.left.x, position.left.y, 2, 'left', block2mission));
                        scene.add.existing(new Block(scene, position.right.x, position.right.y, 2, 'right', block2mission));
                        break;
                    case 3:                                                                                             // block: glasses
                        // create block on the left and right side
                        scene.add.existing(new Block(scene, position.left.x, position.left.y, 3, 'left', block3mission));
                        scene.add.existing(new Block(scene, position.right.x, position.right.y, 3, 'right', block3mission));
                        break;
                    case 4:                                                                                             // danger block
                        // create danger block on the left and right side
                        scene.add.image(position.left.x, position.left.y, 'danger');
                        scene.add.image(position.right.x, position.right.y, 'danger');
                        break;
                    case 5:                                                                                             // checkpoint 1: tree
                        // create checkpoint on the left and right side
                        scene.add.image(position.left.x, position.left.y, 'checkpoint', 0);
                        scene.add.image(position.right.x, position.right.y, 'checkpoint', 0);
                        break;
                    case 6:                                                                                             // checkpoint 2: rocket
                        // create checkpoint on the left and right side
                        scene.add.image(position.left.x, position.left.y, 'checkpoint', 1);
                        scene.add.image(position.right.x, position.right.y, 'checkpoint', 1);
                        break;
                    case 7:                                                                                             // checkpoint 3: potato
                        // create checkpoint on the left and right side
                        scene.add.image(position.left.x, position.left.y, 'checkpoint', 2);
                        scene.add.image(position.right.x, position.right.y, 'checkpoint', 2);
                        break;
                    default:                                                                                            // do nothing, usually when 0 is in the layout
                        break;
                }

            }

        }

    }

    /**
     * Level 1: Returns all information for this level, including missions, par time and level layout
     * @returns {{layout: number[][], par: number, missions: number[][]}} - Level with all information including missions, par time and layout
     */
    level1() {

        // level object which contains missions, par time and layout
        // position in the layout shows the left side and is then mirrored for the right side
        // position is based on the grid (size: 12.5), however every block is double this size (four grid elements = 1 block)
        // to be drawn at the correct position the number of the block needs to be in the bottom right grid element of the
        // the elements which are used for a block
        // use the 'Level-Generator.xlsm' sheet to draw the levels

        let level = {
            missions: [
                [2],                 // mission of the normal block
                [3],                 // mission of the pirate block
                [1, 3],              // mission of the glasses block
            ],
            par: 27000,              // par time in ms
            layout: [                // level layout (0: empty, 1: normal block, 2: pirate block, 3: glasses block, 4: danger block, 5: checkpoint 1 (tree), 6: checkpoint 2 (rocket), 7: checkpoint 3 (potato)
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 2, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 4],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        }

        return level;

    }

    /**
     * Level 2: Returns all information for this level, including missions, par time and level layout
     * @returns {{layout: number[][], par: number, missions: number[][]}} - Level with all information including missions, par time and layout
     */
    level2() {

        // level object which contains missions, par time and layout
        // position in the layout shows the left side and is then mirrored for the right side
        // position is based on the grid (size: 12.5), however every block is double this size (four grid elements = 1 block)
        // to be drawn at the correct position the number of the block needs to be in the bottom right grid element of the
        // the elements which are used for a block
        // use the 'Level-Generator.xlsm' sheet to draw the levels
        let level = {
            missions: [
                [1],                    // mission of the normal block
                [2, 1],                 // mission of the pirate block
                [2, 3, 1],              // mission of the glasses block
            ],
            par: 84000,                 // par time in ms
            layout: [                   // level layout (0: empty, 1: normal block, 2: pirate block, 3: glasses block, 4: danger block, 5: checkpoint 1 (tree), 6: checkpoint 2 (rocket), 7: checkpoint 3 (potato)
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0],
                [0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 4, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        }

        return level;

    }

    /**
     * Level 3: Returns all information for this level, including missions, par time and level layout
     * @returns {{layout: number[][], par: number, missions: number[][]}} - Level with all information including missions, par time and layout
     */
    level3() {

        // level object which contains missions, par time and layout
        // position in the layout shows the left side and is then mirrored for the right side
        // position is based on the grid (size: 12.5), however every block is double this size (four grid elements = 1 block)
        // to be drawn at the correct position the number of the block needs to be in the bottom right grid element of the
        // the elements which are used for a block
        // use the 'Level-Generator.xlsm' sheet to draw the levels
        let level = {
            missions: [
                [2, 3, 1],            // mission of the normal block
                [1, 3],               // mission of the pirate block
                [2, 3],               // mission of the glasses block
            ],
            par: 245000,              // par time in ms
            layout: [                 // level layout (0: empty, 1: normal block, 2: pirate block, 3: glasses block, 4: danger block, 5: checkpoint 1 (tree), 6: checkpoint 2 (rocket), 7: checkpoint 3 (potato)
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 0, 0, 5],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3]
            ]
        }

        return level;

    }

    /**
     * Level 0 (Test Level!): Returns all information for this level, including missions, par time and level layout
     * @returns {{layout: number[][], par: number, missions: number[][]}} - Level with all information including missions, par time and layout
     */
    level0() {

        // level object which contains missions, par time and layout
        // position in the layout shows the left side and is then mirrored for the right side
        // position is based on the grid (size: 12.5), however every block is double this size (four grid elements = 1 block)
        // to be drawn at the correct position the number of the block needs to be in the bottom right grid element of the
        // the elements which are used for a block
        // use the 'Level-Generator.xlsm' sheet to draw the levels
        let level = {
            missions: [
                [1, 2],             // mission of the normal block
                [],                 // mission of the pirate block
                [],                 // mission of the glasses block
            ],
            par: 10000,                 // par time in ms
            layout: [                   // level layout (0: empty, 1: normal block, 2: pirate block, 3: glasses block, 4: danger block, 5: checkpoint 1 (tree), 6: checkpoint 2 (rocket), 7: checkpoint 3 (potato)
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        }

        return level;

    }

}