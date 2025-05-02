export const createSvg = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svg.style.position = "absolute";
  svg.style.inset = "0";

  return svg;
};
