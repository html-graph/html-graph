import { UpdateNodeRequest } from "@/graph-store";
import { CommandType } from "./command-type";

export interface UpdateNodeCommand {
  readonly type: CommandType.UpdateNode;
  readonly nodeId: unknown;
  readonly request: UpdateNodeRequest<number>;
}
