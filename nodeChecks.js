//IMPORTANT: NEED TO REFACTOR TO USE FOR LOOPS 
//TODO: ADD DIAGONALS

const checkSingle = (row, col) => {
  let count = 0;

  //1 to north
  if (row - 1 >= 0) {
    if (grid[row - 1][col].road) count++;
  }

  //1 to west
  if (col - 1 >= 0) {
    if (grid[row][col - 1].road) count++;
  }

  //1 to south
  if (row + 1 < rows) {
    if (grid[row + 1][col].road) count++;
  }

  //1 to east
  if (col + 1 < cols) {
    if (grid[row][col + 1].road) count++;
  }

  return (count === 1);
}

const checkTwo = (row, col) => {
  let count = 0;

  //1 to north, 1 to west
  if (row - 1 >= 0 && col - 1 >= 0) {
    if (grid[row - 1][col].road && grid[row][col - 1].road) count++;
  }

  //1 to north, 1 to east
  if (row - 1 >= 0 && col + 1 < cols) {
    if (grid[row - 1][col].road && grid[row][col + 1].road) count++;
  }

  //1 to south, 1 to west
  if (row + 1 < rows && col - 1 >= 0) {
    if (grid[row + 1][col].road && grid[row][col - 1].road) count++;
  }

  //1 to south, 1 to east
  if (row + 1 < rows && col + 1 < cols) {
    if (grid[row + 1][col].road && grid[row][col + 1].road) count++;
  }

  return (count === 1);

  //Not checking 1 direct, 1 diagonal yet
}

const checkThree = (row, col) => {
  let count = 0;

  //1 to north, 1 to south, 1 to west
  if (row - 1 >= 0 && row + 1 < rows && col - 1 >= 0) {
    if (grid[row - 1][col].road && grid[row + 1][col].road && grid[row][col - 1].road) count++;
  }

  //1 to north, 1 to east, 1 to west
  if (row - 1 >= 0 && col + 1 < cols && col - 1 >= 0) {
    if (grid[row - 1][col].road && grid[row][col + 1].road && grid[row][col - 1].road) count++;
  }

  //1 to north, 1 to south, 1 to east
  if (row - 1 >= 0 && row + 1 < rows && col + 1 < cols) {
    if (grid[row - 1][col].road && grid[row + 1][col].road && grid[row][col + 1].road) count++;
  }

  //1 to south, 1 to west, 1 to east
  if (row + 1 < rows && col - 1 >= 0 && col + 1 < cols) {
    if (grid[row + 1][col].road && grid[row][col - 1].road && grid[row][col + 1].road) count++;
  }

  return (count === 1);

  //Not checking diagonals yet
}

const checkFour = (row, col) => {
  if (row + 1 < rows && row - 1 >= 0 && col - 1 >= 0 && col + 1 < cols) {
    return (grid[row + 1][col].road && grid[row - 1][col].road && grid[row][col - 1].road && grid[row][col + 1].road);
  }

  return false;
}