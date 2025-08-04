import {
  AddEdgeRequest,
  AddNodeRequest,
  AddPortRequest,
  GraphStore,
  UpdateEdgeRequest,
  UpdateNodeRequest,
  UpdatePortRequest,
} from "@/graph-store";
import { Command, CommandType } from "./commands";
import { Queue } from "./queue";

export class DeferredGraphStore extends GraphStore<number | undefined> {
  private readonly commands = new Queue<Command>();

  private readonly onBeforeNodeRemovedHandler = (nodeId: unknown): void => {
    this.getNodePortIds(nodeId)!.forEach((portId) => {
      this.removePort(portId);
    });
  };

  private readonly onBeforePortRemovedHandler = (portId: unknown): void => {
    this.getPortAdjacentEdgeIds(portId).forEach((edgeId) => {
      this.removeEdge(edgeId);
    });
  };

  public constructor(private readonly baseGraphStore: GraphStore<number>) {
    super();

    this.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemovedHandler);
    this.onBeforePortRemoved.subscribe(this.onBeforePortRemovedHandler);
  }

  public addNode(request: AddNodeRequest<number | undefined>): void {
    super.addNode(request);

    this.commands.push({ type: CommandType.AddNode, request });
  }

  public updateNode(nodeId: unknown, request: UpdateNodeRequest<number>): void {
    super.updateNode(nodeId, request);

    this.commands.push({ type: CommandType.UpdateNode, nodeId, request });
  }

  public removeNode(nodeId: unknown): void {
    super.removeNode(nodeId);

    this.commands.push({ type: CommandType.RemoveNode, nodeId });
  }

  public addPort(request: AddPortRequest): void {
    super.addPort(request);

    this.commands.push({ type: CommandType.AddPort, request });
  }

  public updatePort(portId: unknown, request: UpdatePortRequest): void {
    super.updatePort(portId, request);

    this.commands.push({ type: CommandType.UpdatePort, portId, request });
  }

  public removePort(portId: unknown): void {
    super.removePort(portId);

    this.commands.push({ type: CommandType.RemovePort, portId });
  }

  public addEdge(request: AddEdgeRequest): void {
    super.addEdge(request);

    this.commands.push({ type: CommandType.AddEdge, request });
  }

  public updateEdge(edgeId: unknown, request: UpdateEdgeRequest): void {
    super.updateEdge(edgeId, request);

    this.commands.push({ type: CommandType.UpdateEdge, edgeId, request });
  }

  public removeEdge(edgeId: unknown): void {
    super.removeEdge(edgeId);

    this.commands.push({ type: CommandType.RemoveEdge, edgeId });
  }

  public clear(): void {
    super.clear();

    this.commands.push({ type: CommandType.Clear });
  }

  public apply(): void {
    for (;;) {
      const command = this.commands.pop();

      if (command === null) {
        break;
      }

      switch (command.type) {
        case CommandType.AddNode: {
          const request = command.request;
          const nodeId = request.id;
          const node = this.getNode(nodeId)!;
          const x: number | undefined = request.x ?? node.payload.x;
          const y: number | undefined = request.y ?? node.payload.y;

          if (x === undefined || y === undefined) {
            throw new Error(
              `failed to add node ${nodeId} with undefined coordinates`,
            );
          }

          this.baseGraphStore.addNode({ ...command.request, x, y });
          break;
        }
        case CommandType.UpdateNode: {
          this.baseGraphStore.updateNode(command.nodeId, command.request);
          break;
        }
        case CommandType.RemoveNode: {
          this.baseGraphStore.removeNode(command.nodeId);
          break;
        }
        case CommandType.AddPort: {
          this.baseGraphStore.addPort(command.request);
          break;
        }
        case CommandType.UpdatePort: {
          this.baseGraphStore.updatePort(command.portId, command.request);
          break;
        }
        case CommandType.RemovePort: {
          this.baseGraphStore.removePort(command.portId);
          break;
        }
        case CommandType.AddEdge: {
          this.baseGraphStore.addEdge(command.request);
          break;
        }
        case CommandType.UpdateEdge: {
          this.baseGraphStore.updateEdge(command.edgeId, command.request);
          break;
        }
        case CommandType.RemoveEdge: {
          this.baseGraphStore.removeEdge(command.edgeId);
          break;
        }
        case CommandType.Clear: {
          this.baseGraphStore.clear();
          break;
        }
      }
    }
  }
}
