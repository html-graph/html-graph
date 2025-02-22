import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should have transformable canvas", async ({ page }) => {
  await page.goto(`${e2eBase}/020-advanced-demo/`);
  await expect(page).toHaveScreenshot("initial-transform.png");

  await page.mouse.move(200, 200);
  await page.mouse.down();
  await page.mouse.move(395, 395);

  await expect(page).toHaveScreenshot("after-mouse-move-transform.png");

  await page.mouse.wheel(0, 1000);

  await expect(page).toHaveScreenshot("after-mouse-scale-transform.png");
});

test("should have draggable nodes", async ({ page }) => {
  await page.goto(`${e2eBase}/020-advanced-demo/`);
  await expect(page).toHaveScreenshot("initial-node-drag.png");

  await page.mouse.move(201, 401);
  await page.mouse.down();
  await page.mouse.move(250, 450);

  await expect(page).toHaveScreenshot("after-mouse-move-node-drag.png");
});

test("should have resize reactive nodes", async ({ page }) => {
  await page.goto(`${e2eBase}/020-advanced-demo/`);
  await expect(page).toHaveScreenshot("initial-node-resize.png");

  await page.mouse.move(825, 680);
  await page.mouse.down();
  await page.mouse.move(825, 700);

  await expect(page).toHaveScreenshot("after-mouse-move-node-resize.png");
});
