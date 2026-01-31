import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should scale layout", async ({ page }) => {
  await page.goto(`${e2eBase}/107-layout-scale-transform/`);

  await expect(page).toHaveScreenshot("initial.png");
});
