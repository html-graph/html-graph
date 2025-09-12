import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should apply custom layout", async ({ page }) => {
  test.slow();
  await page.goto(`${e2eBase}/099-custom-layout/`);

  await expect(page).toHaveScreenshot("initial.png");
});
