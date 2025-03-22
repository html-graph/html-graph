import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should have transformable canvas", async ({ page }) => {
  await page.goto(`${e2eBase}/028-transformable-viewport/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(400, 500);
  await page.mouse.down();
  await page.mouse.move(200, 200);

  await expect(page).toHaveScreenshot("after-mouse-shift.png");

  await page.mouse.wheel(0, -3000);

  await expect(page).toHaveScreenshot("after-mouse-scale.png");
});
