import { ArrowRenderer } from "../arrow-renderer";

export type ArrowRendererConfig =
  | {
      readonly type?: "polygon";
      readonly radius?: number | undefined;
    }
  | {
      readonly type?: "circle";
      readonly radius?: number | undefined;
    }
  | ArrowRenderer;
