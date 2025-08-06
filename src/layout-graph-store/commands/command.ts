import { AddEdgeCommand } from "./add-edge-command";
import { AddNodeCommand } from "./add-node-command";
import { AddPortCommand } from "./add-port-command";
import { ClearCommand } from "./clear-command";
import { RemoveEdgeCommand } from "./remove-edge-command";
import { RemoveNodeCommand } from "./remove-node-command";
import { RemovePortCommand } from "./remove-port-command";
import { UpdateEdgeCommand } from "./update-edge-command";
import { UpdateNodeCommand } from "./update-node-command";
import { UpdatePortCommand } from "./update-port-command";

export type Command =
  | AddNodeCommand
  | UpdateNodeCommand
  | RemoveNodeCommand
  | AddPortCommand
  | UpdatePortCommand
  | RemovePortCommand
  | AddEdgeCommand
  | UpdateEdgeCommand
  | RemoveEdgeCommand
  | ClearCommand;
