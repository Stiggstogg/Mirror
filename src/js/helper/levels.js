import Block from "../sprites/block";

/**
 * Contains all levels and manages them
 */
export default class Levels {

    /**
     * Contains all levels and manages them
     * @constructor
     */
    /**
     * Contains all levels and manages them
     * @constructor
     * @param {{x: number, y: number}} originLeft - origin (coordinates) of the top left corner of the left side
     * @param {{x: number, y: number}} originRight - origin (coordinates) of the top right corner of the right side
     * @param {number} gridSize - grid size for the placement of objects in the level
     */
    constructor(originLeft, originRight, gridSize) {

        this.levels = [];

        this.gridSize = gridSize;

        this.originLeft = originLeft;
        this.originRight = originRight;

        // add all levels
        this.levels.push(this.level1());
        this.levels.push(this.level2());
        this.levels.push(this.level3());

        this.selectedLevel = 1;
        this.numLevels = this.levels.length;

        this.levelTimes = [];

    }

    /**
     * Selects a level
     * @param {number} level - number of the level (starting at 1!)
     */
    selectLevel(level) {
        this.selectedLevel = level;
    }

    /**
     * Selects the next level
     */
    nextLevel() {
        this.selectedLevel += 1;
    }

    /**
     * Returns true if this is the last level, else it returns false.
     * @returns {boolean} - True if it is the last level, false if it is not
     */
    lastLevel() {
        return this.selectedLevel >= this.numLevels;
    }

    /**
     * Return the current level.
     * @returns {{layout: number[][], missions: number[][]}}
     */
    getCurrentLevel() {
        return this.levels[this.selectedLevel - 1];
    }

    /**
     * Create the level, by adding all sprite to the two sides (left and right)
     * @param {Phaser.Scene} scene - scene for the level
     * @param {BlockManager} blockManLeft - Block manager for the left side, where all blocks from the level are added
     * @param {BlockManager} blockManRight - Block manager for the right side, where all blocks from the level are added
     * @param {Phaser.GameObjects.Group} dangerGrpLeft - Group of all danger sprites for the left side
     * @param {Phaser.GameObjects.Group} dangerGrpRight - Group of all danger sprites for the right side
     * @param {Phaser.GameObjects.Group} cpGrpLeft - Group of all checkpoint sprites for the left side
     * @param {Phaser.GameObjects.Group} cpGrpRight - Group of all checkpoint sprites for the right side
     */
    createLevel(scene, blockManLeft, blockManRight, dangerGrpLeft, dangerGrpRight, cpGrpLeft, cpGrpRight) {

        // temporary position variable
        let position = {
            left: {x: 0, y: 0},
            right: {x: 0, y: 0}
        };

        // temporary checkpoint sprite variable
        let cpLeft;
        let cpRight;

        // get level layout
        const layout = this.getCurrentLevel().layout;

        // get missions
        const block1mission = this.getCurrentLevel().missions[0];       // mission of block 1 (normal)
        const block2mission = this.getCurrentLevel().missions[1];       // mission of block 2 (pirate)
        const block3mission = this.getCurrentLevel().missions[2];       // mission of block 3 (glasses)

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
                    case 1:
                        blockManLeft.addBlock(new Block(scene, position.left.x, position.left.y, 1, 'left', block1mission));
                        blockManRight.addBlock(new Block(scene, position.right.x, position.right.y, 1, 'right', block1mission));
                        break;
                    case 2:
                        blockManLeft.addBlock(new Block(scene, position.left.x, position.left.y, 2, 'left', block2mission));
                        blockManRight.addBlock(new Block(scene, position.right.x, position.right.y, 2, 'right', block2mission));
                        break;
                    case 3:
                        blockManLeft.addBlock(new Block(scene, position.left.x, position.left.y, 3, 'left', block3mission));
                        blockManRight.addBlock(new Block(scene, position.right.x, position.right.y, 3, 'right', block3mission));
                        break;
                    case 4:
                        dangerGrpLeft.add(scene.add.sprite(position.left.x, position.left.y, 'danger'));
                        dangerGrpRight.add(scene.add.sprite(position.right.x, position.right.y, 'danger'));
                        break;
                    case 5:                                                                                              // checkpoint 1: tree
                        cpLeft = scene.add.sprite(position.left.x, position.left.y, 'checkpoint', 0);       // create sprite
                        cpRight = scene.add.sprite(position.right.x, position.right.y, 'checkpoint', 0);
                        cpLeft.cpNum = 1;                                                                               // add checkpoint number
                        cpRight.cpNum = 1;
                        cpGrpLeft.add(cpLeft);                                                                          // add to group
                        cpGrpRight.add(cpRight);
                        break;
                    case 6:                                                                                             // checkpoint 2: rocket
                        cpLeft = scene.add.sprite(position.left.x, position.left.y, 'checkpoint', 1);       // create sprite
                        cpRight = scene.add.sprite(position.right.x, position.right.y, 'checkpoint', 1);
                        cpLeft.cpNum = 2;                                                                               // add checkpoint number
                        cpRight.cpNum = 2;
                        cpGrpLeft.add(cpLeft);                                                                          // add to group
                        cpGrpRight.add(cpRight);
                        break;
                    case 7:                                                                                             // checkpoint 3: potato
                        cpLeft = scene.add.sprite(position.left.x, position.left.y, 'checkpoint', 2);       // create sprite
                        cpRight = scene.add.sprite(position.right.x, position.right.y, 'checkpoint', 2);
                        cpLeft.cpNum = 3;                                                                               // add checkpoint number
                        cpRight.cpNum = 3;
                        cpGrpLeft.add(cpLeft);                                                                          // add to group
                        cpGrpRight.add(cpRight);
                        break;
                    default:
                        break;
                }

            }

        }

    }

    /**
     * Creates a non interactive level, by adding all sprite to the two sides (left and right)
     * @param {Phaser.Scene} scene - scene for the level
     */
    createNonInteractiveLevel(scene) {

        // temporary position variable
        let position = {
            left: {x: 0, y: 0},
            right: {x: 0, y: 0}
        };

        // get level layout
        const layout = this.getCurrentLevel().layout;

        // get missions
        const block1mission = this.getCurrentLevel().missions[0];       // mission of block 1 (normal)
        const block2mission = this.getCurrentLevel().missions[1];       // mission of block 2 (pirate)
        const block3mission = this.getCurrentLevel().missions[2];       // mission of block 3 (glasses)

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
                    case 1:
                        scene.add.existing(new Block(scene, position.left.x, position.left.y, 1, 'left', block1mission)).act();
                        scene.add.existing(new Block(scene, position.right.x, position.right.y, 1, 'right', block1mission)).act();
                        break;
                    case 2:
                        scene.add.existing(new Block(scene, position.left.x, position.left.y, 2, 'left', block2mission));
                        scene.add.existing(new Block(scene, position.right.x, position.right.y, 2, 'right', block2mission));
                        break;
                    case 3:
                        scene.add.existing(new Block(scene, position.left.x, position.left.y, 3, 'left', block3mission));
                        scene.add.existing(new Block(scene, position.right.x, position.right.y, 3, 'right', block3mission));
                        break;
                    case 4:
                        scene.add.image(position.left.x, position.left.y, 'danger');
                        scene.add.image(position.right.x, position.right.y, 'danger');
                        break;
                    case 5:
                        scene.add.image(position.left.x, position.left.y, 'checkpoint', 0);
                        scene.add.image(position.right.x, position.right.y, 'checkpoint', 0);
                        break;
                    case 6:
                        scene.add.image(position.left.x, position.left.y, 'checkpoint', 1);
                        scene.add.image(position.right.x, position.right.y, 'checkpoint', 1);
                        break;
                    case 7:
                        scene.add.image(position.left.x, position.left.y, 'checkpoint', 2);
                        scene.add.image(position.right.x, position.right.y, 'checkpoint', 2);
                        break;
                    default:
                        break;
                }

            }

        }

    }


    /**
     * Level 1: Returns all information for this level, including missions and level layout
     * @returns {{layout: number[][], par: number, missions: number[][]}} - Level with all information including missions and layout
     */
    level1() {

        let level = {
            missions: [
                [2],                    // mission of the normal block
                [3],                 // mission of the pirate block
                [1, 3],              // mission of the glasses block
            ],
            par: 27000,                 // par time in ms
            layout: [
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
     * Level 2: Returns all information for this level, including missions and level layout
     * @returns {{layout: number[][], par: number, missions: number[][]}} - Level with all information including missions and layout
     */
    level2() {

        let level = {
            missions: [
                [1],                    // mission of the normal block
                [2, 1],                 // mission of the pirate block
                [2, 3, 1],              // mission of the glasses block
            ],
            par: 84000,                 // par time in ms
            layout: [
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
     * Level 3: Returns all information for this level, including missions and level layout
     * @returns {{layout: number[][], par: number, missions: number[][]}} - Level with all information including missions and layout
     */
    level3() {

        let level = {
            missions: [
                [2, 3, 1],                    // mission of the normal block
                [1, 3],                 // mission of the pirate block
                [2, 3],              // mission of the glasses block
            ],
            par: 245000,                 // par time in ms
            layout: [
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
     * Level 0 (Test Level!): Returns all information for this level, including missions and level layout
     * @returns {{layout: number[][], par: number, missions: number[][]}} - Level with all information including missions and layout
     */
    level0() {

        let level = {
            missions: [
                [1, 2],              // mission of the normal block
                [],              // mission of the pirate block
                [],              // mission of the glasses block
            ],
            par: 10000,                 // par time in ms
            layout: [
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