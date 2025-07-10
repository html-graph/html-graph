export const createEdgeGroup = (): SVGGElement => {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

  group.style.pointerEvents = "auto";
  group.style.cursor = "pointer";

  return group;
};
