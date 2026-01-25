import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should have force-directed layout", async ({ page }) => {
  await page.goto(`${e2eBase}/101-force-directed-layout/`);

  await expect(page).toHaveScreenshot("initial.png");
});
