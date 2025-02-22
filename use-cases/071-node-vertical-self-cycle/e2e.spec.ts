import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display hode vertical self cycle", async ({ page }) => {
  await page.goto(`${e2eBase}/071-node-vertical-self-cycle/`);
  await expect(page).toHaveScreenshot("initial.png");
});
