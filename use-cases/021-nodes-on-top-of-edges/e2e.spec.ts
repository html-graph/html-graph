import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should have nodes on top of edges", async ({ page }) => {
  await page.goto(`${e2eBase}/021-nodes-on-top-of-edges/`);
  await expect(page).toHaveScreenshot("initial.png");
});
