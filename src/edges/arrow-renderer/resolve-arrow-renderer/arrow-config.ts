import { ArrowRenderer } from "../arrow-renderer";

export type ArrowRendererConfig =
  | {
      readonly type?: "wedge";
      readonly radius?: number | undefined;
      readonly angle?: number | undefined;
    }
  | {
      readonly type: "triangle";
      readonly radius?: number | undefined;
    }
  | {
      readonly type: "arc";
      readonly radius?: number | undefined;
    }
  | ArrowRenderer;
