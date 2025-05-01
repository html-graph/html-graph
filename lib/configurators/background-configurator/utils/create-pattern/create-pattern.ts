export const createPattern = (): SVGPatternElement => {
  const pattern = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "pattern",
  );
  pattern.setAttribute("id", "pattern");
  pattern.setAttribute("x", "0");
  pattern.setAttribute("y", "0");

  return pattern;
};
