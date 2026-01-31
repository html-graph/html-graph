import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should apply linear transformation to layout", async ({ page }) => {
  await page.goto(`${e2eBase}/105-layout-linear-transform/`);

  await expect(page).toHaveScreenshot("initial.png");
});
