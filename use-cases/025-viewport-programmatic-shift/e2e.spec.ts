import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should handle viewport shift programmatically", async ({ page }) => {
  await page.goto(`${e2eBase}/025-viewport-programmatic-shift/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(200, 200);
  await page.mouse.down();
  await page.mouse.move(150, 150);

  await expect(page).toHaveScreenshot("after-mouse-scale.png");
});
