import { test, expect } from "@playwright/test";

test("should create nodes and edges", async ({ page }) => {
  await page.goto("http://localhost:3100/use-cases/001-create-edge/");
  await expect(page).toHaveScreenshot();
});
