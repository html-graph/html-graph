import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should create off center node", async ({ page }) => {
  await page.goto(`${e2eBase}/006-off-center-nodes/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.locator("#top-left").click();

  await expect(page).toHaveScreenshot("top-left.png");

  await page.locator("#bottom-right").click();

  await expect(page).toHaveScreenshot("bottom-right.png");
});
