import { createConnectablePortsParams } from "./create-connectable-ports-params";
import { BezierEdgeShape, DirectEdgeShape } from "@/edges";
import {
  ConnectionPreprocessor,
  ConnectionTypeResolver,
} from "@/configurators";
import { EdgeShapeFactory } from "@/graph-controller";
import { defaults } from "./defaults";
import { noopFn } from "../shared";

describe("createUserConnectablePortsParams", () => {
  it("should return direct connection type resolver by default", () => {
    const options = createConnectablePortsParams(
      {},
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.connectionTypeResolver).toBe(
      defaults.connectionTypeResolver,
    );
  });

  it("should return specified connection type resolver", () => {
    const resolver: ConnectionTypeResolver = () => null;
    const options = createConnectablePortsParams(
      { connectionTypeResolver: resolver },
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.connectionTypeResolver).toBe(resolver);
  });

  it("should return default connection preprocessor", () => {
    const options = createConnectablePortsParams(
      {},
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.connectionPreprocessor).toBe(
      defaults.connectionPreprocessor,
    );
  });

  it("should return specified connection preprocessor", () => {
    const preprocessor: ConnectionPreprocessor = () => null;
    const options = createConnectablePortsParams(
      { connectionPreprocessor: preprocessor },
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.connectionPreprocessor).toBe(preprocessor);
  });

  it("should return default mouse down event verifier", () => {
    const options = createConnectablePortsParams(
      {},
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.mouseDownEventVerifier).toEqual(defaults.mouseEventVerifier);
  });

  it("should return specified mouse down event verifier", () => {
    const verifier: (event: MouseEvent) => boolean = () => false;
    const options = createConnectablePortsParams(
      { mouseDownEventVerifier: verifier },
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.mouseDownEventVerifier).toBe(verifier);
  });

  it("should return default mouse up event verifier", () => {
    const options = createConnectablePortsParams(
      {},
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.mouseUpEventVerifier).toEqual(defaults.mouseEventVerifier);
  });

  it("should return specified mouse up event verifier", () => {
    const verifier: (event: MouseEvent) => boolean = () => false;
    const options = createConnectablePortsParams(
      { mouseUpEventVerifier: verifier },
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.mouseUpEventVerifier).toBe(verifier);
  });

  it("should return default edge created callback", () => {
    const options = createConnectablePortsParams(
      {},
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.onAfterEdgeCreated).toBe(noopFn);
  });

  it("should return specified edge created callback", () => {
    const onEdgeCreated = (): void => {};

    const options = createConnectablePortsParams(
      {
        events: { onAfterEdgeCreated: onEdgeCreated },
      },
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.onAfterEdgeCreated).toBe(onEdgeCreated);
  });

  it("should return default drag port direction", () => {
    const options = createConnectablePortsParams(
      {},
      () => new BezierEdgeShape(),
      Math.PI,
    );

    expect(options.dragPortDirection).toBe(Math.PI);
  });

  it("should return specified drag port direction", () => {
    const options = createConnectablePortsParams(
      { dragPortDirection: Math.PI },
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.dragPortDirection).toBe(Math.PI);
  });

  it("should return default edge creation interrupted callback", () => {
    const options = createConnectablePortsParams(
      {},
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.onEdgeCreationInterrupted).toBe(noopFn);
  });

  it("should not throw error when calling default creation interrupted callback", () => {
    const options = createConnectablePortsParams(
      {},
      () => new BezierEdgeShape(),
      0,
    );

    expect(() => {
      options.onEdgeCreationInterrupted({
        isDirect: true,
        staticPortId: "port-1",
      });
    }).not.toThrow();
  });

  it("should return specified edge creation interrupted callback", () => {
    const onEdgeCreationInterrupted = (): void => {};

    const options = createConnectablePortsParams(
      { events: { onEdgeCreationInterrupted } },
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.onEdgeCreationInterrupted).toBe(onEdgeCreationInterrupted);
  });

  it("should return default edge creation prevented callback", () => {
    const options = createConnectablePortsParams(
      {},
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.onEdgeCreationPrevented).toBe(noopFn);
  });

  it("should not throw error when calling default creation prevented callback", () => {
    const options = createConnectablePortsParams(
      {},
      () => new BezierEdgeShape(),
      0,
    );

    expect(() => {
      options.onEdgeCreationPrevented({
        from: "port-1",
        to: "port-2",
      });
    }).not.toThrow();
  });

  it("should return specified edge creation interrupted callback", () => {
    const onEdgeCreationPrevented = (): void => {};

    const options = createConnectablePortsParams(
      { events: { onEdgeCreationPrevented } },
      () => new BezierEdgeShape(),
      0,
    );

    expect(options.onEdgeCreationPrevented).toBe(onEdgeCreationPrevented);
  });

  it("should return default edge shape factory", () => {
    const factory: EdgeShapeFactory = () => new BezierEdgeShape();
    const options = createConnectablePortsParams({}, factory, 0);

    expect(options.edgeShapeFactory).toBe(factory);
  });

  it("should return specified edge shape factory", () => {
    const factory: EdgeShapeFactory = () => new BezierEdgeShape();
    const connectionFactory: EdgeShapeFactory = () => new DirectEdgeShape();
    const options = createConnectablePortsParams(
      { edgeShape: connectionFactory },
      factory,
      0,
    );

    expect(options.edgeShapeFactory).toBe(connectionFactory);
  });

  it("should return default connection allowed verifier", () => {
    const factory: EdgeShapeFactory = () => new BezierEdgeShape();
    const options = createConnectablePortsParams({}, factory, 0);

    expect(options.connectionAllowedVerifier).toBe(
      defaults.connectionAllowedVerifier,
    );
  });

  it("should return specified connection allowed verifier", () => {
    const factory: EdgeShapeFactory = () => new BezierEdgeShape();
    const connectionAllowedVerifier = (): boolean => true;
    const options = createConnectablePortsParams(
      { connectionAllowedVerifier },
      factory,
      0,
    );

    expect(options.connectionAllowedVerifier).toBe(connectionAllowedVerifier);
  });
});
