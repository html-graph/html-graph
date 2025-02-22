import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should handle viewport scale programmatically", async ({ page }) => {
  await page.goto(`${e2eBase}/024-viewport-programmatic-scale/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(200, 200);
  await page.mouse.wheel(0, 2000);

  await expect(page).toHaveScreenshot("after-mouse-scale.png");
});
