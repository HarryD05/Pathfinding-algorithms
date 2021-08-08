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
    this.centre = createVector(
      (this.pos.col * gridSize) + (gridSize / 2),
      (this.pos.row * gridSize) + (gridSize / 2)
    );
    this.neighbours = [];
    this.temporary = { cost: -1, from: 'N/A' };
    this.permanent = { cost: -1, from: 'N/A' };
    this.index = -1;

    this.hover = false;
    this.start = false;
    this.end = false;
  }

  checkHover(x, y, isStart) {
    this.hover = (sqrt(pow(this.centre.x - x, 2) + pow(this.centre.y - y, 2)) <= 8);

    if (this.hover && mouseIsPressed) {
      if (isStart) {
        start = this.index;
        this.start = true;
      } else {
        if (start !== this.index) {
          end = this.index;
          this.end = true;
        }
      }
    }
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

          if (!grid[row + dy][col + dx].road) {
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
          } else {
            if (isNode(row + dy, col + dx)) {
              this.neighbours.push({
                end: nodeIndex(row + dy, col + dx),
                cost: sqrt(pow((row + dy) - row, 2) + pow((col + dx) - col, 2))
              });
              break;
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
    //POINT AS THIS NODE POSITION
    stroke(0);
    strokeWeight(2);
    fill(255);
    if (this.start) {
      fill(150, 250, 150);
    } else if (this.end) {
      fill(255, 160, 150);
    } else if (this.hover) {
      fill(225);
    }
    ellipseMode(RADIUS)
    ellipse(
      this.centre.x,
      this.centre.y,
      8
    );

    //LABELLING NODE
    strokeWeight(1);
    stroke(0);
    noFill();
    textAlign(LEFT, BOTTOM);
    text(
      char(65 + this.index),
      this.centre.x + 10,
      this.centre.y - 10
    )
  }
}