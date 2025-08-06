import { CommandType } from "./command-type";

export interface ClearCommand {
  readonly type: CommandType.Clear;
}
