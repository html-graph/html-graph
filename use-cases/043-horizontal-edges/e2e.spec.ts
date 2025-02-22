import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display horizontal edges", async ({ page }) => {
  await page.goto(`${e2eBase}/043-horizontal-edges/`);
  await expect(page).toHaveScreenshot("initial.png");
});
