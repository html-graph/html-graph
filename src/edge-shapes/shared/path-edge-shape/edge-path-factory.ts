import { EdgePath } from "../paths";
import { PathPort } from "../path-port";

export type EdgePathFactory = (from: PathPort, to: PathPort) => EdgePath;
