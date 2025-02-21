import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should create interactive button inside node", async ({ page }) => {
  await page.goto(`${e2eBase}/002-canvas-background/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(200, 200);
  await page.mouse.down();
  await page.mouse.move(395, 395);

  await expect(page).toHaveScreenshot("after-mouse-move.png");

  await page.mouse.wheel(0, 1000);

  await expect(page).toHaveScreenshot("after-mouse-scale.png");
});
