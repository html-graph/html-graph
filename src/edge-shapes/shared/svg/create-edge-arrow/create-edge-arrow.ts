import { cssVariables } from "../css-variables";

export const createEdgeArrow = (): SVGPathElement => {
  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");

  arrow.setAttribute("fill", `var(${cssVariables.edgeColor})`);

  return arrow;
};
