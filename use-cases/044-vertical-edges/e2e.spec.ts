import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display vertical edges", async ({ page }) => {
  await page.goto(`${e2eBase}/044-vertical-edges/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(760, 630);
  await page.mouse.down();
  await page.mouse.move(760, 200);

  await expect(page).toHaveScreenshot("flipped.png");
});
