// imports
import 'phaser'                                         // Phaser 3
import bootScene from './scenes/bootScene.js';          // 'Boot' scene
import loadingScene from './scenes/loadingScene.js';    // 'Loading' scene
import homeScene from './scenes/homeScene.js';          // 'Home' scene
import howtoScene from './scenes/howtoScene.js';        // 'How to Play' scene
import gameScene from './scenes/gameScene.js';          // 'Game' scene (main game)
import composerScene from './scenes/composerScene.js';  // 'Composer' scene

// Create the phaser config
const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [bootScene, loadingScene, homeScene, howtoScene, composerScene, gameScene],
    title: 'Inspection in Sector 723',                  // Shown in the console
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true,                                     // if true pixel perfect rendering is used
    backgroundColor: '#372134'
};

// create and start the game
const game = new Phaser.Game(config);


