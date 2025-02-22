import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should have transform left limit", async ({ page }) => {
  await page.goto(`${e2eBase}/038-custom-transform-preprocessor/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(200, 500);
  await page.mouse.down();
  await page.mouse.move(1200, 500);

  await expect(page).toHaveScreenshot("after-mouse-shift.png");
});
