import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should create custom background", async ({ page }) => {
  await page.goto(`${e2eBase}/082-user-connectable-ports/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(250, 400);
  await page.mouse.down();
  await page.mouse.move(450, 500);
  await page.mouse.up();

  await expect(page).toHaveScreenshot("after-edge-added.png");

  await page.mouse.move(650, 200);
  await page.mouse.down();
  await page.mouse.move(550, 500);
  await expect(page).toHaveScreenshot("after-direct-edge-added.png");
  await page.mouse.up();

  await expect(page).toHaveScreenshot("after-reverse-edge-added.png");

  await page.mouse.move(750, 200);
  await page.mouse.down();

  await expect(page).toHaveScreenshot("after-cycle-edge-hover.png");

  await page.mouse.up();

  await expect(page).toHaveScreenshot("after-reverse-edge-added.png");
});
