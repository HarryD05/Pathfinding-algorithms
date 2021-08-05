const width = 600;
const height = 600;
const gridSize = 60;
const cols = width / gridSize;
const rows = height / gridSize;

const grid = [];

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
}

//Called every frame
function draw() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      grid[row][col].render()
    }
  }
}