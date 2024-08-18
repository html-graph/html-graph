import { TransformState } from "@/models/transform-state";

export class ViewportTransformer {
    private state: TransformState = {
      scale: 1,
      deltaX: 0,
      deltaY: 0,
    };

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
    applyShift(dx: number, dy: number): void {
        this.state = {
            scale: this.state.scale,
            deltaX: this.state.scale * dx + this.state.deltaX,
            deltaY: this.state.scale * dy + this.state.deltaY,
        }
    }

    /**
     * s2 - scale
     * cx - scale pivot x
     * cy - scale pivot y
     *
     *  s1  0   dx1     s2  0   (1 - s2) * cx
     *  0   s1  dy1     0   s2  (1 - s2) * cy
     *  0   0   1       0   0   1
     *
     * [s, dx, dy] = [s1 * s2, s1 * (1 - s2) * cx + dx1, s1 * (1 - s2) * cy + dy1]
     */
    applyScale(s2: number, cx: number, cy: number): void {
        this.state = {
            scale: this.state.scale * s2,
            deltaX: this.state.scale * (1 - s2) * cx + this.state.deltaX,
            deltaY: this.state.scale * (1 - s2) * cy + this.state.deltaY,
        };
    }

    getViewportCoordsFor(x0: number, y0: number): [number, number] {
        return [
           (x0 - this.state.deltaX) / this.state.scale,
           (y0 - this.state.deltaY) / this.state.scale,
        ];
    }

    getViewportScale(): number {
        return 1 / this.state.scale;
    }

    getCanvasCoordsFor(x0: number, y0: number): [number, number] {
        return [
           x0 * this.state.scale + this.state.deltaX,
           y0 * this.state.scale + this.state.deltaY,
        ];
    }
}
