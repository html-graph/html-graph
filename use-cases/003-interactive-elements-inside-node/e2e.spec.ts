import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should create canvas background", async ({ page }) => {
  await page.goto(`${e2eBase}/003-interactive-elements-inside-node/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(660, 385);
  await page.mouse.down();
  await page.mouse.up();

  await expect(page).toHaveScreenshot("after-click.png");

  await page.mouse.move(660, 385);
  await page.mouse.down();
  await page.mouse.move(670, 385);
  await page.mouse.up();

  await expect(page).toHaveScreenshot("after-move.png");
});
