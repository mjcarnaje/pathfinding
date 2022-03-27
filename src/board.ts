import { INodeStatus } from "./types";
import { Node } from "./node";
import dijkstra, { disjkstraShortestPath } from "./algorithms/dijkstra";

export class Board {
  col: number;
  row: number;
  grid: Node[][];
  startCoor: [number, number] | null;
  targetCoor: [number, number] | null;
  isMouseDown: boolean;
  isVisualizing: boolean;

  constructor(row: number, col: number) {
    this.col = col;
    this.row = row;
    this.grid = [];
    this.startCoor = null;
    this.targetCoor = null;
    this.isMouseDown = false;
    this.isVisualizing = false;
  }

  createGrid() {
    let gridHTML = "";
    for (let row = 0; row < this.row; row++) {
      let cols = [];
      let colsHTML = "";

      for (let col = 0; col < this.col; col++) {
        const nodeId = `${row}-${col}`;
        let status: INodeStatus = "UNVISITED";

        const startCoor = [this.row / 2, this.col / 4].map(Math.floor);
        const targetCoor = [this.row / 2, (this.col / 4) * 3].map(Math.floor);
        const isStart = row === startCoor[0] && col === startCoor[1];
        const isTarget = row === targetCoor[0] && col === targetCoor[1];

        if (isStart) {
          status = "START";
          this.startCoor = [row, col];
        }
        if (isTarget) {
          status = "TARGET";
          this.targetCoor = [row, col];
        }

        const node = new Node(nodeId, status);

        const className = `node ${node.status.toLowerCase()}`;

        colsHTML += `<div id="${node.id}" class="node ${className}"></div>`;

        cols.push(node);
      }

      gridHTML += `<div class="row">${colsHTML}</div>`;

      this.grid.push(cols);
    }
    let board = document.querySelector(".board")!;
    board.innerHTML = gridHTML;
  }

  visualizeAlgorithm() {
    if (!this.startCoor || !this.targetCoor) {
      return;
    }
    const startNode = this.grid[this.startCoor[0]][this.startCoor[1]];
    const targetNode = this.grid[this.targetCoor[0]][this.targetCoor[1]];

    const visitedNodes = dijkstra(this.grid, startNode, targetNode);
    const shortestPath = disjkstraShortestPath(targetNode);

    if (!visitedNodes) {
      return;
    }

    this.isVisualizing = true;

    visitedNodes.forEach((node, i) => {
      const nodeElement = document.getElementById(node.id)!;

      setTimeout(() => {
        nodeElement.classList.add("visited");
      }, i * 5);
    });

    shortestPath.forEach((node, i) => {
      const nodeElement = document.getElementById(node.id)!;

      setTimeout(() => {
        nodeElement.classList.add("shortest-path");
      }, visitedNodes.length * 5 + i * 5);
    });

    this.isVisualizing = false;
  }

  getNode(id: string) {
    const coor = id.split("-").map(Number);
    return this.grid[coor[0]][coor[1]];
  }

  addEventListeners() {
    for (let row = 0; row < this.row; row++) {
      for (let col = 0; col < this.col; col++) {
        const nodeId = `${row}-${col}`;
        const node = this.getNode(nodeId);
        const nodeElement = document.getElementById(nodeId)!;

        nodeElement.onmousedown = (e) => {
          if (this.isVisualizing) return;
          e.preventDefault();
          this.isMouseDown = true;
          node.status = node.status === "UNVISITED" ? "WALL" : "UNVISITED";
          nodeElement.classList.toggle("wall");
          nodeElement.classList.toggle("unvisited");
        };

        nodeElement.onmouseup = (e) => {
          if (this.isVisualizing) return;
          e.preventDefault();
          this.isMouseDown = false;
        };

        nodeElement.onmouseenter = (e) => {
          if (this.isVisualizing) return;
          e.preventDefault();
          if (!this.isMouseDown) return;
          node.status = node.status === "UNVISITED" ? "WALL" : "UNVISITED";
          nodeElement.classList.toggle("wall");
          nodeElement.classList.toggle("unvisited");
        };
      }
    }
  }

  initialize() {
    this.createGrid();
    this.addEventListeners();
  }
}
