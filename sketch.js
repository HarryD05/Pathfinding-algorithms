//Defining global variables
const states = ["Draw roads", "Remove roads", "See roads as graph", "Pathfind (Dijkstra's algorithm)", "Pathfind (A* algorithm)"];

const width = 600;
const height = 600;
const gridSize = 50;
const cols = width / gridSize;
const rows = height / gridSize;

const grid = [];
let roads = [];
let nodes = [];
let edges = [];
let selected = -1;

let state = 0;
let mapped = false;
let previousHover = { row: 0, col: 0 };
let start = -1;
let end = -1;

let startAlert = false;
let endAlert = false;
let alertShown = false;

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

  //Creating state key
  const info = createP(`Press the key to change the state: <br />${[...states].map((s, index) => `${index + 1} - ${s}`).join("<br />")}`);
  const current = createP(`Current state: ${states[state]}`);
  info.parent("instructions");
  info.id("info")
  current.parent("instructions");
  current.id("current")
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

              mapped = false;
              nodes = [];
              edges = [];
              selected = -1;
            }
          } else { //If removing roads
            if (grid[hoverCell.row][hoverCell.col].road) { //If the current cell is a road
              roads = roads.filter(road => {
                return !(road.col === hoverCell.col && road.row === hoverCell.row);
              }); //Remove the current cell from the road array
              grid[hoverCell.row][hoverCell.col].road = false; //Strip the cell of the road property

              mapped = false;
              nodes = [];
              edges = [];
              selected = -1;
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

      edges.forEach(edge => {
        edge.checkHover(mouseX, mouseY);
        edge.render();
      });

      nodes.forEach(node => {
        node.render();
      });
      break;

    case 3:
    case 4:
      //Path finding
      background(255, 255, 255);

      if (start >= 0 && end >= 0) {
        push();
        scale(0.5);
        stroke(0);
        strokeWeight(1);
        fill(255);
        rect(0, 0, width, height);

        if (!mapped) {
          mapGrid();
        }

        edges.forEach(edge => {
          edge.render();
        });

        nodes.forEach(node => {
          node.render();
        });
        pop();

        const table = new p5.Table();
        table.addColumn("node");
        table.addColumn("temporary");
        table.addColumn("permanent");

        nodes.forEach(node => {
          newRow = table.addRow();
          newRow.setString("node", char(65 + node.index));
          newRow.setString("temporary", `${node.temporary.cost} (from ${node.temporary.from})`);
          newRow.setString("permanent", `${node.permanent.cost} (from ${node.permanent.from})`);
        });

        showTable(table);

        if (!alertShown) {
          alertShown = true;
          alert("Not ready yet...");
        }
      } else {
        if (!mapped) {
          mapGrid();
        }

        edges.forEach(edge => {
          edge.render();
        });

        const isStart = start < 0;
        if (isStart) {
          if (startAlert) {
            alert("Select the starting node");
            startAlert = false;
          }
        } else {
          if (endAlert) {
            alert("Select the end node");
            endAlert = false;
          }
        }
        nodes.forEach(node => {
          node.checkHover(mouseX, mouseY, isStart);
          node.render();
        });
      }

      break;
  }
}

function keyPressed() {
  if (selected !== null && selected !== undefined && state === 2) {
    if (selected >= 0 && selected < edges.length) {
      if (keyCode === UP_ARROW) {
        edges[selected].cost++;
      } else if (keyCode === DOWN_ARROW) {
        edges[selected].cost--;

        if (edges[selected].cost <= 0) {
          edges[selected].cost = 1;
        }
      }

      nodes[edges[selected].a].neighbours.forEach(neighbour => {
        if (neighbour.end === edges[selected].b) {
          neighbour.cost = edges[selected].cost;
        }
      });
      nodes[edges[selected].b].neighbours.forEach(neighbour => {
        if (neighbour.end === edges[selected].a) {
          neighbour.cost = edges[selected].cost;
        }
      })
    }
  }

  if (key === "1" || key === "2" || key === "3" || key === "4" || key === "5") {
    state = Number(key) - 1;
    document.getElementById("current").innerText = `Current state: ${states[state]}`;

    selected = -1;
    start = -1;
    end = -1;
    startAlert = true;
    endAlert = true;
    alertShown = false;
    edges.forEach(edge => {
      edge.selected = false;
      edge.hover = false;
    });
    nodes.forEach(node => {
      node.end = false;
      node.start = false;
    })
  }
}

const showTable = table => {
  noFill();
  stroke(0);
  strokeWeight(1);

  const left = 320;
  const col_width = 100;
  const row_height = 20;
  const top = 20;

  textAlign(LEFT, TOP);
  text("Node", left, top);
  text("Temporary", left + col_width, top);
  text("Permanent", left + (col_width * 2), top);
  for (let row = 0; row < table.getRowCount(); row++) {
    for (let col = 0; col < table.getColumnCount(); col++) {
      text(
        table.getString(row, col),
        left + (col) * col_width,
        top + (row + 1) * row_height
      );
    }
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

  //Map edges
  let index = 0;
  nodes.forEach(node => {
    node.neighbours.forEach(edge => {
      if (!isEdge(node.index, edge.end)) {
        edges.push(new Edge(node.index, edge.end, edge.cost, index));
        index++;
      }
    })
  })

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