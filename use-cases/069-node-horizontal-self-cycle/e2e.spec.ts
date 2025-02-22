import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display node horizontal self cycle", async ({ page }) => {
  await page.goto(`${e2eBase}/069-node-horizontal-self-cycle/`);
  await expect(page).toHaveScreenshot("initial.png");
});
