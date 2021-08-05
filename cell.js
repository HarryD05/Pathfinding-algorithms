class Cell {
  constructor(col, row) {
    this.col = col;
    this.row = row;
    this.x = col * gridSize;
    this.y = row * gridSize;
  }

  render() {
    stroke(0);
    strokeWeight(1);
    fill(255, 255, 255);
    rectMode(CORNER)
    rect(this.x, this.y, gridSize, gridSize);

    noFill();
    text(`${this.row}, ${this.col}`, this.x + (gridSize / 2), this.y + (gridSize / 2));
    textAlign(CENTER, CENTER);
  }
}