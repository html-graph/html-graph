const observers: Array<[HTMLElement, ResizeObserverMock]> = [];

class ResizeObserverMock implements ResizeObserver {
  private readonly elements = new Set<HTMLElement>();

  public constructor(private readonly callback: ResizeObserverCallback) {}

  public disconnect(): void {
    this.elements.clear();
  }

  public observe(element: HTMLElement): void {
    this.elements.add(element);
    observers.push([element, this]);

    this.triggerResizeFor(element);
  }

  public unobserve(element: HTMLElement): void {
    this.elements.delete(element);
    observers.forEach((e, index) => {
      if (e[0] === element) {
        observers.splice(index, 1);
      }
    });
  }

  public triggerResizeFor(element: HTMLElement): void {
    if (this.elements.has(element)) {
      this.callback(
        [
          {
            borderBoxSize: [],
            contentBoxSize: [],
            contentRect: element.getBoundingClientRect(),
            devicePixelContentBoxSize: [],
            target: element,
          },
        ],
        this,
      );
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).triggerResizeFor = (element: HTMLElement): void => {
  const obs = observers.filter((e) => e[0] === element);

  obs.forEach((e) => {
    e[1].triggerResizeFor(e[0]);
  });
};

global.ResizeObserver = ResizeObserverMock;

global.DOMRect = class {
  public bottom: number = 0;

  public left: number = 0;

  public right: number = 0;

  public top: number = 0;

  public constructor(
    public x: number = 0,
    public y: number = 0,
    public width: number = 0,
    public height: number = 0,
  ) {
    this.left = x;
    this.top = y;
    this.right = x + width;
    this.bottom = y + height;
  }

  public static fromRect(other?: DOMRectInit): DOMRect {
    return new DOMRect(other?.x, other?.y, other?.width, other?.height);
  }

  public toJSON(): string {
    return JSON.stringify(this);
  }
};

const processElement = (element: Element, x: number, y: number): Element[] => {
  let res: Element[] = [];
  const rect = element.getBoundingClientRect();

  if (
    rect.x <= x &&
    rect.x + rect.width >= x &&
    rect.y <= y &&
    rect.y + rect.height >= y
  ) {
    res.push(element);
  }

  for (const child of element.children) {
    res = [...res, ...processElement(child, x, y)];
  }

  return res;
};

document.elementsFromPoint = (x: number, y: number): Element[] => {
  let res: Element[] = [];

  for (const element of window.document.children) {
    res = [...res, ...processElement(element, x, y)];
  }

  return res;
};
