import { Viewport } from "@/viewport-transformer";
import { AddEdgeRequest } from "./add-edge-request";
import { AddNodeRequest } from "./add-node-request";
import { MarkPortRequest } from "./mark-port-request";
import { PatchMatrixRequest } from "./patch-matrix-request";
import { UpdateEdgeRequest } from "./update-edge-request";
import { UpdateNodeRequest } from "./update-node-request";
import { UpdatePortRequest } from "./update-port-request";
import { Graph } from "@/graph";
import { CanvasController } from "@/canvas-controller";

export class Canvas {
  /**
   * provides api for accessing graph model
   */
  public readonly graph: Graph;

  /**
   * provides api for accessing viewport state
   */
  public readonly viewport: Viewport;

  public constructor(private readonly controller: CanvasController) {
    this.graph = controller.graph;
    this.viewport = controller.viewport;
  }

  /**
   * adds node to graph
   */
  public addNode(node: AddNodeRequest): Canvas {
    this.controller.addNode(node);

    return this;
  }

  /**
   * updates node absolute coordinates
   */
  public updateNode(nodeId: unknown, request?: UpdateNodeRequest): Canvas {
    this.controller.updateNode(nodeId, request);

    return this;
  }

  /**
   * removes node from graph
   * all the ports of node get unmarked
   * all the edges adjacent to node get removed
   */
  public removeNode(nodeId: unknown): Canvas {
    this.controller.removeNode(nodeId);

    return this;
  }

  /**
   * marks element as port of node
   */
  public markPort(port: MarkPortRequest): Canvas {
    this.controller.markPort(port);

    return this;
  }

  /**
   * updates port and attached edges
   */
  public updatePort(portId: unknown, request?: UpdatePortRequest): Canvas {
    this.controller.updatePort(portId, request);

    return this;
  }

  /**
   * ummarks element as port of node
   * all the edges adjacent to port get removed
   */
  public unmarkPort(portId: unknown): Canvas {
    this.controller.unmarkPort(portId);

    return this;
  }

  /**
   * adds edge to graph
   */
  public addEdge(edge: AddEdgeRequest): Canvas {
    this.controller.addEdge(edge);

    return this;
  }

  /**
   * updates edge
   */
  public updateEdge(edgeId: unknown, request?: UpdateEdgeRequest): Canvas {
    this.controller.updateEdge(edgeId, request);

    return this;
  }

  /**
   * removes edge from graph
   */
  public removeEdge(edgeId: unknown): Canvas {
    this.controller.removeEdge(edgeId);

    return this;
  }

  /**
   * applies transformation for viewport
   */
  public patchViewportMatrix(request: PatchMatrixRequest): Canvas {
    this.controller.patchViewportMatrix(request);

    return this;
  }

  /**
   * applies transformation for content
   */
  public patchContentMatrix(request: PatchMatrixRequest): Canvas {
    this.controller.patchContentMatrix(request);

    return this;
  }

  /**
   * attaches canvas to given element
   */
  public attach(element: HTMLElement): Canvas {
    this.controller.attach(element);

    return this;
  }

  /**
   * detaches canvas from element
   */
  public detach(): Canvas {
    this.controller.detach();

    return this;
  }

  /**
   * clears graph
   * graph gets rolled back to initial state
   * canvas can be reused
   */
  public clear(): Canvas {
    this.controller.clear();

    return this;
  }

  /**
   * destroys canvas
   * canvas element gets rolled back to initial state
   * canvas can not be reused
   */
  public destroy(): void {
    this.controller.destroy();
  }
}
