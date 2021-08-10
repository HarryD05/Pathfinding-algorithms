const dijkstra = () => {
  const html = document.getElementById("explanation");

  const checkNextNode = isReady => {
    dijkstraData.index++;

    if (dijkstraData.index >= nodes[dijkstraData.current].neighbours.length) {
      dijkstraData.userReady = isReady;
      dijkstraData.pos = 4;
      dijkstraData.index = 0;
      dijkstraData.lowestIndex = -1;
      dijkstraData.lowestCost = 1000000;
    } else {
      dijkstraData.userReady = isReady;
      dijkstraData.pos = 2;
    }
  }

  const setCurrent = curr => {
    dijkstraData.current = curr;
    nodes.forEach((node, index) => {
      if (curr === index) {
        node.current = true;
        node.visited = true;
      } else {
        node.current = false;
      }
    });
  }

  const setPeek = seek => {
    nodes.forEach((node, index) => {
      if (seek === index) {
        node.peek = true;
      } else {
        node.peek = false;
      }
    })
  }

  const allVisited = () => {
    let all = true;
    nodes.forEach(node => {
      if (!node.visited) {
        all = false;
      }
    });

    return all;
  }

  //Setting current to start if not set yet
  if (dijkstraData.current === -1) {
    html.innerHTML = `Setting the start node's (${char(65 + start)}) temporary and permanent costs to 0 as it is the start - the cost is the distance from the start (${char(65 + start)})`;
    dijkstraData.nextReady = true;
    dijkstraData.userReady = false;
    dijkstraData.pos = 1;

    dijkstraData.current = start;
    nodes[start].temporary.cost = 0;
    nodes[start].temporary.from = char(65 + start);

    nodes[start].permanent.cost = 0;
    nodes[start].permanent.from = char(65 + start);

    setCurrent(start);
  }

  //Getting the label of the current node
  const currentNode = char(65 + dijkstraData.current);

  if (dijkstraData.nextReady && dijkstraData.userReady && dijkstraData.pos === 1) {
    html.innerHTML = `Checking the unvisited (permanent cost not set) neighbours of the current node (${currentNode}) replacing the temporary cost if the cost would be lower from the current node`;

    dijkstraData.index = 0;
    dijkstraData.userReady = false;
    dijkstraData.pos = 2;
  }

  if (dijkstraData.nextReady && dijkstraData.userReady && dijkstraData.pos === 2) {
    //Checking the neighbours of the current node and updating their lowest cost
    const other = nodes[nodes[dijkstraData.current].neighbours[dijkstraData.index].end];

    setPeek(other.index);

    //Only check the neighbour if it doesn't have a permanent value (has been fully visited)
    if (other.permanent.cost === "infinity") {
      //Getting the label of the other node currently being checked
      const otherNode = char(65 + other.index);

      html.innerHTML = `Now we check node ${otherNode}, it's current temporary label is ${other.temporary.cost}`;
      dijkstraData.userReady = false;
      dijkstraData.pos = 3;
    } else {
      checkNextNode(true);
    }
  }

  if (dijkstraData.nextReady && dijkstraData.userReady && dijkstraData.pos === 3) {
    const other = nodes[nodes[dijkstraData.current].neighbours[dijkstraData.index].end];

    //Calculating the cost from the neighbour to the start via. the current node
    const cost = nodes[dijkstraData.current].permanent.cost + nodes[dijkstraData.current].neighbours[dijkstraData.index].cost;
    const currCost = (other.temporary.cost === "infinity" ? 1000000 : other.temporary.cost);

    if (cost < currCost) {
      html.innerHTML = `The cost going via. ${currentNode} would be ${cost}, which is lower than the current temporary label (${other.temporary.cost}) so it is replaced.`;
      other.temporary.cost = cost;
      other.temporary.from = dijkstraData.current;
    } else {
      html.innerHTML = `The cost going via. ${currentNode} would be ${cost}, which is not lower than the current temporary label (${other.temporary.cost}) so it is not changed.`;
    }

    checkNextNode(false);
  }

  if (dijkstraData.nextReady && dijkstraData.userReady && dijkstraData.pos === 4) {
    setPeek(-1);

    const currentNode = char(65 + dijkstraData.current);
    html.innerHTML = `Now all neighbours of the current node (${currentNode}) have been checked, we need to find the node with the lowest temporary label and set its permanent label to its temporary label.`;
    //Select the node with the lowest temporary value (that doesn't have a permanent value)

    nodes.forEach(node => {
      //Only check node if it's permanent label isn't set
      if (node.permanent.cost === "infinity") {
        if (node.temporary.cost < dijkstraData.lowestCost) {
          dijkstraData.lowestCost = node.temporary.cost;
          dijkstraData.lowestIndex = node.index;
        }
      }
    });

    dijkstraData.userReady = false;
    dijkstraData.pos = 5;
  }

  if (dijkstraData.nextReady && dijkstraData.userReady && dijkstraData.pos === 5) {
    //If lowest index is still -1 then all nodes are visited
    if (dijkstraData.lowestIndex === -1) {
      html.innerHTML = "There is no node with the lowest temporary label as all of the node's have a permanent label therefore the algorithm is finished.";

      dijkstraData.userReady = false;
      dijkstraData.pos = 6;
    } else {
      //If not continue the algorithm
      html.innerHTML = `The lowest cost node is ${char(65 + dijkstraData.lowestIndex)} so its permanent label is now set and it is now the current node.`;

      //Make the permanent cost of the lowest node its temporary cost 
      const lowest = nodes[dijkstraData.lowestIndex];
      lowest.permanent.cost = lowest.temporary.cost;
      lowest.permanent.from = lowest.temporary.from;

      //Making the lowest node the new current node
      setCurrent(dijkstraData.lowestIndex);

      if (!allVisited()) {
        dijkstraData.userReady = false;
        dijkstraData.pos = 1;
      } else {
        dijkstraData.userReady = false;
        dijkstraData.lowestIndex = -1;
        dijkstraData.pos = 5;
      }
    }
  }

  if (dijkstraData.nextReady && dijkstraData.userReady && dijkstraData.pos === 6) {
    //Work out the shortest path from the permanent tags
    const route = [char(65 + end)];

    //Start at the end
    let current = end;

    //Iterate until the start of the route is reached
    while (current !== start) {
      route.push(char(65 + nodes[current].permanent.from));
      current = nodes[current].permanent.from;
    }

    //Reverse the route array
    route.reverse();

    //Display route as string
    html.innerHTML = `Shortest route: ${route.join(" &rarr; ")} (cost: ${nodes[end].permanent.cost})`;
  }
}