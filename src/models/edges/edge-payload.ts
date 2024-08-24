import { SvgController } from "../connection/svg-controller";

export interface EdgePayload {
    from: string;
    to: string;
    svgController: SvgController;
}
