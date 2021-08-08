//#########################
//# Edge class definition #
//#########################

//Each connection between 2 nodes in the graph is an edge which has a cost
class Edge {
  //Constructor method for class
  constructor(a, b, cost, index) {
    //Setting the passed in attributes 
    //(start and end nodes, cost of the edge and the index of the edge in the global edges array)
    this.a = a;
    this.b = b;
    this.cost = cost;
    this.index = index;

    //Setting properties to help with drawing and checking for mouse interactions in this class' methods
    //Centre point of the start node of the edge
    this.aCentre = createVector(
      (nodes[this.a].pos.col * gridSize) + (gridSize / 2),
      (nodes[this.a].pos.row * gridSize) + (gridSize / 2)
    );

    //Centre point of the start node of the edge
    this.bCentre = createVector(
      (nodes[this.b].pos.col * gridSize) + (gridSize / 2),
      (nodes[this.b].pos.row * gridSize) + (gridSize / 2)
    );

    //Midpoint of the edge (as an edge can be drawn as a straigh line between the 2 nodes)
    this.centre = createVector(
      (this.aCentre.x + this.bCentre.x) / 2,
      (this.aCentre.y + this.bCentre.y) / 2
    );

    //Setting the hover and selected attributes for mouse interaction
    this.hover = false;
    this.selected = false;
  }

  //Method to check if the coordinates passed in (mouse position) are over the circle in the centre of the edge
  //which is displaying the cost of the edge
  checkHover(x, y) {
    this.hover = (sqrt(pow(this.centre.x - x, 2) + pow(this.centre.y - y, 2)) <= 12);

    //If the mouse is over the edge and the mouse is being pressed then the edge has been selected by the user
    if (this.hover && mouseIsPressed) {
      //Deselecting all edges so the previously selected edge is no longer selected
      edges.forEach(edge => edge.selected = false);

      //Setting this edge to the currently selected edge
      this.selected = true;
      selected = this.index;
    }
  }

  //Method that draws the edge on the canvas as a line between the 2 end nodes and a circle with the edge cost 
  //in the centre
  render() {
    //DRAWING THE EDGE AS A STRAIGHT LINE
    //Setting the stroke properties of the line (a thick black line)
    strokeWeight(4);
    stroke(0);
    //If the edge is currently selected make the line blue instead of black
    if (this.selected) {
      stroke(0, 0, 255);
    }
    //Draw the line (edge) between the centre points of the 2 end nodes
    line(this.aCentre.x, this.aCentre.y, this.bCentre.x, this.bCentre.y);

    //LABELLING EDGE WITH COST
    //Drawing a white circle in the centre of the edge so the edge cost can be displayed ontop
    noStroke(); //No outline
    fill(255); //white fill
    if (this.hover || this.selected) {
      fill(225); //if the edge is being hovered over or is selected then draw a grey circle
    }
    //Drawing the circle at the centre of the edge with a diameter of 24 pixels
    ellipseMode(CENTER);
    ellipse(this.centre.x, this.centre.y, 24, 24);

    //Writing the cost of the edge in the circle in the centre of the edge
    //Setting the stroke and fill properties so the text is displayed normally (a thin black font)
    strokeWeight(1);
    stroke(0);
    noFill();
    textAlign(CENTER, CENTER); //the x,y coordinate given is the centre of the text
    text(this.cost, this.centre.x, this.centre.y); //Displaying the cost of the edge
  }
}