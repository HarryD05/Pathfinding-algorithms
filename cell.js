class Cell {
  constructor(col, row) {
    this.col = col;
    this.row = row;
    this.x = col * gridSize;
    this.y = row * gridSize;
    this.hovered = false;
    this.road = false;
  }

  render() {
    stroke(0);
    strokeWeight(1);

    if (this.road) {
      fill(120);
    } else if (this.hovered) {
      fill(180);
    } else {
      if (state === 0) {
        fill(150, 250, 150);
      } else if (state === 1) {
        fill(255, 160, 150);
      }
    }

    rectMode(CORNER)
    rect(this.x, this.y, gridSize, gridSize);
  }
}