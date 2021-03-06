# Pathfinding algorithms
Experimenting with visualising pathfinding algorithms using [p5.js](https://p5js.org/). Currently I will be visualising these 2 algorithms:
- [Dijkstra's algorithm](https://www.analyticssteps.com/blogs/dijkstras-algorithm-shortest-path-algorithm)
- [A* algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm#Description)

## To do list
- Add more comments for current code **(Done)**
- Make site mobile friendly **(Done)**
- Implement Dijkstra's algorithm **(Done - first attempt)**
- Implement A* algorithm
- Improve node and edge mapping algorithm:
  - Refactor check node code to use iteration
  - Add diagonal checks for node check functions 
  - OR instead start from 0,0 (make it always a node) then test all directions for nodes, then test those nodes etc.
- Replace alerts with a modal or on canvas text
- Add directional edges

## Functionality
- Create a road network (using the draw/remove roads modes)
- Convert road network into a graph (change cost of edges)
- Use pathfinding algorithms to find the shortest distance (least cost) between 2 nodes on your graph using either Dijkstra's algorithm or A* (see the algorithm visualised)
