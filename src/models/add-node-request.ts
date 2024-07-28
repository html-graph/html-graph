import { NodeId } from "./node-id";

export interface AddNodeRequest {
    id: NodeId;
    el: HTMLElement;
    x: number;
    y: number;
}
