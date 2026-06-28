import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    include: ["./src/**/*.spec.ts"],
    environment: "jsdom",
    setupFiles: "./setup-jest.ts",
    coverage: {
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
      exclude: ["src/**/*.mock.ts", "src/**/index.ts"],
    },
  },
});
