import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should have scale limit", async ({ page }) => {
  await page.goto(`${e2eBase}/058-shift-and-scale-limit/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(400, 500);
  await page.mouse.wheel(0, -3000);
  await page.mouse.wheel(0, -3000);
  await page.mouse.wheel(0, -3000);

  await expect(page).toHaveScreenshot("after-scale.png");

  await page.mouse.wheel(0, -3000);

  await expect(page).toHaveScreenshot("after-scale.png");
});

test("should have left shift limits", async ({ page }) => {
  await page.goto(`${e2eBase}/058-shift-and-scale-limit/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(100, 500);
  await page.mouse.down();
  await page.mouse.move(1200, 500);

  await expect(page).toHaveScreenshot("after-move-right.png");
});

test("should have right shift limits", async ({ page }) => {
  await page.goto(`${e2eBase}/058-shift-and-scale-limit/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(1200, 500);
  await page.mouse.down();
  await page.mouse.move(100, 500);

  await expect(page).toHaveScreenshot("after-move-left.png");
});

test("should have bottom shift limits", async ({ page }) => {
  await page.goto(`${e2eBase}/058-shift-and-scale-limit/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(100, 699);
  await page.mouse.down();
  await page.mouse.move(100, 1);

  await expect(page).toHaveScreenshot("after-move-top.png");
});

test("should have top shift limits", async ({ page }) => {
  await page.goto(`${e2eBase}/058-shift-and-scale-limit/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(100, 1);
  await page.mouse.down();
  await page.mouse.move(100, 699);

  await expect(page).toHaveScreenshot("after-move-bottom.png");
});
