import { TransformState } from "./transform-state";

export class ViewportTransformer {
  private state: TransformState = {
    scale: 1,
    x: 0,
    y: 0,
  };

  public getViewCoords(xa: number, ya: number): [number, number] {
    return [
      (xa - this.state.x) / this.state.scale,
      (ya - this.state.y) / this.state.scale,
    ];
  }

  public getViewScale(): number {
    return 1 / this.state.scale;
  }

  public getAbsCoords(xv: number, yv: number): [number, number] {
    return [
      xv * this.state.scale + this.state.x,
      yv * this.state.scale + this.state.y,
    ];
  }

  public getAbsScale(): number {
    return this.state.scale;
  }

  public patchState(
    scale: number | null,
    x: number | null,
    y: number | null,
  ): void {
    this.state = {
      scale: scale ?? this.state.scale,
      x: x ?? this.state.x,
      y: y ?? this.state.y,
    };
  }
}
