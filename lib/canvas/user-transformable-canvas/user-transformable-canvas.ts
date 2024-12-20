import {
  AddConnectionRequest,
  AddNodeRequest,
  MarkPortRequest,
  PatchViewportRequest,
  Canvas,
  UpdateConnectionRequest,
} from "../canvas";
import { TransformOptions } from "./transform-options";
import { PublicViewportTransformer } from "@/viewport-transformer";
import { TouchState } from "./touch-state";
import { TransformPayload } from "./transform-payload";

export class UserTransformableCanvas implements Canvas {
  public readonly transformation: PublicViewportTransformer;

  private element: HTMLElement | null = null;

  private isMoving = false;

  private prevTouches: TouchState | null = null;

  private onTransform: (payload: TransformPayload) => void;

  private onBeforeTransform: (payload: TransformPayload) => boolean;

  private readonly isScalable: boolean;

  private readonly isShiftable: boolean;

  private readonly minViewScale: number | null;

  private readonly maxViewScale: number | null;

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

    const deltaViewX = -event.movementX;
    const deltaViewY = -event.movementY;

    this.moveViewport(deltaViewX, deltaViewY);
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
    const deltaScale =
      event.deltaY < 0 ? this.wheelSensitivity : 1 / this.wheelSensitivity;
    const deltaViewScale = 1 / deltaScale;

    this.scaleViewport(deltaViewScale, centerX, centerY);
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
      this.moveViewport(
        -(currentTouches.x - this.prevTouches.x),
        -(currentTouches.y - this.prevTouches.y),
      );
    }

    if (currentTouches.touchesCnt === 2 && this.isScalable) {
      const { left, top } = this.element.getBoundingClientRect();
      const x = this.prevTouches.x - left;
      const y = this.prevTouches.y - top;
      const deltaScale = currentTouches.scale / this.prevTouches.scale;
      const deltaViewScale = 1 / deltaScale;

      this.scaleViewport(deltaViewScale, x, y);
    }

    this.prevTouches = currentTouches;

    event.preventDefault();
  };

  private readonly onTouchEnd: (event: TouchEvent) => void = (
    event: TouchEvent,
  ) => {
    if (event.touches.length > 0) {
      this.prevTouches = this.getAverageTouch(event);
    } else {
      this.prevTouches = null;
    }
  };

  public constructor(
    private readonly canvas: Canvas,
    private readonly options?: TransformOptions,
  ) {
    this.transformation = this.canvas.transformation;

    const minContentScale = this.options?.scale?.minContent ?? null;
    const maxContentScale = this.options?.scale?.maxContent ?? null;

    this.isScalable = this.options?.scale?.enabled !== false;
    this.minViewScale = maxContentScale !== null ? 1 / maxContentScale : null;
    this.maxViewScale = minContentScale !== null ? 1 / minContentScale : null;
    this.isShiftable = this.options?.shift?.enabled !== false;

    const wheelVelocity = this.options?.scale?.wheelSensitivity;
    this.wheelSensitivity = wheelVelocity !== undefined ? wheelVelocity : 1.2;

    const onTransformDefault: (payload: TransformPayload) => void = () => {
      // no implementation by default
    };

    this.onTransform = options?.events?.onTransform ?? onTransformDefault;

    const onBeforeTransformDefault: (
      payload: TransformPayload,
    ) => boolean = () => {
      return true;
    };

    this.onBeforeTransform =
      options?.events?.onBeforeTransform ?? onBeforeTransformDefault;
  }

  public addNode(node: AddNodeRequest): UserTransformableCanvas {
    this.canvas.addNode(node);

    return this;
  }

  public removeNode(nodeId: string): UserTransformableCanvas {
    this.canvas.removeNode(nodeId);

    return this;
  }

  public markPort(port: MarkPortRequest): UserTransformableCanvas {
    this.canvas.markPort(port);

    return this;
  }

  public updatePortConnections(portId: string): UserTransformableCanvas {
    this.canvas.updatePortConnections(portId);

    return this;
  }

  public unmarkPort(portId: string): UserTransformableCanvas {
    this.canvas.unmarkPort(portId);

    return this;
  }

  public addConnection(
    connection: AddConnectionRequest,
  ): UserTransformableCanvas {
    this.canvas.addConnection(connection);

    return this;
  }

  public removeConnection(connectionId: string): UserTransformableCanvas {
    this.canvas.removeConnection(connectionId);

    return this;
  }

  public patchViewportState(
    request: PatchViewportRequest,
  ): UserTransformableCanvas {
    this.canvas.patchViewportState(request);

    return this;
  }

  public moveToNodes(nodeIds: readonly string[]): UserTransformableCanvas {
    this.canvas.moveToNodes(nodeIds);

    return this;
  }

  public updateNodeCoordinates(
    nodeId: string,
    x: number,
    y: number,
  ): UserTransformableCanvas {
    this.canvas.updateNodeCoordinates(nodeId, x, y);

    return this;
  }

  public updateConnection(
    connectionId: string,
    request: UpdateConnectionRequest,
  ): UserTransformableCanvas {
    this.canvas.updateConnection(connectionId, request);

    return this;
  }

  public moveNodeOnTop(nodeId: string): UserTransformableCanvas {
    this.canvas.moveNodeOnTop(nodeId);

    return this;
  }

  public clear(): UserTransformableCanvas {
    this.canvas.clear();

    return this;
  }

  public attach(element: HTMLElement): UserTransformableCanvas {
    this.detach();
    this.element = element;

    this.canvas.attach(this.element);
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

  public detach(): UserTransformableCanvas {
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
      this.element = null;
    }

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

  private moveViewport(dx2: number, dy2: number): void {
    /**
     * dx2 - traslate x
     * dy2 - traslate y
     *
     * direct transform
     *  s1  0   dx1     1   0   dx2
     *  0   s1  dy1     0   1   dy2
     *  0   0   1       0   0   1
     *
     * [s, dx, dy] = [s1, s * dx2 + dx1, s * dy2 + dy1]
     */
    const [dx1, dy1] = this.transformation.getAbsCoords(0, 0);
    const s1 = this.canvas.transformation.getAbsScale();

    const transform: TransformPayload = {
      scale: s1,
      x: dx1 + s1 * dx2,
      y: dy1 + s1 * dy2,
    };

    if (!this.onBeforeTransform({ ...transform })) {
      return;
    }

    this.canvas.patchViewportState(transform);
    this.onTransform(transform);
  }

  private scaleViewport(s2: number, cx: number, cy: number): void {
    const [dx1, dy1] = this.canvas.transformation.getAbsCoords(0, 0);
    const s1 = this.canvas.transformation.getAbsScale();

    /**
     * s2 - scale
     * cx - scale center x
     * cy - scale center y
     *
     *  s1  0   dx1     s2  0   (1 - s2) * cx
     *  0   s1  dy1     0   s2  (1 - s2) * cy
     *  0   0   1       0   0   1
     *
     * [s, dx, dy] = [s1 * s2, s1 * (1 - s2) * cx + dx1, s1 * (1 - s2) * cy + dy1]
     */
    const scale = s1 * s2;
    const x = s1 * (1 - s2) * cx + dx1;
    const y = s1 * (1 - s2) * cy + dy1;

    if (this.maxViewScale !== null && scale > this.maxViewScale && scale > s1) {
      return;
    }

    if (this.minViewScale !== null && scale < this.minViewScale && scale < s1) {
      return;
    }

    const transform: TransformPayload = { scale, x, y };

    if (!this.onBeforeTransform({ ...transform })) {
      return;
    }

    this.canvas.patchViewportState(transform);
    this.onTransform(transform);
  }
}
