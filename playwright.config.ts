import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./use-cases",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm install && npm run start",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
  },
});
