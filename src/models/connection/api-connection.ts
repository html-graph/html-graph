import { SvgController } from "./svg-controller";

export interface ApiConnection {
    id: string;
    from: string;
    to: string;
    svgController?: SvgController;
}
