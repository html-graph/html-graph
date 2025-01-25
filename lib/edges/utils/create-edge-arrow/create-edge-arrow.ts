export const createEdgeArrow = (color: string): SVGPathElement => {
  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");

  arrow.setAttribute("fill", color);

  return arrow;
};
