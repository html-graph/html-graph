import { ApiConnection } from "../models/connection/api-connection";
import { ApiUpdateConnection } from "../models/connection/api-update-connection";
import { ApiNode } from "../models/nodes/api-node";
import { ApiPort } from "../models/port/api-port";
import { ApiContentMoveTransform } from "../models/transform/api-content-move-transform";
import { ApiContentScaleTransform } from "../models/transform/api-content-scale-transform";
import { ApiTransform } from "../models/transform/api-transform";
import { Canvas } from "../canvas/canvas";
import { TransformOptions } from "../main";
import { TouchState } from "../models/touch-state/touch-state";

export class TransformableCanvas implements Canvas {
  private element: HTMLElement | null = null;

  private isMoving = false;

  private prevTouches: TouchState | null = null;

  private scale = 1;

  private readonly isScalable: boolean;

  private readonly isShiftable: boolean;

  private readonly minScale: number | null;

  private readonly maxScale: number | null;

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

    const nextScale = this.scale * velocity;

    if (!this.checkNextScaleValid(nextScale)) {
      return;
    }

    this.scale = nextScale;
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
      const nextScale = this.scale * scale;

      if (this.checkNextScaleValid(nextScale)) {
        this.scale = nextScale;
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
    this.isScalable = this.options?.scale?.enabled !== false;
    this.minScale = this.options?.scale?.min ?? null;
    this.maxScale = this.options?.scale?.max ?? null;
    this.isShiftable = this.options?.shift?.enabled !== false;

    const wheelVelocity = this.options?.scale?.wheelSensitivity;
    this.wheelSensitivity = wheelVelocity !== undefined ? wheelVelocity : 1.2;
  }

  addNode(node: ApiNode): Canvas {
    this.canvas.addNode(node);

    return this;
  }

  removeNode(nodeId: string): Canvas {
    this.canvas.removeNode(nodeId);

    return this;
  }

  markPort(port: ApiPort): Canvas {
    this.canvas.markPort(port);

    return this;
  }

  updatePortConnections(portId: string): Canvas {
    this.canvas.updatePortConnections(portId);

    return this;
  }

  unmarkPort(portId: string): Canvas {
    this.canvas.unmarkPort(portId);

    return this;
  }

  addConnection(connection: ApiConnection): Canvas {
    this.canvas.addConnection(connection);

    return this;
  }

  removeConnection(connectionId: string): Canvas {
    this.canvas.removeConnection(connectionId);

    return this;
  }

  patchViewportTransform(apiTransform: ApiTransform): Canvas {
    this.canvas.patchViewportTransform(apiTransform);

    return this;
  }

  moveContent(apiTransform: ApiContentMoveTransform): Canvas {
    this.canvas.moveContent(apiTransform);

    return this;
  }

  scaleContent(apiTransform: ApiContentScaleTransform): Canvas {
    this.canvas.scaleContent(apiTransform);

    return this;
  }

  moveToNodes(nodeIds: readonly string[]): Canvas {
    this.canvas.moveToNodes(nodeIds);

    return this;
  }

  updateNodeCoords(nodeId: string, x: number, y: number): Canvas {
    this.canvas.updateNodeCoords(nodeId, x, y);

    return this;
  }

  updateConnectionOptions(
    connectionId: string,
    options: ApiUpdateConnection,
  ): Canvas {
    this.canvas.updateConnectionOptions(connectionId, options);

    return this;
  }

  dragNode(nodeId: string, dx: number, dy: number): Canvas {
    this.canvas.dragNode(nodeId, dx, dy);

    return this;
  }

  moveNodeOnTop(nodeId: string): Canvas {
    this.canvas.moveNodeOnTop(nodeId);

    return this;
  }

  clear(): Canvas {
    this.canvas.clear();

    return this;
  }

  attach(element: HTMLElement): Canvas {
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

  detach(): Canvas {
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
    if (
      this.maxScale !== null &&
      nextScale > this.maxScale &&
      nextScale > this.scale
    ) {
      return false;
    }

    if (
      this.minScale !== null &&
      nextScale < this.minScale &&
      nextScale < this.scale
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
