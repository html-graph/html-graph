import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should limit focus comtent scale", async ({ page }) => {
  await page.goto(`${e2eBase}/113-viewport-navigation-scale-limit/`);

  await expect(page).toHaveScreenshot("initial.png");
});
