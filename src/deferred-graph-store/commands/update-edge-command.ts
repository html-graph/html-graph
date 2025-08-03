import { UpdateEdgeRequest } from "@/graph-store";
import { CommandType } from "./command-type";

export interface UpdateEdgeCommand {
  readonly type: CommandType.UpdateEdge;
  readonly edgeId: unknown;
  readonly request: UpdateEdgeRequest;
}
