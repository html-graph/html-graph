import type { Config } from "jest";
import { default as parentConfig } from "./jest.config";

const config: Config = {
  ...parentConfig,
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

export default config;
