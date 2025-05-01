export const createContent = (): SVGCircleElement => {
  const pattern = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );

  pattern.setAttribute("cx", "0");
  pattern.setAttribute("cy", "0");
  pattern.setAttribute("r", "1");
  pattern.setAttribute("fill", "#AAAAAA");

  return pattern;
};
