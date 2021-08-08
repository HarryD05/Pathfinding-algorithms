//####################
//# Helper functions #
//####################

//Function that displays the work in progress alert if the alert hasn't been shown yet
const WIPAlert = () => {
  //TEMPORARY - alerting the user that the algorithm hasn't been setup yet
  if (!alertShown) {
    alertShown = true;
    alert("Not ready yet...");
  }
}

//Function that displays that the user needs to select the start or end node if the alert hasn't been shown yet
const nodeSelectAlert = isStart => {
  //Temporary until better alert system implemented
  //If the start node hasn't been selected then alert the user to select the start node
  if (isStart) {
    if (startAlert) {
      alert("Select the starting node");
      startAlert = false;
    }
  } else {
    //If the start node has been selected but end node not then alert the user to select the end node
    if (endAlert) {
      alert("Select the end node");
      endAlert = false;
    }
  }
}

//Function to display the table for the nodes for the pathfinding states
const showTable = (table, hasHeuristic = false) => {
  //Properties for drawing text 
  noFill();
  stroke(0);
  strokeWeight(1);

  //Variables defining the tables properties
  const left = 320;
  const top = 20;
  const col_width_small = 50;
  const col_width_large = 100;
  const row_height = 20;

  //Drawing the column headers of the table to the canvas
  textAlign(LEFT, TOP);

  text("Node", left, top);
  if (hasHeuristic) {
    //Add in the heuristic header if in A* state
    text("Heuristic", left + col_width_small, top);
    text("Temporary", left + (col_width_small * 2), top);
    text("Permanent", left + (col_width_small * 2) + col_width_large, top);
  } else {
    text("Temporary", left + col_width_small, top);
    text("Permanent", left + col_width_small + col_width_large, top);
  }

  //Drawing a row for each node
  for (let row = 0; row < table.getRowCount(); row++) {
    for (let col = 0; col < table.getColumnCount(); col++) {
      let x = left;

      if (hasHeuristic) {
        if (col > 0) {
          x += col_width_small;
        }
        if (col > 1) {
          x += col_width_small;
        }
        if (col > 2) {
          x += col_width_large;
        }
      } else {
        if (col > 0) {
          x += col_width_small;
        }
        if (col > 1) {
          x += col_width_large;
        }
      }

      //Making the letter of the start/end node coloured (green/red)
      if (row === start && col === 0) {
        stroke(25, 100, 10); //if start row and first column make text green
      } else if (row === end && col === 0) {
        stroke(180, 25, 25); //if end row and first column make text red
      } else {
        stroke(0); //For everything else make text black
      }

      //Display text to canvas (of the current row and column)
      text(
        table.getString(row, col),
        x,
        top + (row + 1) * row_height
      );
    }
  }
}

//Function that draws the current node table on the right side of the canvas
const displayTable = hasHeuristic => {
  //Drawing the table of nodes and their current temporary and permanent info (sum and from node)
  //Initialising the table
  const table = new p5.Table();

  //Adding the columns
  table.addColumn("node");
  if (hasHeuristic) {
    table.addColumn("heuristic");
  }
  table.addColumn("temporary");
  table.addColumn("permanent");

  //Populating the table with each row being a node
  nodes.forEach(node => {
    newRow = table.addRow(); //Initialising the new row
    newRow.setString("node", char(65 + node.index)); //Converting the index to a letter A-Z
    if (hasHeuristic) {
      newRow.setString("heuristic", node.heuristic);
    }
    newRow.setString("temporary", `${node.temporary.cost} (from ${node.temporary.from})`);
    newRow.setString("permanent", `${node.permanent.cost} (from ${node.permanent.from})`);
  });

  showTable(table, hasHeuristic); //Displaying the table on the canvas
}

//Function that draws current graph large or as a small square in top left corner
const displayGraph = (isHoverable = false, isStart = false) => {
  if (!isHoverable) {
    scale(0.5); //halfing the size of all content drawn to the screen if the start and end node have been selected
    //hoverable will be false if the user is not still selecting the start and end node 
  }

  //Creating a white box with black outline surrounding the graph in the top left cornerof the canvas
  stroke(0);
  strokeWeight(1);
  fill(255);
  rect(0, 0, width, height);

  //Making sure that the graph has been updated to match the current road netowrk
  if (!mapped) {
    mapGrid();
  }

  //Iterating through every edge and draw the line and its cost text
  edges.forEach(edge => {
    edge.render();
  });

  //Iterating through every node and drawing it 
  nodes.forEach(node => {
    if (isHoverable) {
      //If the user is selected the start and end node check if any of the nodes are being hovered over / selected
      node.checkHover(mouseX, mouseY, isStart);
    }
    node.render();
  });
  scale(2);
}

//Function to map grid into nodes
const mapGrid = () => {
  //Iterating through all the cells in the grid to check if they are a node
  let index = 0; //Holds the index of the next node to be created (its position in the global nodes array)
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      //Filtering the road array to check if the current cell is a road
      const cell = roads.filter(road => road.col === col && road.row === row);

      if (cell.length === 1) {
        //If the cell is a road check if it is a node (an intersection between roads)
        if (checkCell(row, col)) {
          //If the cell is a node add it to the nodes array as a node object
          nodes.push(new Node(row, col, index));
          index++;
        }
      }
    }
  }

  //Iterating through all the nodes and checking the node's neighbouring nodes then calculating the
  //base edge cost for each edge (initially just the Euclidian distance but can be changed by user)
  nodes.forEach(node => node.mapNeighbours());

  //Creating a new edge object for each edge in the graph of nodes
  index = 0; //Holds the index of the next edge to be created (its position in the global edges array)
  //Iterating through all nodes
  nodes.forEach(node => {
    //Iterating through all the node's neighbours
    node.neighbours.forEach(edge => {
      //Checking if an edge with the same start and end has already been instantiated (by the other end node)
      //This means that there will only be 1 edge object per edge instead of 2 
      if (!isEdge(node.index, edge.end)) {
        //Instantiating the new edge and appending it to the edges array
        edges.push(new Edge(node.index, edge.end, edge.cost, index));
        index++;
      }
    })
  })

  //Setting mapped to true so the mapping function is only called once each time state changes to 2, 3 or 4
  mapped = true;
}

//Function used to check whether or not a cell is a node (intersection between roads)
const checkCell = (row, col) => {
  //All if statements temporarily, will them make loops in future

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