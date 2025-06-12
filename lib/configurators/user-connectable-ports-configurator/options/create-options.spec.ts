import { ConnectionPreprocessor } from "./connection-preprocessor";
import { ConnectionTypeResolver } from "./connection-type-resolver";
import { createOptions } from "./create-options";
import { defaultConnectionTypeResolver } from "./default-connectio-type-resolver";
import { defaultConnectionPreprocessor } from "./default-connection-preprocessor";
import { defaultMouseDownEventVerifier } from "./default-mouse-down-event-verifier";

describe("createOptions", () => {
  it("should return direct connection type resolver by default", () => {
    const options = createOptions({});

    expect(options.connectionTypeResolver).toBe(defaultConnectionTypeResolver);
  });

  it("should return specified connection type resolver", () => {
    const resolver: ConnectionTypeResolver = () => null;
    const options = createOptions({ connectionTypeResolver: resolver });

    expect(options.connectionTypeResolver).toBe(resolver);
  });

  it("should return idempotent connection preprocessor by default", () => {
    const options = createOptions({});

    expect(options.connectionPreprocessor).toBe(defaultConnectionPreprocessor);
  });

  it("should return specified connection preprocessor", () => {
    const preprocessor: ConnectionPreprocessor = () => null;
    const options = createOptions({ connectionPreprocessor: preprocessor });

    expect(options.connectionPreprocessor).toBe(preprocessor);
  });

  it("should return LMB mouse down event verifier by default", () => {
    const options = createOptions({});

    expect(options.mouseDownEventVerifier).toBe(defaultMouseDownEventVerifier);
  });

  it("should return specified mouse down event verifier", () => {
    const verifier: (event: MouseEvent) => boolean = () => false;
    const options = createOptions({ mouseDownEventVerifier: verifier });

    expect(options.mouseDownEventVerifier).toBe(verifier);
  });
});
