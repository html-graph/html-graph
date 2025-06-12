export const createEdgeGroup = (): SVGGElement => {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

  group.style.transformOrigin = `50% 50%`;
  group.style.pointerEvents = "auto";

  return group;
};
