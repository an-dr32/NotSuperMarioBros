import { Scoreboard } from './components/Scoreboard.js'; // Import the scoreboard component from the components folder and assign it to the Scoreboard variable 

export class Game extends Phaser.Scene {
    
    constructor(){
        super({ key: 'game' });
    }

    init(){ // init all the objects
        this.scoreboard = new Scoreboard(this);
    }

    /* constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
        this.scene.add('Boot', BootScene);
        this.scene.add('Preloader', PreloaderScene);
        this.scene.add('MainMenu', MainMenuScene);
        this.scene.add('Game', GameScene);
        this.scene.add('GameOver', GameOverScene);
        this.scene.start('Boot');
    } */


    preload(){ // preload all the images
        
        // load the images
        this.load.image('sky', '../assets/pngs/sky2.png');
        this.load.image('ground', '../assets/pngs/platforms.png');
        this.load.image('star', '../assets/pngs/coin.png');
        this.load.image('bomb', '../assets/pngs/bombo.png');
        this.load.image('gameover', '../assets/pngs/gameover.png'); // load the gameover image for the game
        this.load.spritesheet('dude', '../assets/pngs/duda.png', { frameWidth: 40, frameHeight: 60 }); 
        // load the player image and set the frame width and height to 32 and 48 respectively (the frame width and height is the size of the image)
        
        // load the sounds
        this.load.audio('jumpR', '../assets/sounds/jump_right.mp3');
        this.load.audio('jumpL', '../assets/sounds/jump_left.mp3');
        this.load.audio('coin', '../assets/sounds/coin.mp3');
        this.load.audio('bgSound', '../assets/sounds/soundtrack.mp3'); 
        this.load.audio('deathSound', '../assets/sounds/deadM.mp3');
        this.load.audio('stomp', '../assets/sounds/stomp.mp3');  
        this.load.audio('whoohoo', '../assets/sounds/woohoo.mp3');      
        // load the fonts
        

    }

    
    create(){ // create all the objects
        
        // create the objects
        
        //BACKGROUND
        this.add.image(400, 300, 'sky'); // add the sky image to the game

        

        //SCOREBOARD
        this.scoreboard.create(); // create the scoreboard

        //PLATFORM
        this.platforms = this.physics.add.staticGroup(); // add the platforms
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody(); // create the ground
        this.platforms.create(600, 400, 'ground'); // create the second ground
        this.platforms.create(50, 250, 'ground'); // create the third ground
        this.platforms.create(750, 220, 'ground'); // create the fourth ground

        //PLAYER
        //DUDE the player
        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2); // our player will bounce from items
        this.player.setCollideWorldBounds(true); // our player will bounce when it hits the world bounds

        //PLAYER MOVEMENT
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1 // repeat the animation forever
        });

        this.anims.create({
            key: 'turn', // create the turn animation
            frames: [ { key: 'dude', frame: 4 } ], // frame 4 is the frame of the player when it turns
            frameRate: 20 // repeat the animation twice per second
        });

        this.anims.create({
            key: 'right', // create the right animation
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }), // frame 5 to 8 are the frames of the player when it turns
            frameRate: 10, 
            repeat: -1 // repeat the animation forever
        });
        
        this.anims.create({
            key: 'jump_right', // create the jump right animation
            frames: [ { key: 'dude', frame: 7 } ], // frame 3 is the frame of the player when it jumps
            frameRate: 20 // repeat the animation twice per second
        });

        this.anims.create({
            key: 'jump_left', // create the jump left animation
            frames: [ { key: 'dude', frame: 1 } ], // frame 3 is the frame of the player when it jumps
            frameRate: 20 // repeat the animation twice per second
        });

        //STAR
        this.stars = this.physics.add.group({ // add the stars
            key: 'star', // set the key to star
            repeat: 11, // set the repeat to 11
            setXY: { x: 12, y: 0, stepX: 70 } // set the x and y position and the stepX to 70
        });
        
        this.stars.children.iterate(function (child) { // iterate through the stars
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)); // set the bounceY to a random number between 0.4 and 0.8
        });

        //BOMB
        this.bombs = this.physics.add.group(); // add the bombs

        //COLLIDER
        this.physics.add.collider(this.platforms, this.player); // add the player and the platforms to collide
        this.physics.add.collider(this.stars, this.platforms); // add the stars and the platforms to collide
        this.physics.add.collider(this.bombs, this.platforms); // add the bombs and the platforms to collide
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this); // add the player and the bombs to collide and call the hitBomb function when the player collides with the bomb
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this); // add the player and the stars to overlap

        //CURSORS AND KEYS
        this.cursors = this.input.keyboard.createCursorKeys(); // create the cursors  
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // create the space key
                
        // create the sounds
        this.jumpRSound = this.sound.add('jumpR'); // add the jump right sound to the game 
        this.jumpLSound = this.sound.add('jumpL'); // add the jump left sound to the game
        this.coinSound = this.sound.add('coin'); // add the coin sound to the game
        this.bgSound = this.sound.add('bgSound'); // add the background sound to the game
        this.bgSound.loop = true; // add the background sound to loop
        this.bgSound.volume = 0.7; // set the volume of the background sound to 0.7
        this.bgSound.play(); // play the background soundthis.bgSound.play(); // play the background sound
        this.stompSound = this.sound.add('stomp'); // add the stomp sound to the game
        this.stompSound.volume = 0.5; // set the volume of the stomp sound to 0.7
        this.whoohooSound = this.sound.add('whoohoo'); // add the whoohoo sound to the game
        this.deathSound = this.sound.add('deathSound'); // add the death sound to the game

        
        // create the fonts
        //GAMEOVER
        this.gameOverImage = this.add.image(400, 300, 'gameover'); // add the gameover image to the game
        this.gameOverImage.setVisible(false); // set the gameover image to be invisible
        
    }

    update(){ // update all the objects
        
        // update the objects
        if (this.cursors.left.isDown) { // if the left arrow is pressed
            this.player.setVelocityX(-160); // move the player left
            this.player.anims.play('left', true); // play the left animation

        } else if (this.cursors.right.isDown) { // if the right arrow is pressed    
            this.player.setVelocityX(160); // move the player right 
            this.player.anims.play('right', true); // play the right animation

        } else { // if neither the left or right arrow is pressed
            this.player.setVelocityX(0); // stop the player
            this.player.anims.play('turn'); // play the turn animation

        } 

        if (this.cursors.up.isDown && this.cursors.right.isDown) { // if the up arrow is pressed)
            this.player.anims.play('jump_right', true); // play the jump animation
        }

        if (this.cursors.up.isDown && this.cursors.left.isDown) { // if the up arrow is pressed)
            this.player.anims.play('jump_left', true); // play the jump animation
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) { // if the up arrow is pressed and the player is touching the ground 
            this.player.setVelocityY(-330); // move the player up
            this.jumpRSound.play(); // play the jump right sound
        }

        if (this.cursors.down.isDown) { // if the down arrow is pressed
            this.player.setVelocityY(330); // move the player down
            this.player.anims.play('jump', true); // play the jump right animation
        }

        /* if (this.cursors.down.isDown && this.player.body.touching.none) { // if the down arrow is pressed and the player is not touching the ground
            this.whoohooSound.play(); // play the whoohoo sound
        } */

        /* if(this.cursors.down.isDown && this.player.body.touching.none && !this.player.body.touching.down){ // if the down arrow is pressed and the player is not touching the ground
            this.whoohooSound.play(); 
        } */
        
        if (this.cursors.down.isDown && this.player.body.touching.down) { // if the down arrow is pressed and the player is touching the ground
            this.stompSound.play(); // play the stomp sound 
        }

        if(this.spaceKey.isDown) // if the cursor is pressed
        {
            this.restartGame(); // restart the game scene
        }

        // update the sounds
        
        // update the fonts
    }

    collectStar (player, star) { // collect the star function 
        star.disableBody(true, true); // disable the star and the body of the star 
        this.coinSound.play(); // play the coin sound
        this.scoreboard.incrementPoints(10); // increment the points by 10
        if (this.stars.countActive(true) === 0) { // if there are no stars left
            this.scoreboard.incrementLevel(); // increment the level
            this.stars.children.iterate(function (child) { // iterate through the stars
                child.enableBody(true, child.x, 0, true, true); // enable the star and the body of the star
            });

            this.x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400); // set the x position of the stars to a random number between 400 and 800
            var bomb = this.bombs.create(this.x, 16, 'bomb'); // create the bomb at the x position of the stars
            bomb.setBounce(1); // set the bounce of the bomb to 1
            bomb.setCollideWorldBounds(true); // set the collide world bounds of the bomb to true
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20); // set the velocity of the bomb to a random number between -200 and 200 and 20
            bomb.allowGravity = false; // set the allow gravity of the bomb to false

            

        }
    }

    hitBomb (player, bomb) {
        this.gameOverImage.setVisible(true); // set the gameover image to be visible
        this.bombs.setVisible(false); // set the bombs to be invisible
        this.player.setVisible(false); // set the player to be invisible
        this.physics.pause(); // pause the physics
        this.player.setTint(0xff0000); // set the player to be red
        this.player.anims.play('turn'); // play the turn animation
        this.gameOver = true; // set the gameover to be true
        this.bgSound.stop(); // stop the background sound
        this.deathSound.play(); // play the death sound
    }

    restartGame() { // restart the game function
        this.gameOverImage.setVisible(false); // set the gameover image to be invisible
        this.physics.resume(); // resume the physics
        this.player.setTint(0xffffff); // set the player to be white
        this.player.setPosition(100, 500); // set the player to be at 100, 500
        this.scoreboard.resetPoints(); // reset the points
        this.scoreboard.resetLevel(); // reset the level
        this.gameOver = false; // set the gameover to be false
        this.bgSound.play(); // play the background sound
    }
}