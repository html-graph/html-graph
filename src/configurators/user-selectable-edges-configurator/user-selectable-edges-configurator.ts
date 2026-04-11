import { Canvas } from "@/canvas";
import {
  EventTagger,
  PointInsideVerifier,
  selectionHandled,
  UserSelectableElementsConfigurator,
} from "../shared";
import { UserSelectableEdgesParams } from "./user-selectable-edges-params";
import { Identifier } from "@/identifier";

export class UserSelectableEdgesConfigurator {
  private readonly configurator: UserSelectableElementsConfigurator;

  private readonly selectionHandledTag = selectionHandled;

  private readonly onEdgeSelected: (nodeId: Identifier) => void;

  private readonly onAfterEdgeAdded = (edgeId: Identifier): void => {
    const { shape } = this.canvas.graph.getEdge(edgeId);

    this.configurator.enable(shape.svg);
  };

  private readonly onBeforeEdgeRemoved = (edgeId: Identifier): void => {
    const { shape } = this.canvas.graph.getEdge(edgeId);

    this.configurator.disable(shape.svg);
  };

  private readonly reset = (): void => {
    this.canvas.graph.getAllEdgeIds().forEach((edgeId) => {
      const { shape } = this.canvas.graph.getEdge(edgeId);

      this.configurator.disable(shape.svg);
    });
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly window: Window,
    private readonly pointInsideVerifier: PointInsideVerifier,
    private readonly eventTagger: EventTagger,
    params: UserSelectableEdgesParams,
  ) {
    this.onEdgeSelected = params.onEdgeSelected;

    this.configurator = new UserSelectableElementsConfigurator(
      this.window,
      this.pointInsideVerifier,
      {
        onSelected: (element, event): void => {
          const edgeId = this.canvas.graph.findEdgeIdByElement(element)!;
          this.eventTagger.tag(event, this.selectionHandledTag);

          this.onEdgeSelected(edgeId);
        },
        movementThreshold: params.movementThreshold,
        mouseDownEventVerifier: params.mouseDownEventVerifier,
        mouseUpEventVerifier: params.mouseUpEventVerifier,
      },
    );

    this.canvas.graph.onAfterEdgeAdded.subscribe(this.onAfterEdgeAdded);
    this.canvas.graph.onBeforeEdgeRemoved.subscribe(this.onBeforeEdgeRemoved);
    this.canvas.graph.onBeforeClear.subscribe(this.reset);
    this.canvas.onBeforeDestroy.subscribe(this.reset);
  }

  public static configure(
    canvas: Canvas,
    window: Window,
    pointInsideVerifier: PointInsideVerifier,
    eventTagger: EventTagger,
    params: UserSelectableEdgesParams,
  ): void {
    new UserSelectableEdgesConfigurator(
      canvas,
      window,
      pointInsideVerifier,
      eventTagger,
      params,
    );
  }
}
