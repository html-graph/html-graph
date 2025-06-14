export const createContent = (
  radius: number,
  color: string,
): SVGCircleElement => {
  const content = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );

  content.setAttribute("cx", "0");
  content.setAttribute("cy", "0");
  content.setAttribute("r", `${radius}`);
  content.setAttribute("fill", `${color}`);

  return content;
};
