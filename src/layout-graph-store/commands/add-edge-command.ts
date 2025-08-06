import { AddEdgeRequest } from "@/graph-store";
import { CommandType } from "./command-type";

export interface AddEdgeCommand {
  readonly type: CommandType.AddEdge;
  readonly request: AddEdgeRequest;
}
