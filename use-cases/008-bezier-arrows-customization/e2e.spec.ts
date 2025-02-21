import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should custom bezier edge", async ({ page }) => {
  await page.goto(`${e2eBase}/008-bezier-arrows-customization/`);
  await expect(page).toHaveScreenshot("initial.png");
});
