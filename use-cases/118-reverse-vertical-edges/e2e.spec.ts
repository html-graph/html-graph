import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should have reverse vertical edges", async ({ page }) => {
  await page.goto(`${e2eBase}/118-reverse-vertical-edges/`);

  await expect(page).toHaveScreenshot("initial.png");
});
