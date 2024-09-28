import { TransformState } from "../../models/transform/transform-state";

export class ViewportTransformer {
  private state: TransformState = {
    scale: 1,
    x: 0,
    y: 0,
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
      x: this.state.scale * dx + this.state.x,
      y: this.state.scale * dy + this.state.y,
    };
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
    const newScale = this.state.scale * s2;

    this.state = {
      scale: newScale,
      x: this.state.scale * (1 - s2) * cx + this.state.x,
      y: this.state.scale * (1 - s2) * cy + this.state.y,
    };
  }

  getViewportCoords(xa: number, ya: number): [number, number] {
    return [
      (xa - this.state.x) / this.state.scale,
      (ya - this.state.y) / this.state.scale,
    ];
  }

  getViewportScale(): number {
    return 1 / this.state.scale;
  }

  getAbsoluteCoords(xv: number, yv: number): [number, number] {
    return [
      xv * this.state.scale + this.state.x,
      yv * this.state.scale + this.state.y,
    ];
  }

  getAbsoluteScale(): number {
    return this.state.scale;
  }

  patchState(scale: number | null, x: number | null, y: number | null): void {
    this.state = {
      scale: scale ?? this.state.scale,
      x: x ?? this.state.x,
      y: y ?? this.state.y,
    };
  }
}
