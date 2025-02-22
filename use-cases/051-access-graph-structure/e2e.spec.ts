import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should access graph model", async ({ page }) => {
  await page.goto(`${e2eBase}/051-access-graph-structure/`);
  await expect(page).toHaveScreenshot("initial.png");
});
