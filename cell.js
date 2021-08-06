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
      fill(120, 120, 120);
    } else if (this.hovered) {
      fill(39, 119, 53);
    } else {
      fill(49, 152, 68);
    }

    rectMode(CORNER)
    rect(this.x, this.y, gridSize, gridSize);
  }
}