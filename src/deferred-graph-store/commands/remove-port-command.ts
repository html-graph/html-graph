import { CommandType } from "./command-type";

export interface RemovePortCommand {
  readonly type: CommandType.RemovePort;
  readonly portId: unknown;
}
