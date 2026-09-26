import { cssVariables } from "../css-variables";

export const createEdgeSvg = (color: string): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svg.style.pointerEvents = "none";
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.overflow = "visible";
  svg.style.setProperty(cssVariables.edgeColor, color);

  return svg;
};
