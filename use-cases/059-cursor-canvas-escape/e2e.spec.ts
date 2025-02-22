import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should handle cusror escape canvas", async ({ page }) => {
  await page.goto(`${e2eBase}/059-cursor-canvas-escape/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(400, 500);
  await page.mouse.down();
  await page.mouse.move(50, 500);

  await expect(page).toHaveScreenshot("after-escape.png");
});

test("should handle cusror escape window", async ({ page }) => {
  await page.goto(`${e2eBase}/059-cursor-canvas-escape/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(400, 500);
  await page.mouse.down();
  await page.mouse.move(400, 800);

  await expect(page).toHaveScreenshot("after-escape.png");
});
