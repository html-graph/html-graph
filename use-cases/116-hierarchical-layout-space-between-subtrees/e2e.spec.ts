import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should have space between subtrees", async ({ page }) => {
  await page.goto(`${e2eBase}/116-hierarchical-layout-space-between-subtrees/`);

  await expect(page).toHaveScreenshot("initial.png");
});
