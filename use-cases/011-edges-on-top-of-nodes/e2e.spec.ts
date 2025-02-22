import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should have edge on top of node", async ({ page }) => {
  await page.goto(`${e2eBase}/011-edges-on-top-of-nodes/`);
  await expect(page).toHaveScreenshot("initial.png");
});
