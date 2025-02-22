import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should mark same element as ports", async ({ page }) => {
  await page.goto(`${e2eBase}/047-mark-same-port-element-twice/`);
  await expect(page).toHaveScreenshot("initial.png");
});
