// #############################
// # Defining global variables #
// #############################

//Possible states
const states = ["Draw roads", "Remove roads", "See roads as graph", "Pathfind (Dijkstra's algorithm)", "Pathfind (A* algorithm)"];

//Canvas properties
const width = 600;
const height = 600;
const gridSize = 50;
const cols = width / gridSize;
const rows = height / gridSize;

//Arrays
const grid = [];
let roads = [];
let nodes = [];
let edges = [];

//Current state properties
let selected = -1;
let state = 0;
let mapped = false;
let previousHover = { row: 0, col: 0 };
let start = -1;
let end = -1;
let astartData = {
  heuristicsDone: false
};
let dijkstraData = {};

//Alert booleans (used so an alert is only shown once)
let startAlert = false;
let endAlert = false;
let alertShown = false;

//##############################
//# Setting up the environment #
//##############################
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

  //Creating changing state instructions in DOM
  const info = createP(`Press the key to change the state: <br />${[...states].map((s, index) => `${index + 1} - ${s}`).join("<br />")}`);
  const current = createP(`Current state: ${states[state]}`);
  info.parent("instructions");
  info.id("info")
  current.parent("instructions");
  current.id("current")
}

//###########################################
//# The main draw loop (called every frame) #
//###########################################
function draw() {
  //Switch statement to display the correct content for each state
  switch (state) {
    case 0:
    case 1:
      //Drawing/removing roads

      //Getting the currently hovered over cell using mouse coordinates
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

              //Resetting the graph so the graph will be re-calculated next time state changes as the shape has changed
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

              //Resetting the graph so the graph will be re-calculated next time state changes as the shape has changed
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

      //Updating the value of the previous hover
      previousHover = {
        row: floor(mouseY / gridSize),
        col: floor(mouseX / gridSize)
      }
      break;

    case 2:
      //See as graph
      background(240, 255, 255);

      //If the road network hasn't been mapped (a matching graph generated)
      if (!mapped) {
        mapGrid();
      }

      //Checking if any of the edges have been hovered over or selected and rendering the edge (line and cost text)
      edges.forEach(edge => {
        edge.checkHover(mouseX, mouseY);
        edge.render();
      });

      //Rendering all the nodes in the graph
      nodes.forEach(node => {
        node.render();
      });
      break;

    case 3:
      //Dijkstra's pathfinding algorithm visualisation
      background(255, 255, 255);

      //If the start and end indices are set (not -1) then the algorithm can begin
      //If not then let the user select the start and end nodes
      if (start >= 0 && end >= 0) {
        displayGraph(); //Drawing the graph in the top left corner
        displayTable(); //Drawing the table of nodes on the right side of the canvas
        WIPAlert(); //Alert that states the functionality isn't ready yet
      } else {
        const isStart = start < 0; //Checking if the start node has been selected
        displayGraph(true, isStart); //Drawing the graph on the canvas and checking if a node has been selected
        nodeSelectAlert(isStart); //Alert that instructs the user to select the start or end node
      }
      break;

    case 4:
      //A* pathfinding algorithm visualisation
      background(255, 255, 255);

      //If the start and end indices are set (not -1) then the algorithm can begin
      //If not then let the user select the start and end nodes
      if (start >= 0 && end >= 0) {
        displayGraph(); //Drawing the graph in the top left corner
        displayTable(true); //Drawing the table of nodes on the right side of the canvas with the heuristic colum
        WIPAlert(); //Alert that states the functionality isn't ready yet

        //Getting the heuristic for each node - TODO: refactor into a function
        if (!astartData.heuristicsDone) {
          nodes.forEach(node => {
            node.heuristic = getHeuristic(node, nodes[end]);
          });
          astartData.heuristicsDone = true;
        }
      } else {
        const isStart = start < 0; //Checking if the start node has been selected
        displayGraph(true, isStart); //Drawing the graph on the canvas and checking if a node has been selected
        nodeSelectAlert(isStart); //Alert that instructs the user to select the start or end node
      }
      break;
  }
}

//State 3 and 4 in switch statement may merge in future as very similar just different algorithm
//Will depend on how I setup the visualtion (if it is just calling for example a next step function
//they can be the same case just different parameters to the next step function)

//##################
//# Event handlers #
//##################
function keyPressed() {
  //If the state is "Show roads as graph" and an edge has been selected...
  if (selected !== null && selected !== undefined && state === 2) {
    //If the selected edge index is valid...
    if (selected >= 0 && selected < edges.length) {
      if (keyCode === UP_ARROW) {
        //If the up arrow is pressed increase the cost of the selected edge by 1
        edges[selected].cost++;
      } else if (keyCode === DOWN_ARROW) {
        //If the dolwn arrow is pressed decreased the cost of the selected edge by 1
        edges[selected].cost--;

        //Ensuring the cost of the edge is no lower than 1 
        if (edges[selected].cost <= 0) {
          edges[selected].cost = 1;
        }
      }

      //Updating the cost of the edges for the 2 end nodes
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

  //If a key corresponding to a state is pressed...
  if (key === "1" || key === "2" || key === "3" || key === "4" || key === "5") {
    //Update the state to the corresponding key and display the new state
    state = Number(key) - 1;
    document.getElementById("current").innerText = `Current state: ${states[state]}`;

    //Resetting state properties e.g. deselecting nodes and edges
    selected = -1;
    start = -1;
    end = -1;
    startAlert = true;
    endAlert = true;
    alertShown = false;

    //Resettting the hover and selected state of all the edges (so an edge isn't still
    //selected when you return to state 2
    edges.forEach(edge => {
      edge.selected = false;
      edge.hover = false;
    });

    //Resetting the start and end booleans so that when you return to the path finding states
    //the start and end nodes haven't already been selected
    nodes.forEach(node => {
      node.end = false;
      node.start = false;
    })
  }
}