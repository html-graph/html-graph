import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should update edge target", async ({ page }) => {
  await page.goto(`${e2eBase}/072-update-edge-target/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.locator("#update-target").click();

  await expect(page).toHaveScreenshot("after-update.png");

  await page.mouse.move(470, 670);
  await page.mouse.down();
  await page.mouse.move(700, 670);

  await expect(page).toHaveScreenshot("after-move.png");
});
