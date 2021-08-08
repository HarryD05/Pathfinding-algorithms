//#######################################
//# Helper functions for the node class #
//#######################################
//Function to check if the grid position passed in is a node
const isNode = (row, col) => {
  //Iterating through all the nodes
  for (const node of nodes) {
    //Checking if the current node has the position that was passed in
    if (node.pos.col === col && node.pos.row === row) {
      return true; //if it does return true
    }
  }

  //if none of the nodes had the passed in position then return false as the position isn't a node
  return false;
}

//Function to check if their is an edge/connection between the 2 nodes passed in
const isEdge = (a, b) => {
  //Iterating through all the edges
  for (const edge of edges) {
    //Checking if the current edge has the the same index for a or b (the same end nodes)
    if ((edge.a === a || edge.a === b) && (edge.b === a || edge.b === b)) {
      return true; //if it does return true
    }
  }

  //if none of the edges had the passed in end nodes then return false as the 2 nodes are connected by an edge
  return false;
}

//Function that returns the index of the node that is at the row and column passed in 
const nodeIndex = (row, col) => {
  //Iterating through all of the nodes
  for (let i = 0; i < nodes.length; i++) {
    //Checking if the current node is at the position passed in 
    if (nodes[i].pos.col === col && nodes[i].pos.row === row) {
      return i; //if it is return the index of this node
    }
  }

  //if none of the nodes had the passed in position then return -1 as the node won't have an index in the array
  return -1;
}

//Function that checks if a row, col is valid
const isValid = (row, col) => {
  //Setting valid to false if the next cell to be checked is off the grid
  let valid = true;

  //Checking the row is within the bounds of the grid
  if (row >= rows || row < 0) {
    valid = false;
  }

  //Checking the column is within the bounds of the grid
  if (col >= cols || col < 0) {
    valid = false;
  }


  return valid;
}