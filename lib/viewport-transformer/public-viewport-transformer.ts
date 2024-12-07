import { ViewportTransformer } from "./viewport-transformer";

export class PublicViewportTransformer {
  public constructor(private readonly transformer: ViewportTransformer) {}

  /**
   * for given absolute coordinates returns viewport coordinates
   * viewport coordinated represent actual coordinates on screen for given absolute coordinates
   */
  public getViewCoords(xa: number, ya: number): [number, number] {
    return this.transformer.getViewCoords(xa, ya);
  }

  /**
   * returns viewport scale
   * it represents scale at which entities on canvas should be scaled to fit current scale
   */
  public getViewScale(): number {
    return this.transformer.getViewScale();
  }

  /**
   * for given viewport coordinates returns absolute coordinates
   * absolute coordinates represent actual coordinates, which stay constant even for transformed canvas
   */
  public getAbsCoords(xv: number, yv: number): [number, number] {
    return this.transformer.getAbsCoords(xv, yv);
  }

  /**
   * returns absolute scale
   * it represents scale at which current viewport was scaled compared to initial state
   */
  public getAbsScale(): number {
    return this.transformer.getAbsScale();
  }
}
