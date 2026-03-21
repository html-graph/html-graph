export const createMidpoint = (): SVGElement => {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

  group.style.setProperty("pointer-events", "auto");
  group.style.setProperty("cursor", "pointer");
  group.classList.add("remove-button");

  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );

  circle.setAttribute("cx", "0");
  circle.setAttribute("cy", "0");
  circle.setAttribute("r", "7");
  circle.setAttribute("fill", "var(--remove-background)");
  circle.setAttribute("stroke", "var(--remove-color)");

  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute("d", "M -3 -3 L 3 3");
  path1.setAttribute("stroke", "var(--remove-color)");

  const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path2.setAttribute("d", "M 3 -3 L -3 3");
  path2.setAttribute("stroke", "var(--remove-color)");

  group.appendChild(circle);
  group.appendChild(path1);
  group.appendChild(path2);

  return group;
};
