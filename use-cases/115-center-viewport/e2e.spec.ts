import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should center viewport", async ({ page }) => {
  await page.goto(`${e2eBase}/115-center-viewport/`);

  await expect(page).toHaveScreenshot("initial.png");
});
