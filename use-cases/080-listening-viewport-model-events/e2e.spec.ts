import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should listen viewport events", async ({ page }) => {
  await page.goto(`${e2eBase}/080-listening-viewport-model-events/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(400, 500);
  await page.mouse.down();
  await page.mouse.move(200, 200);

  await expect(page).toHaveScreenshot("after-mouse-shift.png");
});
