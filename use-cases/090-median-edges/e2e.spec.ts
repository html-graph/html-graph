import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should freeze node priority when dragging", async ({ page }) => {
  await page.goto(`${e2eBase}/090-median-edges/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(350, 150);

  await expect(page).toHaveScreenshot("after-hover.png");

  await page.mouse.down();
  await page.mouse.up();

  await expect(page).toHaveScreenshot("after-edge-removed.png");
});
