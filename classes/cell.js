//#########################
//# Cell class definition #
//#########################

//Each square in the grid when the state is draw/remove roads is a cell object
class Cell {
  //Constructor method for class
  constructor(col, row) {
    //Col (column) and row are the position of this cell on the grid
    //Setting position attributes of the cell class
    this.col = col;
    this.row = row;
    this.x = col * gridSize;
    this.y = row * gridSize;

    //Setting the property attributes of the cell class
    this.hovered = false;
    this.road = false;
  }

  //Method that draws the cell on the canvas as a coloured square
  render() {
    //Setting the stroke (outline) properties to a 1 pixel thick black border
    stroke(0);
    strokeWeight(1);

    //Setting the shape fill colour
    if (this.road) {
      fill(120); //Dark grey for road
    } else if (this.hovered) {
      fill(180); //Light grey if cell being hovered over
    } else {
      if (state === 0) {
        fill(150, 250, 150); //all cells green if the user is currently on draw roads state
      } else if (state === 1) {
        fill(255, 160, 150); //all cells red if the user is currently on remove roads state
      }
    }

    //Drawing the cell in its postion 
    rectMode(CORNER)
    rect(this.x, this.y, gridSize, gridSize);
  }
}