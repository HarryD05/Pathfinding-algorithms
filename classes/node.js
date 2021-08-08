//#########################
//# Node class definition #
//#########################

//Each intersection between edges is a node object
class Node {
  //Constructor method for class
  constructor(row, col, index) {
    //Setting the passed in attributes
    //(row and column of the node in the grid and its index in the global nodes array)
    this.pos = { row, col };
    this.index = index;

    //Centre point of the node (the row and col scaled would give top left corner of cell but node goes in centre of cell)
    this.centre = createVector(
      (this.pos.col * gridSize) + (gridSize / 2),
      (this.pos.row * gridSize) + (gridSize / 2)
    );

    this.neighbours = []; //Stores the other nodes connected to the node (will store its row, col position and the cost of the edge)
    this.temporary = { cost: -1, from: 'N/A' }; //The temporary label of the node which will be used in the pathfinding algorithms
    this.permanent = { cost: -1, from: 'N/A' }; //The permanent label of the node which will be used in the pathfinding algorithms
    this.heuristic = -1; //The heuristic cost of the node which will be used in the A* pathfinding algorithm

    this.hover = false; //Whether or not the node is being hovered over 
    this.start = false; //Whether or not the node is the start of the path
    this.end = false; //Whether or not the node is the end of the path
  }

  //Method to check if the node is being hovered over or clicked
  checkHover(x, y, isStart) {
    //If the coordinated passed in (mouse position) are in the circle of the node then the node is being hovered over
    this.hover = (sqrt(pow(this.centre.x - x, 2) + pow(this.centre.y - y, 2)) <= 8);

    //If the mouse is pressed and the node is being hovered over then the node is being selected for start or end of path
    if (this.hover && mouseIsPressed) {
      if (isStart) {
        //If the start is currently being selected set the start attribute of the node to true and the global start variable 
        //to the index of this node
        start = this.index;
        this.start = true;
      } else {
        //If the start is not currently being selected set the end attribute of the node to true and the global end variable to
        //the index of this node - as long as this node is not the start (the same node can't be the start and end of the path)
        if (start !== this.index) {
          end = this.index;
          this.end = true;
        }
      }
    }
  }

  //Method to find the neighbours of the node
  mapNeighbours() {
    let { row, col } = this.pos;
    //the current 4 possible directions of nodes (no diagonals yet)
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    //Iterating through all the directions (NESW currently) and checking if there is a node in any of the directions
    for (const dir of directions) {
      let i = 1;
      console.log({ row, col });
      //Iterating through moving one place in the current direction until a node is hit (add it as a neighbour) or the 
      //end of the grid is reached
      while (true) {
        //The number of grid positions the next cell is from the original cell
        const dx = dir[0] * i;
        const dy = dir[1] * i;

        //The position of the cell (cell that is being checked in this iteration)
        const currRow = row + dy;
        const currCol = col + dx;

        console.log({ currRow, currCol });

        //Checking if the cell being checked is a node
        if (isNode(currRow, currCol)) {
          console.log("here");
          //If it is add it to the neighbour array of the current node storing the neighbouring node's index in the global
          //node array and the cost of the edge (Euclidean distance between the 2 nodes)
          this.neighbours.push({
            end: nodeIndex(currRow, currCol),
            cost: sqrt(pow(currRow - row, 2) + pow(currCol - col, 2))
          });
          break;
        }

        //The position of the next cell (cell that is being checked in the next iteration)
        const nextRow = row + dir[1] * (i + 1);
        const nextCol = col + dir[0] * (i + 1);

        if (isValid(nextRow, nextCol)) {
          if (grid[nextRow][nextCol].road) {
            i++;
          } else {
            break;
          }
        } else {
          break;
        }
      }
    }
  }

  //Method to display the node as circle
  render() {
    //Setting the stroke properties so that the circle has a thicker black outline
    stroke(0);
    strokeWeight(2);

    //Setting the fill of the circle 
    fill(255); //white as a default
    if (this.start) {
      fill(150, 250, 150); //if the node is the starting node make it green
    } else if (this.end) {
      fill(255, 160, 150); //if the node is the end node make it red
    } else if (this.hover) {
      fill(225); //if then node is currently being hovered over make it grey
    }

    //Drawing the circle (8 pixel radius from the centre of the grid square where the node is)
    ellipseMode(RADIUS)
    ellipse(
      this.centre.x,
      this.centre.y,
      8
    );

    //LABELLING NODE (with its letter A-Z)
    //Setting the stroke and fill properties for text (a thin black font)
    strokeWeight(1);
    stroke(0);
    noFill();

    textAlign(LEFT, BOTTOM); //the x,y given to the text function is the bottom left of the text
    //char(65 + this.index) returns the corresponding letter A-Z of the index of this node e.g. 0 is A, 1 is B
    // x + 10 and y - 10 so the letter is just to right and slightly above the circle
    text(
      char(65 + this.index),
      this.centre.x + 10,
      this.centre.y - 10
    )
  }
}