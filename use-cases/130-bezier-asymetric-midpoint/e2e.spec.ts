import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should place midpoint correctly", async ({ page }) => {
  await page.goto(`${e2eBase}/130-bezier-asymetric-midpoint/`);
  await expect(page).toHaveScreenshot("initial.png");
});
