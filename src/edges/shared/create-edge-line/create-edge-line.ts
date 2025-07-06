import { cssVariables } from "../css-variables";

export const createEdgeLine = (width: number): SVGPathElement => {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "path");

  line.setAttribute("stroke", `var(${cssVariables.edgeColor})`);
  line.setAttribute("stroke-width", `${width}`);
  line.setAttribute("fill", "none");

  return line;
};
