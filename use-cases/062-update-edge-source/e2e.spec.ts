import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should update edge source", async ({ page }) => {
  await page.goto(`${e2eBase}/062-update-edge-source/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.locator("#update-source").click();

  await expect(page).toHaveScreenshot("after-update.png");

  await page.mouse.move(170, 280);
  await page.mouse.down();
  await page.mouse.move(500, 280);

  await expect(page).toHaveScreenshot("after-move.png");
});
