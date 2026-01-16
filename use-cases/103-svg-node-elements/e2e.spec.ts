import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should have svg nodes", async ({ page }) => {
  await page.goto(`${e2eBase}/103-svg-node-elements/`);

  await expect(page).toHaveScreenshot("initial.png");
});
