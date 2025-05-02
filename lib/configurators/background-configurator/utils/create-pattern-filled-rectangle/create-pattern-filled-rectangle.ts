export const createPatternFilledRectangle = (): SVGRectElement => {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

  rect.setAttribute("fill", "url(#pattern)");

  return rect;
};
