//############################################
//# Helper functions to support A* algorithm #
//############################################

//Function that generates the heuristic for a node
const getHeuristic = (curr, end) => {
  //Using a the straight linedistance between the 2 nodes as the heuristic
  const value = sqrt(
    pow(end.pos.col - curr.pos.col, 2) +
    pow(end.pos.row - curr.pos.row, 2)
  );

  //Returning the value as an integer greater than 0
  return constrain(floor(value), 1, 10000);
}