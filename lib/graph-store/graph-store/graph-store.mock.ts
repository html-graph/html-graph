import { EdgePayload } from "./edge-payload";
import { NodePayload } from "./node-payload";
import { PortPayload } from "./port-payload";

export class GraphStoreMock {
  public addNode(): void {
    // mock method intended to be dummy
  }

  public getAllNodeIds(): readonly unknown[] {
    return [];
  }

  public getNode(): NodePayload | undefined {
    return undefined;
  }

  public removeNode(): void {
    // mock method intended to be dummy
  }

  public addPort(): void {
    // mock method intended to be dummy
  }

  public getPort(): PortPayload | undefined {
    return undefined;
  }

  public getAllPortIds(): readonly unknown[] {
    return [];
  }

  public getNodePortIds(): readonly unknown[] | undefined {
    return undefined;
  }

  public getPortNodeId(): unknown | undefined {
    return undefined;
  }

  public removePort(): void {
    // mock method intended to be dummy
  }

  public addEdge(): void {
    // mock method intended to be dummy
  }

  public getAllEdgeIds(): readonly unknown[] {
    return [];
  }

  public getEdge(): EdgePayload | undefined {
    return undefined;
  }

  public removeEdge(): void {
    // mock method intended to be dummy
  }

  public clear(): void {
    // mock method intended to be dummy
  }

  public getPortIncomingEdgeIds(): readonly unknown[] {
    return [];
  }

  public getPortOutcomingEdgeIds(): readonly unknown[] {
    return [];
  }

  public getPortCycleEdgeIds(): readonly unknown[] {
    return [];
  }

  public getPortAdjacentEdgeIds(): readonly unknown[] {
    return [];
  }

  public getNodeIncomingEdgeIds(): readonly unknown[] {
    return [];
  }

  public getNodeOutcomingEdgeIds(): readonly unknown[] {
    return [];
  }

  public getNodeCycleEdgeIds(): readonly unknown[] {
    return [];
  }

  public getNodeAdjacentEdgeIds(): readonly unknown[] {
    return [];
  }
}
