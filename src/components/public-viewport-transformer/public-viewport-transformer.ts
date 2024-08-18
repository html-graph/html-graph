import { ViewportTransformer } from "../viewport-transformer/viewport-transformer";

export class PublicViewportTransformer {
    constructor(
        private readonly transformer: ViewportTransformer,
    ) { }

    /**
     * for given absolute coordinates returns viewport coordinates
     * viewport coordinated represent actual coordinates on canvas for given absolute coordinates
     */
    getViewCoords(x0: number, y0: number): [number, number] {
        return this.transformer.getViewportCoordsFor(x0, y0);
    }

    /**
     * returns viewport scale
     * it represents scale at which entities on canvas should be scaled to fit current scale
     */
    getViewScale(): number {
        return this.transformer.getViewportScale();
    }

    /**
     * for given viewport coordinates returns absolute coordinates
     * absolute coordinates represent actual coordinates, which stay constant even for transformed canvas
     */
    getAbsCoords(x0: number, y0: number): [number, number] {
        return this.transformer.getAbsoluteCoordsFor(x0, y0);
    }

    /**
     * returns absolute scale
     * it represents scale at which current viewport was scaled compared to initial state
     */
    getAbsScale(): number {
        return this.transformer.getAbsoluteScale();
    }
}
