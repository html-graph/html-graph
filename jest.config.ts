import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  coveragePathIgnorePatterns: ["/node_modules/", "/lib/.*\\.mock\\.ts$"],
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
