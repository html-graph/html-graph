import {
  AddConnectionRequest,
  AddNodeRequest,
  MoveViewportRequest,
  ScaleViewportRequest,
  MarkPortRequest,
  PatchViewRequest,
  Canvas,
} from "../canvas";
import { TransformOptions } from "./transform-options";
import { PublicGraphStore } from "@/graph-store";
import { PublicViewportTransformer } from "@/viewport-transformer";
import { ConnectionController } from "@/connections";
import { TouchState } from "./touch-state";

export class TransformableCanvas implements Canvas {
  public readonly transformation: PublicViewportTransformer;

  public readonly model: PublicGraphStore;

  private element: HTMLElement | null = null;

  private isMoving = false;

  private prevTouches: TouchState | null = null;

  private readonly isScalable: boolean;

  private readonly isShiftable: boolean;

  private readonly minContentScale: number | null;

  private readonly maxContentScale: number | null;

  private readonly wheelSensitivity: number;

  private readonly onMouseDown: () => void = () => {
    this.setCursor("grab");
    this.isMoving = true;
  };

  private readonly onMouseMove: (event: MouseEvent) => void = (
    event: MouseEvent,
  ) => {
    if (!this.isMoving || !this.isShiftable) {
      return;
    }

    this.canvas.moveViewport({ x: -event.movementX, y: -event.movementY });
  };

  private readonly onMouseUp: () => void = () => {
    this.setCursor(null);
    this.isMoving = false;
  };

  private readonly onWheelScroll: (event: WheelEvent) => void = (
    event: WheelEvent,
  ) => {
    if (this.element === null || this.isScalable === false) {
      return;
    }

    event.preventDefault();

    const { left, top } = this.element.getBoundingClientRect();
    const centerX = event.clientX - left;
    const centerY = event.clientY - top;

    const velocity =
      event.deltaY < 0 ? this.wheelSensitivity : 1 / this.wheelSensitivity;

    const nextScale = this.canvas.transformation.getViewScale() * velocity;

    if (!this.checkNextScaleValid(nextScale)) {
      return;
    }

    this.canvas.scaleViewport({ scale: 1 / velocity, x: centerX, y: centerY });
  };

  private readonly onTouchStart: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    this.prevTouches = this.getAverageTouch(event);
  };

  private readonly onTouchMove: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    if (
      this.prevTouches === null ||
      this.element === null ||
      !this.isShiftable
    ) {
      return;
    }

    const currentTouches = this.getAverageTouch(event);

    if (currentTouches.touchesCnt === 1 || currentTouches.touchesCnt === 2) {
      this.canvas.moveViewport({
        x: -(currentTouches.x - this.prevTouches.x),
        y: -(currentTouches.y - this.prevTouches.y),
      });
    }

    if (currentTouches.touchesCnt === 2 && this.isScalable) {
      const { left, top } = this.element.getBoundingClientRect();
      const x = this.prevTouches.x - left;
      const y = this.prevTouches.y - top;
      const scale = currentTouches.scale / this.prevTouches.scale;
      const nextScale = this.canvas.transformation.getViewScale() * scale;

      if (this.checkNextScaleValid(nextScale)) {
        this.canvas.scaleViewport({ scale: 1 / scale, x, y });
      }
    }

    this.prevTouches = currentTouches;

    event.preventDefault();
  };

  private readonly onTouchEnd: () => void = () => {
    this.prevTouches = null;
  };

  public constructor(
    private readonly canvas: Canvas,
    private readonly options?: TransformOptions,
  ) {
    this.transformation = this.canvas.transformation;
    this.model = this.canvas.model;

    this.isScalable = this.options?.scale?.enabled !== false;
    this.minContentScale = this.options?.scale?.minContent ?? null;
    this.maxContentScale = this.options?.scale?.maxContent ?? null;
    this.isShiftable = this.options?.shift?.enabled !== false;

    const wheelVelocity = this.options?.scale?.wheelSensitivity;
    this.wheelSensitivity = wheelVelocity !== undefined ? wheelVelocity : 1.2;
  }

  public addNode(node: AddNodeRequest): TransformableCanvas {
    this.canvas.addNode(node);

    return this;
  }

  public removeNode(nodeId: string): TransformableCanvas {
    this.canvas.removeNode(nodeId);

    return this;
  }

  public markPort(port: MarkPortRequest): TransformableCanvas {
    this.canvas.markPort(port);

    return this;
  }

  public updatePortConnections(portId: string): TransformableCanvas {
    this.canvas.updatePortConnections(portId);

    return this;
  }

  public unmarkPort(portId: string): TransformableCanvas {
    this.canvas.unmarkPort(portId);

    return this;
  }

  public addConnection(connection: AddConnectionRequest): TransformableCanvas {
    this.canvas.addConnection(connection);

    return this;
  }

  public removeConnection(connectionId: string): TransformableCanvas {
    this.canvas.removeConnection(connectionId);

    return this;
  }

  public patchViewportState(
    apiTransform: PatchViewRequest,
  ): TransformableCanvas {
    this.canvas.patchViewportState(apiTransform);

    return this;
  }

  public moveViewport(apiTransform: MoveViewportRequest): TransformableCanvas {
    this.canvas.moveViewport(apiTransform);

    return this;
  }

  public scaleViewport(
    apiTransform: ScaleViewportRequest,
  ): TransformableCanvas {
    this.canvas.scaleViewport(apiTransform);

    return this;
  }

  public moveToNodes(nodeIds: readonly string[]): TransformableCanvas {
    this.canvas.moveToNodes(nodeIds);

    return this;
  }

  public updateNodeCoords(
    nodeId: string,
    x: number,
    y: number,
  ): TransformableCanvas {
    this.canvas.updateNodeCoords(nodeId, x, y);

    return this;
  }

  public updateConnectionController(
    connectionId: string,
    controller: ConnectionController,
  ): TransformableCanvas {
    this.canvas.updateConnectionController(connectionId, controller);

    return this;
  }

  public dragNode(nodeId: string, dx: number, dy: number): TransformableCanvas {
    this.canvas.dragNode(nodeId, dx, dy);

    return this;
  }

  public moveNodeOnTop(nodeId: string): TransformableCanvas {
    this.canvas.moveNodeOnTop(nodeId);

    return this;
  }

  public clear(): TransformableCanvas {
    this.canvas.clear();

    return this;
  }

  public attach(element: HTMLElement): TransformableCanvas {
    this.canvas.attach(element);
    this.element = element;

    this.element.addEventListener("mousedown", this.onMouseDown);
    this.element.addEventListener("mousemove", this.onMouseMove);
    this.element.addEventListener("mouseup", this.onMouseUp);
    this.element.addEventListener("wheel", this.onWheelScroll);
    this.element.addEventListener("touchstart", this.onTouchStart);
    this.element.addEventListener("touchmove", this.onTouchMove);
    this.element.addEventListener("touchend", this.onTouchEnd);
    this.element.addEventListener("touchcancel", this.onTouchEnd);

    return this;
  }

  public detach(): TransformableCanvas {
    this.canvas.detach();

    if (this.element !== null) {
      this.element.removeEventListener("mousedown", this.onMouseDown);
      this.element.removeEventListener("mousemove", this.onMouseMove);
      this.element.removeEventListener("mouseup", this.onMouseUp);
      this.element.removeEventListener("wheel", this.onWheelScroll);
      this.element.removeEventListener("touchstart", this.onTouchStart);
      this.element.removeEventListener("touchmove", this.onTouchMove);
      this.element.removeEventListener("touchend", this.onTouchEnd);
      this.element.removeEventListener("touchcancel", this.onTouchEnd);
    }

    this.element = null;

    return this;
  }

  public destroy(): void {
    this.detach();

    this.canvas.destroy();
  }

  private getAverageTouch(event: TouchEvent): TouchState {
    const touches: [number, number][] = [];

    const cnt = event.touches.length;

    for (let i = 0; i < cnt; i++) {
      touches.push([event.touches[i].clientX, event.touches[i].clientY]);
    }

    const sum: [number, number] = touches.reduce(
      (acc, cur) => [acc[0] + cur[0], acc[1] + cur[1]],
      [0, 0],
    );

    const avg = [sum[0] / cnt, sum[1] / cnt];

    const distances = touches.map((cur) => [cur[0] - avg[0], cur[1] - avg[1]]);

    const distance = distances.reduce(
      (acc, cur) => acc + Math.sqrt(cur[0] * cur[0] + cur[1] * cur[1]),
      0,
    );

    return { x: avg[0], y: avg[1], scale: distance / cnt, touchesCnt: cnt };
  }

  private checkNextScaleValid(nextScale: number): boolean {
    const scale = this.canvas.transformation.getViewScale();

    if (
      this.maxContentScale !== null &&
      nextScale > this.maxContentScale &&
      nextScale > scale
    ) {
      return false;
    }

    if (
      this.minContentScale !== null &&
      nextScale < this.minContentScale &&
      nextScale < scale
    ) {
      return false;
    }

    return true;
  }

  private setCursor(type: string | null): void {
    if (this.element === null) {
      return;
    }

    if (type !== null) {
      this.element.style.cursor = type;
    } else {
      this.element.style.removeProperty("cursor");
    }
  }
}
