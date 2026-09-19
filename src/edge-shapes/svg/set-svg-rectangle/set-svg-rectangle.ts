export const setSvgRectangle = (
  svg: SVGSVGElement,
  params: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  },
): void => {
  svg.style.transform = `translate(${params.x}px, ${params.y}px)`;
  svg.style.width = `${params.width}px`;
  svg.style.height = `${params.height}px`;
};
