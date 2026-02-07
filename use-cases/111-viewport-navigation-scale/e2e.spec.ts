import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should scale viewport to fit all nodes", async ({ page }) => {
  await page.goto(`${e2eBase}/111-viewport-navigation-scale/`);

  await expect(page).toHaveScreenshot("initial.png");
});
