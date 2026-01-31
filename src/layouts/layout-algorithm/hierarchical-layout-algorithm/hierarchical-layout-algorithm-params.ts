import { CoordsTransformationMatrix } from "../../shared";

export interface HierarchicalLayoutAlgorithmParams {
  readonly layerWidth: number;
  readonly layerSpace: number;
  readonly transform: CoordsTransformationMatrix;
}
