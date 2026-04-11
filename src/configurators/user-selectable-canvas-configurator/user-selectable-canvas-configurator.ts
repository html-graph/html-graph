import { Canvas } from "@/canvas";
import { UserSelectableCanvasParams } from "./user-selectable-canvas-params";
import {
  EventTagger,
  PointInsideVerifier,
  selectionHandled,
  UserSelectableElementsConfigurator,
} from "../shared";

export class UserSelectableCanvasConfigurator {
  private readonly configurator: UserSelectableElementsConfigurator;

  private readonly onCanvasSelected: () => void;

  private readonly selectionHandledTag = selectionHandled;

  private readonly restore = (): void => {
    this.configurator.disable(this.element);
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly element: HTMLElement,
    private readonly window: Window,
    private readonly pointInsideVerifier: PointInsideVerifier,
    private readonly eventTagger: EventTagger,
    params: UserSelectableCanvasParams,
  ) {
    this.onCanvasSelected = params.onCanvasSelected;

    this.configurator = new UserSelectableElementsConfigurator(
      this.window,
      this.pointInsideVerifier,
      {
        onSelected: (_element, event): void => {
          if (!this.eventTagger.has(event, this.selectionHandledTag)) {
            this.onCanvasSelected();
          }
        },
        movementThreshold: params.movementThreshold,
        mouseDownEventVerifier: params.mouseDownEventVerifier,
        mouseUpEventVerifier: params.mouseUpEventVerifier,
      },
    );

    this.configurator.enable(this.element);

    this.canvas.onBeforeDestroy.subscribe(this.restore);
  }

  public static configure(
    canvas: Canvas,
    element: HTMLElement,
    window: Window,
    pointInsideVerifier: PointInsideVerifier,
    eventTagger: EventTagger,
    params: UserSelectableCanvasParams,
  ): void {
    new UserSelectableCanvasConfigurator(
      canvas,
      element,
      window,
      pointInsideVerifier,
      eventTagger,
      params,
    );
  }
}
