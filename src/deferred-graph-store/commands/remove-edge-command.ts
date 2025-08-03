import { CommandType } from "./command-type";

export interface RemoveEdgeCommand {
  readonly type: CommandType.RemoveEdge;
  readonly edgeId: unknown;
}
