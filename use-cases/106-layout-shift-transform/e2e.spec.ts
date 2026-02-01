import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should shift layout", async ({ page }) => {
  await page.goto(`${e2eBase}/106-layout-shift-transform/`);

  await expect(page).toHaveScreenshot("initial.png");
});
