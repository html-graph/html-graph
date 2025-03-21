export const createEdgeLine = (
  color: string,
  width: number,
): SVGPathElement => {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
  line.setAttribute("stroke", color);
  line.setAttribute("stroke-width", `${width}`);
  line.setAttribute("fill", "none");

  return line;
};
