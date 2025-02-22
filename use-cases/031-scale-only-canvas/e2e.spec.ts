import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should not be scalable", async ({ page }) => {
  await page.goto(`${e2eBase}/031-scale-only-canvas/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(400, 500);
  await page.mouse.wheel(0, -3000);

  await expect(page).toHaveScreenshot("after-scale.png");
});

test("should not be shiftable", async ({ page }) => {
  await page.goto(`${e2eBase}/031-scale-only-canvas/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(400, 500);
  await page.mouse.down();
  await page.mouse.move(200, 200);

  await expect(page).toHaveScreenshot("initial.png");
});
