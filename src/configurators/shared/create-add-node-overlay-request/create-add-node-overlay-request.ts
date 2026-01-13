import { AddNodeRequest } from "@/canvas";
import { OverlayNodeParams } from "./overlay-node-params";

export const createAddNodeOverlayRequest = (
  payload: OverlayNodeParams,
): AddNodeRequest => {
  const element = document.createElement("div");

  return {
    id: payload.overlayNodeId,
    element,
    x: payload.portCoords.x,
    y: payload.portCoords.y,
    ports: [
      {
        id: payload.overlayNodeId,
        element: element,
        direction: payload.portDirection,
      },
    ],
  };
};
