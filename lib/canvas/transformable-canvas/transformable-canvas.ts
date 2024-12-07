import {
  AddConnectionRequest,
  AddNodeRequest,
  ApiContentMoveTransform,
  ApiContentScaleTransform,
  ApiPort,
  ApiTransform,
  Canvas,
  TransformOptions,
} from "..";
import { PublicGraphStore } from "../../graph-store";
import { PublicViewportTransformer } from "../../viewport-transformer";
import { ConnectionController } from "../../connections";
import { TouchState } from "./touch-state";

export class TransformableCanvas implements Canvas {
  readonly transformation: PublicViewportTransformer;

  readonly model: PublicGraphStore;

  private element: HTMLElement | null = null;

  private isMoving = false;

  private prevTouches: TouchState | null = null;

  private readonly isScalable: boolean;

  private readonly isShiftable: boolean;

  private readonly minContentScale: number | null;

  private readonly maxContentScale: number | null;

  private readonly wheelSensitivity: number;

  private readonly onMouseDown = () => {
    this.setCursor("grab");
    this.isMoving = true;
  };

  private readonly onMouseMove = (event: MouseEvent) => {
    if (!this.isMoving || !this.isShiftable) {
      return;
    }

    this.canvas.moveContent({ x: event.movementX, y: event.movementY });
  };

  private readonly onMouseUp = () => {
    this.setCursor(null);
    this.isMoving = false;
  };

  private readonly onWheelScroll = (event: WheelEvent) => {
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

    this.canvas.scaleContent({ scale: velocity, x: centerX, y: centerY });
  };

  private readonly onTouchStart = (event: TouchEvent) => {
    this.prevTouches = this.getAverageTouch(event);
  };

  private readonly onTouchMove = (event: TouchEvent) => {
    if (
      this.prevTouches === null ||
      this.element === null ||
      !this.isShiftable
    ) {
      return;
    }

    const currentTouches = this.getAverageTouch(event);

    if (currentTouches.touchesCnt === 1 || currentTouches.touchesCnt === 2) {
      this.canvas.moveContent({
        x: currentTouches.x - this.prevTouches.x,
        y: currentTouches.y - this.prevTouches.y,
      });
    }

    if (currentTouches.touchesCnt === 2 && this.isScalable) {
      const { left, top } = this.element.getBoundingClientRect();
      const x = this.prevTouches.x - left;
      const y = this.prevTouches.y - top;
      const scale = currentTouches.scale / this.prevTouches.scale;
      const nextScale = this.canvas.transformation.getViewScale() * scale;

      if (this.checkNextScaleValid(nextScale)) {
        this.canvas.scaleContent({ scale, x, y });
      }
    }

    this.prevTouches = currentTouches;

    event.preventDefault();
  };

  private readonly onTouchEnd = () => {
    this.prevTouches = null;
  };

  constructor(
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

  addNode(node: AddNodeRequest): TransformableCanvas {
    this.canvas.addNode(node);

    return this;
  }

  removeNode(nodeId: string): TransformableCanvas {
    this.canvas.removeNode(nodeId);

    return this;
  }

  markPort(port: ApiPort): TransformableCanvas {
    this.canvas.markPort(port);

    return this;
  }

  updatePortConnections(portId: string): TransformableCanvas {
    this.canvas.updatePortConnections(portId);

    return this;
  }

  unmarkPort(portId: string): TransformableCanvas {
    this.canvas.unmarkPort(portId);

    return this;
  }

  addConnection(connection: AddConnectionRequest): TransformableCanvas {
    this.canvas.addConnection(connection);

    return this;
  }

  removeConnection(connectionId: string): TransformableCanvas {
    this.canvas.removeConnection(connectionId);

    return this;
  }

  patchViewportTransform(apiTransform: ApiTransform): TransformableCanvas {
    this.canvas.patchViewportTransform(apiTransform);

    return this;
  }

  moveContent(apiTransform: ApiContentMoveTransform): TransformableCanvas {
    this.canvas.moveContent(apiTransform);

    return this;
  }

  scaleContent(apiTransform: ApiContentScaleTransform): TransformableCanvas {
    this.canvas.scaleContent(apiTransform);

    return this;
  }

  moveToNodes(nodeIds: readonly string[]): TransformableCanvas {
    this.canvas.moveToNodes(nodeIds);

    return this;
  }

  updateNodeCoords(nodeId: string, x: number, y: number): TransformableCanvas {
    this.canvas.updateNodeCoords(nodeId, x, y);

    return this;
  }

  updateConnectionController(
    connectionId: string,
    controller: ConnectionController,
  ): TransformableCanvas {
    this.canvas.updateConnectionController(connectionId, controller);

    return this;
  }

  dragNode(nodeId: string, dx: number, dy: number): TransformableCanvas {
    this.canvas.dragNode(nodeId, dx, dy);

    return this;
  }

  moveNodeOnTop(nodeId: string): TransformableCanvas {
    this.canvas.moveNodeOnTop(nodeId);

    return this;
  }

  clear(): TransformableCanvas {
    this.canvas.clear();

    return this;
  }

  attach(element: HTMLElement): TransformableCanvas {
    this.canvas.attach(element);
    this.element = element;

    element.addEventListener("mousedown", this.onMouseDown);
    element.addEventListener("mousemove", this.onMouseMove);
    element.addEventListener("mouseup", this.onMouseUp);
    element.addEventListener("wheel", this.onWheelScroll);
    element.addEventListener("touchstart", this.onTouchStart);
    element.addEventListener("touchmove", this.onTouchMove);
    element.addEventListener("touchend", this.onTouchEnd);
    element.addEventListener("touchcancel", this.onTouchEnd);

    return this;
  }

  detach(): TransformableCanvas {
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

  destroy(): void {
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
