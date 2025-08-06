import { AddNodeRequest } from "@/graph-store";
import { CommandType } from "./command-type";

export interface AddNodeCommand {
  readonly type: CommandType.AddNode;
  readonly request: AddNodeRequest<number | undefined>;
}
