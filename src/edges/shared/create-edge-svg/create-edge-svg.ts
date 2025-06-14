export const createEdgeSvg = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svg.style.pointerEvents = "none";
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.overflow = "visible";

  return svg;
};
