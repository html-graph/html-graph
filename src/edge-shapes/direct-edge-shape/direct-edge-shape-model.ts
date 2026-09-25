export type DirectEdgeShapeModel = (
  | {
      readonly empty: true;
    }
  | {
      readonly empty: false;
    }
) & {
  readonly box: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
};
