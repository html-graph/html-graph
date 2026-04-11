import { Canvas } from "@/canvas";
import { UserSelectableNodesParams } from "./user-selectable-nodes-params";
import { Identifier } from "@/identifier";
import {
  EventTagger,
  PointInsideVerifier,
  selectionHandled,
  UserSelectableElementsConfigurator,
} from "../shared";

export class UserSelectableNodesConfigurator {
  private readonly configurator: UserSelectableElementsConfigurator;

  private readonly onNodeSelected: (nodeId: Identifier) => void;

  private readonly selectionHandledTag = selectionHandled;

  private readonly onAfterNodeAdded = (nodeId: Identifier): void => {
    const { element } = this.canvas.graph.getNode(nodeId);

    this.configurator.enable(element);
  };

  private readonly onBeforeNodeRemoved = (nodeId: Identifier): void => {
    const { element } = this.canvas.graph.getNode(nodeId);

    this.configurator.disable(element);
  };

  private readonly reset = (): void => {
    this.canvas.graph.getAllNodeIds().forEach((nodeId) => {
      const { element } = this.canvas.graph.getNode(nodeId);

      this.configurator.disable(element);
    });
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly window: Window,
    private readonly pointInsideVerifier: PointInsideVerifier,
    private readonly eventTagger: EventTagger,
    params: UserSelectableNodesParams,
  ) {
    this.onNodeSelected = params.onNodeSelected;

    this.configurator = new UserSelectableElementsConfigurator(
      this.window,
      this.pointInsideVerifier,
      {
        onSelected: (element, event): void => {
          const nodeId = this.canvas.graph.findNodeIdByElement(element)!;

          this.eventTagger.tag(event, this.selectionHandledTag);
          this.onNodeSelected(nodeId);
        },
        movementThreshold: params.movementThreshold,
        mouseDownEventVerifier: params.mouseDownEventVerifier,
        mouseUpEventVerifier: params.mouseUpEventVerifier,
      },
    );

    this.canvas.graph.onAfterNodeAdded.subscribe(this.onAfterNodeAdded);
    this.canvas.graph.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved);
    this.canvas.graph.onBeforeClear.subscribe(this.reset);
    this.canvas.onBeforeDestroy.subscribe(this.reset);
  }

  public static configure(
    canvas: Canvas,
    window: Window,
    pointInsideVerifier: PointInsideVerifier,
    eventTagger: EventTagger,
    params: UserSelectableNodesParams,
  ): void {
    new UserSelectableNodesConfigurator(
      canvas,
      window,
      pointInsideVerifier,
      eventTagger,
      params,
    );
  }
}
