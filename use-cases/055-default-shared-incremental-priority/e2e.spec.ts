import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display shared incremental priority", async ({ page }) => {
  await page.goto(`${e2eBase}/055-default-shared-incremental-priority/`);
  await expect(page).toHaveScreenshot("initial.png");
});
