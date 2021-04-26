// imports
import 'phaser'
import bootScene from './scenes/bootScene.js';
import loadingScene from './scenes/loadingScene.js';
import homeScene from './scenes/homeScene.js';
import howtoScene from './scenes/howtoScene.js';
import gameScene from './scenes/gameScene.js';
import composerScene from './scenes/composerScene.js';

// Start
const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [bootScene, loadingScene, homeScene, howtoScene, composerScene, gameScene],
    title: 'Inspection in Sector 723',  // Shown in the console
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true,  // if true pixel perfect rendering is used
    backgroundColor: '#372134'
};

const game = new Phaser.Game(config);


