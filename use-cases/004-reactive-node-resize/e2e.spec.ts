import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should create edge reactive to nodes resize", async ({ page }) => {
  await page.goto(`${e2eBase}/004-reactive-node-resize/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.locator("#slider").fill("200");

  await expect(page).toHaveScreenshot("after-resize.png");
});
