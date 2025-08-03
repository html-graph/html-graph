import { CommandType } from "./command-type";

export interface RemoveNodeCommand {
  readonly type: CommandType.RemoveNode;
  readonly nodeId: unknown;
}
