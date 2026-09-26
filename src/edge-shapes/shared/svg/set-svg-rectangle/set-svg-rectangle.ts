import { EdgeBox } from "../../edge-box";

export const setSvgRectangle = (svg: SVGSVGElement, box: EdgeBox): void => {
  svg.style.transform = `translate(${box.x}px, ${box.y}px)`;
  svg.style.width = `${box.width}px`;
  svg.style.height = `${box.height}px`;
};
