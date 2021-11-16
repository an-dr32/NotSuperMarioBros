export class Scoreboard {
  constructor(scene) {
    this.relatedScene = scene;
    this.score = 0;
    this.level = 1;
  }

  create() {
      //SCORE
      this.scoreText = this.relatedScene.add.text(16, 23, 'PUNTOS: 0', {       // add the score text to the game  (x, y, text, style)     
        fontSize: '20px',                                // set the font size of the text
        fill: '#fff',                     // set the color of the text
        fontFamily: 'Super-Mario-World',        // set the font family of the text
    });
    
    //LEVEL
    this.levelText = this.relatedScene.add.text(16, 50, 'NIVEL: 1', {       // add the score text to the game  (x, y, text, style)
      fontSize: '20px',                                // set the font size of the text
      fill: '#fff',                     // set the color of the text
      fontFamily: 'Super-Mario-World'         // set the font family of the text
    });
  }

  incrementPoints(points) {
    this.score += points * this.level;                   // increment the score
    this.scoreText.setText('PUNTOS: ' + this.score); // set the text of the score text
  }
  incrementLevel() {
    this.level += 1;
    this.levelText.setText('NIVEL: ' + this.level);
  }
}