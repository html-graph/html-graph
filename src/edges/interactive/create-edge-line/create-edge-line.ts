export const createEdgeLine = (width: number): SVGPathElement => {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
  line.setAttribute("stroke", "transparent");

  line.setAttribute("stroke-width", `${width}`);
  line.setAttribute("fill", "none");
  line.setAttribute("stroke-linecap", "round");

  line.setAttribute("stroke", "red");
  line.setAttribute("stroke-opacity", "0.5");

  return line;
};
