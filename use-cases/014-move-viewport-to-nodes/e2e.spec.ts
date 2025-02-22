import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should move viewport to nodes", async ({ page }) => {
  await page.goto(`${e2eBase}/014-move-viewport-to-nodes/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.locator("#navigate").click();

  await expect(page).toHaveScreenshot("after-navigate.png");
});
