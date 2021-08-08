const isNode = (row, col) => {
  for (const node of nodes) {
    if (node.pos.col === col && node.pos.row === row) {
      return true;
    }
  }

  return false;
}

const isEdge = (a, b) => {
  for (const edge of edges) {
    if ((edge.a === a || edge.a === b) && (edge.b === a || edge.b === b)) {
      return true;
    }
  }

  return false;
}

const nodeIndex = (row, col) => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].pos.col === col && nodes[i].pos.row === row) {
      return i;
    }
  }

  return -1;
}

class Node {
  constructor(row, col) {
    this.pos = { row, col };
    this.neighbours = [];
    this.index = -1;
  }

  mapNeighbours() {
    let { row, col } = this.pos;
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    this.index = nodeIndex(row, col);

    for (const dir of directions) {
      let i = 1;
      while (true) {
        const dx = dir[1] * i;
        const dy = dir[0] * i;

        let valid = true;
        if (dx > 0) {
          if (col + dx >= cols) {
            valid = false;
          }
        } else if (dx < 0) {
          if (col + dx < 0) {
            valid = false;
          }
        }
        if (dy > 0) {
          if (row + dy >= rows) {
            valid = false;
          }
        } else if (dy < 0) {
          if (row + dy < 0) {
            valid = false;
          }
        }

        if (valid) {
          const prevRow = row + (dir[0] * (i - 1));
          const prevCol = col + (dir[1] * (i - 1));

          if (!grid[row + dy][col + dx].road || isNode(prevRow, prevCol)) {
            if (grid[prevRow][prevCol].road) {
              //change this to index of node in nodes list
              if (prevRow !== row || prevCol !== col) {
                this.neighbours.push({
                  end: nodeIndex(prevRow, prevCol),
                  cost: sqrt(pow(prevRow - row, 2) + pow(prevCol - col, 2))
                });
                break;
              }
            }
          }

          if (grid[row + dy][col + dx].road) {
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

  render() {
    const thisCentre = {
      x: (this.pos.col * gridSize) + (gridSize / 2),
      y: (this.pos.row * gridSize) + (gridSize / 2)
    };

    //POINT AS THIS NODE POSITION
    noFill();
    stroke(0);
    strokeWeight(16);
    point(
      thisCentre.x,
      thisCentre.y
    );

    //LABELLING NODE
    strokeWeight(1);
    stroke(0);
    textAlign(LEFT, BOTTOM);
    text(
      char(65 + this.index),
      thisCentre.x + 10,
      thisCentre.y - 10
    )
  }
}