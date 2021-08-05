//Defining global variables

const states = ["Draw roads", "Remove roads", "See roads as graph", "Pathfind"];

const width = 600;
const height = 600;
const gridSize = 60;
const cols = width / gridSize;
const rows = height / gridSize;

const grid = [];
let roads = [];

let state = 0;
let previousHover = { row: 0, col: 0 }

//Called once when page loaded
function setup() {
  //Creating the canvas and putting it in the canvas div (centre of page styling)
  const canvas = createCanvas(600, 600);
  canvas.parent(document.getElementById("canvas"));

  //Giving canvas grey background
  background(200, 200, 200);

  //Initialising the grid
  for (let row = 0; row < rows; row++) {
    grid.push([]);
    for (let col = 0; col < cols; col++) {
      grid[row].push(new Cell(col, row));
    }
  }

  //Creating selector
  stateSelect = createSelect();
  states.forEach((option, index) => {
    stateSelect.option(option, index);
  });
  stateSelect.changed(e => state = Number(e.target.value));
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
          if (state === 0) {
            if (!grid[hoverCell.row][hoverCell.col].road) {
              roads.push({ row: hoverCell.row, col: hoverCell.col });
              grid[hoverCell.row][hoverCell.col].road = true;
            }
          } else {
            if (grid[hoverCell.row][hoverCell.col].road) {
              roads = roads.filter(road => {
                return !(road.col === hoverCell.col && road.row === hoverCell.row);
              });
              grid[hoverCell.row][hoverCell.col].road = false;
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
      }
      break;

    case 2:
      //See as graph
      break;

    case 3:
      //Path finding
      break;
  }
}