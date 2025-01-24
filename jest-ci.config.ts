import type { Config } from "jest";
import { default as parentConfig } from "./jest.config";

const config: Config = {
  ...parentConfig,
  collectCoverage: true,
};

export default config;
