export type LayoutOptions =
  | {
      type: "none";
    }
  | {
      type: "random";
      x?: number;
      y?: number;
      width?: number;
      height?: number;
    };
