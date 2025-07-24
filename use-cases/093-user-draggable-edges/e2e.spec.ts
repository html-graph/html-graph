import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should create custom background", async ({ page }) => {
  await page.goto(`${e2eBase}/093-user-draggable-edges/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(450, 500);
  await page.mouse.down();
  await page.mouse.move(650, 200);

  await expect(page).toHaveScreenshot("after-edge-dragged.png");
});
