export class PortsCollection {
  private readonly portsMap = new Map<HTMLElement, unknown>();

  public addPort(element: HTMLElement, portId: unknown): void {
    this.portsMap.set(element, portId);
  }

  public getFirstPortId(element: HTMLElement): unknown | undefined {
    return this.portsMap.get(element);
  }

  public deletePort(element: HTMLElement): void {
    this.portsMap.delete(element);
  }

  public clear(): void {
    this.portsMap.clear();
  }
}
