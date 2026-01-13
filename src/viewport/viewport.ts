import { Dimensions } from "@/dimensions";
import { EventHandler } from "@/event-subject";
import { Point } from "@/point";
import { ViewportStore, TransformState } from "@/viewport-store";

export class Viewport {
  public readonly onBeforeUpdated: EventHandler<void>;

  public readonly onAfterUpdated: EventHandler<void>;

  public readonly onAfterResize: EventHandler<void>;

  public constructor(private readonly viewportStore: ViewportStore) {
    this.onBeforeUpdated = this.viewportStore.onBeforeUpdated;
    this.onAfterUpdated = this.viewportStore.onAfterUpdated;
    this.onAfterResize = this.viewportStore.onAfterResize;
  }

  public getViewportMatrix(): TransformState {
    return { ...this.viewportStore.getViewportMatrix() };
  }

  public getContentMatrix(): TransformState {
    return { ...this.viewportStore.getContentMatrix() };
  }

  public getDimensions(): Dimensions {
    return this.viewportStore.getDimensions();
  }

  public createContentCoords(viewportCoords: Point): Point {
    return this.viewportStore.createContentCoords(viewportCoords);
  }

  public createViewportCoords(contentCoords: Point): Point {
    return this.viewportStore.createViewportCoords(contentCoords);
  }
}
