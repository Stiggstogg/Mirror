// imports
import 'phaser'
import bootScene from './scenes/bootScene.js';
import loadingScene from './scenes/loadingScene.js';
import homeScene from './scenes/homeScene.js';
import gameScene from './scenes/gameScene.js';

// Start
const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [bootScene, loadingScene, homeScene, gameScene],
    title: 'Mirror Game',  // Shown in the console
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true,  // if true pixel perfect rendering is used
};

const game = new Phaser.Game(config);


