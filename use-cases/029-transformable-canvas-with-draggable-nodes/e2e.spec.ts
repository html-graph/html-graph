import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should have transformable canvas", async ({ page }) => {
  await page.goto(`${e2eBase}/029-transformable-canvas-with-draggable-nodes/`);
  await expect(page).toHaveScreenshot("initial-transform.png");

  await page.mouse.move(400, 500);
  await page.mouse.down();
  await page.mouse.move(200, 200);

  await expect(page).toHaveScreenshot("after-mouse-shift-transform.png");

  await page.mouse.wheel(0, -3000);

  await expect(page).toHaveScreenshot("after-mouse-scale-transform.png");
});

test("should have draggable nodes", async ({ page }) => {
  await page.goto(`${e2eBase}/027-draggable-nodes/`);
  await expect(page).toHaveScreenshot("initial-drag.png");

  await page.mouse.move(170, 390);
  await page.mouse.down();
  await page.mouse.move(500, 350);

  await expect(page).toHaveScreenshot("after-move-drag.png");
});
