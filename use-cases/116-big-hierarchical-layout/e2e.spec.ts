import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should have hierarchical layout", async ({ page }) => {
  await page.goto(`${e2eBase}/104-hierarchical-layout/`);

  await expect(page).toHaveScreenshot("initial.png");
});
