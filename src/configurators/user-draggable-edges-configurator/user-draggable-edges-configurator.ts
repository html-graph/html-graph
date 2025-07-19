import { Canvas } from "@/canvas";
import { UserDraggableEdgesParams } from "./user-draggable-edges-params";

export class UserDraggableEdgesConfigurator {
  private readonly onAfterPortMarked = (portId: unknown): void => {
    const port = this.canvas.graph.getPort(portId)!;
    const elementPortIds = this.canvas.graph.getElementPortsIds(port.element);

    if (elementPortIds.length === 1) {
      this.hookPortEvents(port.element);
    }
  };

  private readonly onBeforePortUnmarked = (portId: unknown): void => {
    const port = this.canvas.graph.getPort(portId)!;
    const elementPortIds = this.canvas.graph.getElementPortsIds(port.element);

    if (elementPortIds.length === 1) {
      this.unhookPortEvents(port.element);
    }
  };

  private readonly onPortMouseDown = (event: MouseEvent): void => {
    if (!this.params.mouseDownEventVerifier(event)) {
      return;
    }

    const target = event.currentTarget as HTMLElement;
    const portId = this.canvas.graph.getElementPortsIds(target)[0]!;

    console.log(portId);
  };

  private readonly onPortTouchStart = (event: TouchEvent): void => {
    if (event.touches.length !== 1) {
      return;
    }

    const target = event.currentTarget as HTMLElement;
    const portId = this.canvas.graph.getElementPortsIds(target)[0]!;

    console.log(portId);
  };

  private readonly onBeforeClear = (): void => {
    this.canvas.graph.getAllPortIds().forEach((portId) => {
      const port = this.canvas.graph.getPort(portId)!;
      this.unhookPortEvents(port.element);
    });
  };

  private readonly onBeforeDestroy = (): void => {
    this.canvas.graph.onAfterPortMarked.unsubscribe(this.onAfterPortMarked);
    this.canvas.graph.onBeforePortUnmarked.unsubscribe(
      this.onBeforePortUnmarked,
    );
    this.canvas.graph.onBeforeClear.unsubscribe(this.onBeforeClear);
    this.canvas.onBeforeDestroy.unsubscribe(this.onBeforeDestroy);
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly params: UserDraggableEdgesParams,
  ) {
    console.log(this.params);
    this.canvas.graph.onAfterPortMarked.subscribe(this.onAfterPortMarked);
    this.canvas.graph.onBeforePortUnmarked.subscribe(this.onBeforePortUnmarked);
    this.canvas.graph.onBeforeClear.subscribe(this.onBeforeClear);
    this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }

  public static configure(
    canvas: Canvas,
    params: UserDraggableEdgesParams,
  ): void {
    new UserDraggableEdgesConfigurator(canvas, params);
  }

  private hookPortEvents(element: HTMLElement): void {
    element.addEventListener("mousedown", this.onPortMouseDown, {
      passive: true,
    });
    element.addEventListener("touchstart", this.onPortTouchStart, {
      passive: true,
    });
  }

  private unhookPortEvents(element: HTMLElement): void {
    element.removeEventListener("mousedown", this.onPortMouseDown);
    element.removeEventListener("touchstart", this.onPortTouchStart);
  }
}
