import { AddPortRequest } from "@/generic-graph-store";
import { CommandType } from "./command-type";

export interface AddPortCommand {
  readonly type: CommandType.AddPort;
  readonly request: AddPortRequest;
}
