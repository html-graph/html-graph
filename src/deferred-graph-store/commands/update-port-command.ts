import { UpdatePortRequest } from "@/graph-store";
import { CommandType } from "./command-type";

export interface UpdatePortCommand {
  readonly type: CommandType.UpdatePort;
  readonly portId: unknown;
  readonly request: UpdatePortRequest;
}
