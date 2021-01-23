// imports
import 'phaser'
import bootScene from './scenes/bootScene.js';
import loadingScene from './scenes/loadingScene.js';
import homeScene from './scenes/homeScene.js';
import gameScene from './scenes/gameScene.js';

// Start
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [bootScene, loadingScene, homeScene, gameScene]
};

const game = new Phaser.Game(config);


