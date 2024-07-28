import { EdgeId } from "./edge-id";
import { NodeId } from "./node-id";

export interface ConnectNodesRequest {
    id: EdgeId;
    from: NodeId;
    to: NodeId;
}
