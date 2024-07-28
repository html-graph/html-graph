import { NodeId } from "./node-id";

export interface ConnectNodesRequest {
    nodeFrom: NodeId;
    nodeTo: NodeId;
}
