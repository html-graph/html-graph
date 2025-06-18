import { ConnectionPreprocessor } from "./connection-preprocessor";
import { ConnectionTypeResolver } from "./connection-type-resolver";
import { createConfig } from "./create-config";
import { defaultConnectionTypeResolver } from "./default-connectio-type-resolver";
import { defaultConnectionPreprocessor } from "./default-connection-preprocessor";
import { defaultMouseDownEventVerifier } from "./default-mouse-down-event-verifier";
import { defaultMouseUpEventVerifier } from "./default-mouse-up-event-verifier";
import { defaultOnAfterEdgeCreated } from "./default-on-after-edge-created";

describe("createOptions", () => {
  it("should return direct connection type resolver by default", () => {
    const options = createConfig({});

    expect(options.connectionTypeResolver).toBe(defaultConnectionTypeResolver);
  });

  it("should return specified connection type resolver", () => {
    const resolver: ConnectionTypeResolver = () => null;
    const options = createConfig({ connectionTypeResolver: resolver });

    expect(options.connectionTypeResolver).toBe(resolver);
  });

  it("should return idempotent connection preprocessor by default", () => {
    const options = createConfig({});

    expect(options.connectionPreprocessor).toBe(defaultConnectionPreprocessor);
  });

  it("should return specified connection preprocessor", () => {
    const preprocessor: ConnectionPreprocessor = () => null;
    const options = createConfig({ connectionPreprocessor: preprocessor });

    expect(options.connectionPreprocessor).toBe(preprocessor);
  });

  it("should return LMB mouse down event verifier by default", () => {
    const options = createConfig({});

    expect(options.mouseDownEventVerifier).toBe(defaultMouseDownEventVerifier);
  });

  it("should return specified mouse down event verifier", () => {
    const verifier: (event: MouseEvent) => boolean = () => false;
    const options = createConfig({ mouseDownEventVerifier: verifier });

    expect(options.mouseDownEventVerifier).toBe(verifier);
  });

  it("should return LMB mouse up event verifier by default", () => {
    const options = createConfig({});

    expect(options.mouseUpEventVerifier).toBe(defaultMouseUpEventVerifier);
  });

  it("should return specified mouse up event verifier", () => {
    const verifier: (event: MouseEvent) => boolean = () => false;
    const options = createConfig({ mouseUpEventVerifier: verifier });

    expect(options.mouseUpEventVerifier).toBe(verifier);
  });

  it("should return default edge created callback", () => {
    const options = createConfig({});

    expect(options.onAfterEdgeCreated).toBe(defaultOnAfterEdgeCreated);
  });

  it("should return specified edge created callback", () => {
    const onEdgeCreated = (): void => {};

    const options = createConfig({
      events: { onAfterEdgeCreated: onEdgeCreated },
    });

    expect(options.onAfterEdgeCreated).toBe(onEdgeCreated);
  });
});
