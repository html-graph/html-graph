import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display canvas with virtual scroll", async ({ page }) => {
  test.slow();
  await page.goto(`${e2eBase}/077-arc-arrows/`);

  await expect(page).toHaveScreenshot("initial.png");
});
