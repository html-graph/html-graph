import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should create custom background", async ({ page }) => {
  await page.goto(`${e2eBase}/081-custom-background/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.down();
  await page.mouse.move(210, 210);

  await expect(page).toHaveScreenshot("after-mouse-shift.png");
});
