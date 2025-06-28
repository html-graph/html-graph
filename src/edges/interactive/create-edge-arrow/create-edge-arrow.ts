export const createEdgeArrow = (width: number): SVGPathElement => {
  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");

  arrow.setAttribute("stroke-linejoin", "round");
  arrow.setAttribute("stroke-width", `${width}`);
  arrow.setAttribute("fill", "transparent");

  arrow.setAttribute("stroke", "red");
  arrow.setAttribute("stroke-opacity", "0.5");

  return arrow;
};
