import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { calculateReverseMatrix } from "./calculate-reverse-matrix";
import { initialMatrix } from "./initial-matrix";
import { TransformState } from "./transform-state";
import { PatchTransformRequest } from "./patch-transform-request";

/**
 * This entity is responsible for storing viewport transformation
 */
export class ViewportStore {
  private viewportMatrix: TransformState = initialMatrix;

  private contentMatrix: TransformState = initialMatrix;

  private readonly afterUpdateEmitter: EventEmitter<void>;

  public readonly onAfterUpdate: EventHandler<void>;

  private readonly beforeUpdateEmitter: EventEmitter<void>;

  public readonly onBeforeUpdate: EventHandler<void>;

  public constructor() {
    [this.afterUpdateEmitter, this.onAfterUpdate] = createPair<void>();
    [this.beforeUpdateEmitter, this.onBeforeUpdate] = createPair<void>();
  }

  public getViewportMatrix(): TransformState {
    return this.viewportMatrix;
  }

  public getContentMatrix(): TransformState {
    return this.contentMatrix;
  }

  public patchViewportMatrix(matrix: PatchTransformRequest): void {
    this.beforeUpdateEmitter.emit();

    this.viewportMatrix = {
      scale: matrix.scale ?? this.viewportMatrix.scale,
      x: matrix.x ?? this.viewportMatrix.x,
      y: matrix.y ?? this.viewportMatrix.y,
    };

    this.contentMatrix = calculateReverseMatrix(this.viewportMatrix);
    this.afterUpdateEmitter.emit();
  }

  public patchContentMatrix(matrix: PatchTransformRequest): void {
    this.beforeUpdateEmitter.emit();

    this.contentMatrix = {
      scale: matrix.scale ?? this.contentMatrix.scale,
      x: matrix.x ?? this.contentMatrix.x,
      y: matrix.y ?? this.contentMatrix.y,
    };

    this.viewportMatrix = calculateReverseMatrix(this.contentMatrix);
    this.afterUpdateEmitter.emit();
  }
}
