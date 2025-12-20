export class MyNode extends HTMLElement {
  private readonly shadowDom: ShadowRoot;

  private readonly frontPort: HTMLElement;

  private readonly backPort: HTMLElement;

  private readonly text: HTMLElement;

  private readonly styleContent = `
    :host {
      position: relative;
      width: 100px;
      height: 100px;
      background: var(--color-node-background);
      border: 1px solid var(--color-node-border);
      box-shadow: 0 0 5px var(--color-node-border);
      border-radius: 50%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
    }

    .node-port {
      position: relative;
    }

    .node-port-grab-area {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: -1rem;
      left: -1rem;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
    }

    .node-port-pin {
      --port-size: 5px;
      width: calc(2 * var(--port-size));
      height: calc(2 * var(--port-size));
      background: var(--color-edge);
      border-radius: calc(2 * var(--port-size));
    }
  `;

  public constructor() {
    super();

    this.shadowDom = this.attachShadow({ mode: "open" });

    this.frontPort = this.createPortElement();
    this.frontPort.dataset.frontPort = "";
    this.backPort = this.createPortElement();
    this.backPort.dataset.backPort = "";

    this.text = document.createElement("div");
    this.text.innerText = "Node 1";

    this.shadowDom.appendChild(this.frontPort);
    this.shadowDom.appendChild(this.text);
    this.shadowDom.appendChild(this.backPort);
    const style = document.createElement("style");
    style.innerHTML = this.styleContent;
    this.shadowDom.appendChild(style);
  }

  private createPortElement(): HTMLElement {
    const port = document.createElement("div");
    port.classList.add("node-port");

    const grabArea = document.createElement("div");
    grabArea.classList.add("node-port-grab-area");

    port.appendChild(grabArea);

    const pin = document.createElement("div");
    pin.classList.add("node-port-pin");

    grabArea.appendChild(pin);

    return port;
  }
}
