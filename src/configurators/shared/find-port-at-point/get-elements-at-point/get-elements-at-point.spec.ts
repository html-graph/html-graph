import { createElement } from "@/mocks";
import { getElementsAtPoint } from "./get-elements-at-point";

class MyCustomElement extends HTMLElement {
  public constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
}

describe("getElementsAtPoint", () => {
  beforeAll(() => {
    customElements.define("my-custom-element", MyCustomElement);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should return empty array when no elements present", () => {
    const elements = getElementsAtPoint(document, { x: 50, y: 50 });

    expect(elements).toEqual([]);
  });

  it("should return single element when one element present", () => {
    const element = createElement({ x: 0, y: 0, width: 100, height: 100 });
    document.body.appendChild(element);

    const elements = getElementsAtPoint(document, { x: 50, y: 50 });

    expect(elements).toEqual([element]);
  });

  it("should return element inside shadow dom", () => {
    const element = createElement({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      tag: "my-custom-element",
    });

    document.body.appendChild(element);

    const insideShadowDomElement = createElement({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });

    element.shadowRoot!.appendChild(insideShadowDomElement);

    const elements = getElementsAtPoint(document, { x: 50, y: 50 });

    expect(elements).toEqual([insideShadowDomElement, element]);
  });
});
