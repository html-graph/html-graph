export {};

declare global {
  interface Window {
    triggerResizeFor(element: HTMLElement): void;
  }
}
