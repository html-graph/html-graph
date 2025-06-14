export const createPattern = (): SVGPatternElement => {
  const pattern = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "pattern",
  );
  pattern.setAttribute("id", "pattern");

  return pattern;
};
