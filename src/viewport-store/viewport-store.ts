import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { calculateReverseMatrix } from "./calculate-reverse-matrix";
import { initialMatrix } from "./initial-matrix";
import { TransformState } from "./transform-state";
import { PatchTransformRequest } from "./patch-transform-request";
import { ViewportDimensions } from "./viewport-dimensions";

export class ViewportStore {
  private viewportMatrix: TransformState = initialMatrix;

  private contentMatrix: TransformState = initialMatrix;

  private readonly afterUpdateEmitter: EventEmitter<void>;

  public readonly onAfterUpdated: EventHandler<void>;

  private readonly afterResizeEmitter: EventEmitter<void>;

  public readonly onAfterResize: EventHandler<void>;

  private observer: ResizeObserver = new ResizeObserver(() => {
    this.afterResizeEmitter.emit();
  });

  public constructor(private readonly host: HTMLElement) {
    [this.afterUpdateEmitter, this.onAfterUpdated] = createPair<void>();
    [this.afterResizeEmitter, this.onAfterResize] = createPair<void>();
    this.observer.observe(this.host);
  }

  public getViewportMatrix(): TransformState {
    return this.viewportMatrix;
  }

  public getContentMatrix(): TransformState {
    return this.contentMatrix;
  }

  public patchViewportMatrix(matrix: PatchTransformRequest): void {
    this.viewportMatrix = {
      scale: matrix.scale ?? this.viewportMatrix.scale,
      x: matrix.x ?? this.viewportMatrix.x,
      y: matrix.y ?? this.viewportMatrix.y,
    };

    this.contentMatrix = calculateReverseMatrix(this.viewportMatrix);
    this.afterUpdateEmitter.emit();
  }

  public patchContentMatrix(matrix: PatchTransformRequest): void {
    this.contentMatrix = {
      scale: matrix.scale ?? this.contentMatrix.scale,
      x: matrix.x ?? this.contentMatrix.x,
      y: matrix.y ?? this.contentMatrix.y,
    };

    this.viewportMatrix = calculateReverseMatrix(this.contentMatrix);
    this.afterUpdateEmitter.emit();
  }

  public getDimensions(): ViewportDimensions {
    const { width, height } = this.host.getBoundingClientRect();

    return { width, height };
  }

  public destroy(): void {
    this.observer.disconnect();
  }
}
