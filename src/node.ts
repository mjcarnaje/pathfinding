import { INodeStatus } from "./types";

export class Node {
  id: string;
  status: INodeStatus;
  distance: number;
  previousNode: Node | null;

  constructor(id: string, status: INodeStatus) {
    this.id = id;
    this.status = status;
    this.distance = Infinity;
    this.previousNode = null;
  }
}
