class Edge {
  constructor(a, b, cost, index) {
    this.a = a;
    this.b = b;
    this.cost = cost;
    this.index = index;

    this.aCentre = createVector(
      (nodes[this.a].pos.col * gridSize) + (gridSize / 2),
      (nodes[this.a].pos.row * gridSize) + (gridSize / 2)
    );

    this.bCentre = createVector(
      (nodes[this.b].pos.col * gridSize) + (gridSize / 2),
      (nodes[this.b].pos.row * gridSize) + (gridSize / 2)
    );

    this.centre = createVector(
      (this.aCentre.x + this.bCentre.x) / 2,
      (this.aCentre.y + this.bCentre.y) / 2
    );

    this.hover = false;
    this.selected = false;
  }

  checkHover(x, y) {
    this.hover = (sqrt(pow(this.centre.x - x, 2) + pow(this.centre.y - y, 2)) <= 12);

    if (this.hover && mouseIsPressed) {
      edges.forEach(edge => edge.selected = false);
      this.selected = true;
      selected = this.index;
    }
  }

  render() {
    this.checkHover(mouseX, mouseY);

    strokeWeight(4);
    stroke(0);
    if (this.selected) {
      stroke(0, 0, 255);
    }
    line(this.aCentre.x, this.aCentre.y, this.bCentre.x, this.bCentre.y);

    //LABELLING EDGE WITH COST
    noStroke();
    fill(255);
    if (this.hover || this.selected) {
      fill(200);
    }
    ellipseMode(CENTER);
    ellipse(this.centre.x, this.centre.y, 24, 24);

    strokeWeight(1);
    stroke(0);
    noFill();
    textAlign(CENTER, CENTER);
    text(this.cost, this.centre.x, this.centre.y);
  }
}