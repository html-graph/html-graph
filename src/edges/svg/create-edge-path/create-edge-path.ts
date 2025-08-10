import { cssVariables } from "../css-variables";

export const createEdgePath = (width: number): SVGPathElement => {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  path.setAttribute("stroke", `var(${cssVariables.edgeColor})`);
  path.setAttribute("stroke-width", `${width}`);
  path.setAttribute("fill", "none");

  return path;
};
