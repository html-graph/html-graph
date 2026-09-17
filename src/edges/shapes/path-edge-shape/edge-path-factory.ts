import { EdgePath } from "../../paths";
import { EdgePort } from "./edge-port";

export type EdgePathFactory = (from: EdgePort, to: EdgePort) => EdgePath;
