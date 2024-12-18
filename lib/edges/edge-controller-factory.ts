import { EdgeController } from "./edge-controller";
import { EdgeType } from "./edge-type";

export type EdgeControllerFactory = (type: EdgeType) => EdgeController;
