import { Game } from '../game.js'; // Import the Game class from the game.js file in the same directory as this file is located. 

const config = {
    type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas. 
    width: 800, // The width of the game.
    height: 600, // The height of the game.
    scene: [Game], // The scenes that will be used in the game.
    physics: {   // Physics configuration.
        default: 'arcade', // The default physics system.
        arcade: {         // The Arcade Physics system.
            gravity: { y: 300 },  // The gravity of the game. 
            debug: false // Display debug information.
        }
    },
};

var game = new Phaser.Game(config) // Create a new instance of Phaser.Game with the config object. 