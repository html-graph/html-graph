import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should be shiftable", async ({ page }) => {
  await page.goto(`${e2eBase}/030-shift-only-canvas/`);
  await expect(page).toHaveScreenshot("initial-shift.png");

  await page.mouse.move(400, 500);
  await page.mouse.down();
  await page.mouse.move(200, 200);

  await expect(page).toHaveScreenshot("after-shift.png");
});

test("should not be scalable", async ({ page }) => {
  await page.goto(`${e2eBase}/030-shift-only-canvas/`);
  await expect(page).toHaveScreenshot("initial-scale.png");

  await page.mouse.move(400, 500);
  await page.mouse.wheel(0, -3000);

  await expect(page).toHaveScreenshot("initial-scale.png");
});
