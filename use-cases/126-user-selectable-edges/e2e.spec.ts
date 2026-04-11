import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should have selectable edges", async ({ page }) => {
  await page.goto(`${e2eBase}/126-user-selectable-edges/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(350, 450);
  await page.mouse.down();
  await page.mouse.up();

  await expect(page).toHaveScreenshot("after-selection.png");
});
