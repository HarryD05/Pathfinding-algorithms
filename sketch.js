//Defining global variables
const states = ["Draw roads", "Remove roads", "See roads as graph", "Pathfind"];

const width = 600;
const height = 600;
const gridSize = 50;
const cols = width / gridSize;
const rows = height / gridSize;

const grid = [];
let roads = [];
let nodes = [];

let state = 0;
let mapped = false;
let previousHover = { row: 0, col: 0 }

//Called once when page loaded
function setup() {
  //Creating the canvas and putting it in the canvas div (centre of page styling)
  const canvas = createCanvas(600, 600);
  canvas.parent(document.getElementById("canvas"));

  //Giving canvas grey background
  background(200);

  //Initialising the grid (2D Array)
  for (let row = 0; row < rows; row++) {
    grid.push([]);
    for (let col = 0; col < cols; col++) {
      grid[row].push(new Cell(col, row));
    }
  }

  //Creating state selector
  stateSelect = createSelect();
  states.forEach((option, index) => {
    stateSelect.option(option, index);
  });
  stateSelect.changed(e => {
    if (states[state] === "See roads as graph") {
      mapped = false; //Reseting values
      nodes = [];
    }

    state = Number(e.target.value)
  });
}

//Called every frame
function draw() {
  switch (state) {
    case 0:
    case 1:
      //Drawing/removing roads

      //Getting the currently hovered over cell
      const hoverCell = {
        row: floor(mouseY / gridSize),
        col: floor(mouseX / gridSize)
      };

      //Resetting hover state of hovered cell from previous frame
      if (previousHover.row >= 0 && previousHover.row < rows && previousHover.col >= 0 && previousHover.col < cols) {
        grid[previousHover.row][previousHover.col].hovered = false;
      }

      //Setting hovered to true for the currently hovered over cell
      if (hoverCell.row >= 0 && hoverCell.row < rows && hoverCell.col >= 0 && hoverCell.col < cols) {
        grid[hoverCell.row][hoverCell.col].hovered = true;

        //If the mouse is pressed then turn the currently hovered over cell into a road
        if (mouseIsPressed) {
          if (state === 0) { //If drawing roads
            if (!grid[hoverCell.row][hoverCell.col].road) { //If the current cell isn't a road...
              roads.push({ row: hoverCell.row, col: hoverCell.col }); //Add cell to road array
              grid[hoverCell.row][hoverCell.col].road = true; //Make cell a road
            }
          } else { //If removing roads
            if (grid[hoverCell.row][hoverCell.col].road) { //If the current cell is a road
              roads = roads.filter(road => {
                return !(road.col === hoverCell.col && road.row === hoverCell.row);
              }); //Remove the current cell from the road array
              grid[hoverCell.row][hoverCell.col].road = false; //Strip the cell of the road property
            }
          }
        }
      }

      //Rendering every grid square
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          grid[row][col].render();
        }
      }

      previousHover = {
        row: floor(mouseY / gridSize),
        col: floor(mouseX / gridSize)
      } //Updating the value of the previous hover
      break;

    case 2:
      //See as graph
      background(240, 255, 255);

      if (!mapped) {
        mapGrid();
      }

      nodes.forEach(node => {
        node.render();
      })
      break;

    case 3:
      //Path finding
      break;
  }
}

//Function to map grid into nodes
const mapGrid = () => {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = roads.filter(road => road.col === col && road.row === row);

      if (cell.length === 1) {
        if (checkCell(row, col)) {
          nodes.push(new Node(row, col));
        }
      }
    }
  }

  nodes.forEach(node => node.mapNeighbours());

  mapped = true;
}

const checkCell = (row, col) => {
  //All if statements temporarily, will make loop in future

  //CHECKING IF ONLY 1 NEIGHBOUR
  if (checkSingle(row, col)) {
    return true;
  }

  //CHECKING IF 2 MAKING A CORNER
  if (checkTwo(row, col)) {
    return true;
  }

  //CHECKING IF 3 IN A JUNCTION
  if (checkThree(row, col)) {
    return true;
  }

  //CHECKING IF 4 IN A JUNCTION
  if (checkFour(row, col)) {
    return true;
  }

  //If non true then not a node
  return false;
}