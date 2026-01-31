import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should rotate layout", async ({ page }) => {
  await page.goto(`${e2eBase}/108-layout-rotate-transform/`);

  await expect(page).toHaveScreenshot("initial.png");
});
