import {
  BezierEdgeShape,
  EdgeShape,
  PortPayload,
} from "@html-graph/html-graph";

export class CustomEdgeShape implements EdgeShape {
  private controller = new BezierEdgeShape(
    "#5c5c5c",
    1,
    90,
    15,
    4,
    false,
    true,
  );

  public readonly svg = this.controller.svg;

  private readonly text = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text",
  );

  private readonly rect = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect",
  );

  private readonly radius = 5;

  public constructor(name: string) {
    this.text.textContent = name;

    this.rect.setAttribute("fill", "#fff");
    this.rect.setAttribute("stroke", "#5c5c5c");
    this.rect.setAttribute("rx", `${this.radius}`);
    this.text.setAttribute("dominant-baseline", "middle");
    this.text.setAttribute("text-anchor", "middle");
    this.text.setAttribute("font-size", "10px");
    this.svg.appendChild(this.rect);
    this.svg.appendChild(this.text);
  }

  public update(
    x: number,
    y: number,
    width: number,
    height: number,
    from: PortPayload,
    to: PortPayload,
  ): void {
    this.controller.update(x, y, width, height, from, to);

    const box = this.text.getBBox();

    this.rect.setAttribute("x", `${(width - box.width) / 2 - this.radius}`);
    this.rect.setAttribute("y", `${(height - box.height) / 2 - this.radius}`);
    this.rect.setAttribute("width", `${box.width + 2 * this.radius}`);
    this.rect.setAttribute("height", `${box.height + 2 * this.radius}`);

    this.text.setAttribute("x", `${width / 2}`);
    this.text.setAttribute("y", `${height / 2}`);
  }
}
