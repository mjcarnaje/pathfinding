import { Node } from "../node";

export const disjkstraShortestPath = (targetNode: Node | null) => {
  const nodesInShortestPathOrder = [];
  let currentNode = targetNode;

  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return nodesInShortestPathOrder;
};

const dijkstra = (nodes: Node[][], startNode: Node, targetNode: Node) => {
  const visitedNodes = [];
  const flattenNodes = nodes.flat();
  startNode.distance = 0;

  while (!!flattenNodes.length) {
    flattenNodes.sort((a, b) => a.distance - b.distance);

    const closestNode = flattenNodes.shift();

    if (!closestNode) return;

    if (closestNode.status === "WALL") continue;

    if (closestNode.distance === Infinity) return visitedNodes;

    closestNode.status = "VISITED";
    visitedNodes.push(closestNode);

    if (closestNode === targetNode) return visitedNodes;

    const neighbors = [];
    const [col, row] = closestNode.id.split("-").map(Number);

    if (col > 0) neighbors.push(nodes[col - 1][row]);
    if (col < nodes.length - 1) neighbors.push(nodes[col + 1][row]);
    if (row > 0) neighbors.push(nodes[col][row - 1]);
    if (row < nodes[0].length - 1) neighbors.push(nodes[col][row + 1]);

    const unvisitedNeighbor = neighbors.filter(
      (node) => node.status !== "VISITED"
    );

    for (const neighbor of unvisitedNeighbor) {
      neighbor.distance = closestNode.distance + 1;
      neighbor.previousNode = closestNode;
    }
  }

  return visitedNodes;
};

export default dijkstra;
