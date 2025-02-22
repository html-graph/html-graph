import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display port vertical self cycle", async ({ page }) => {
  await page.goto(`${e2eBase}/070-port-vertical-self-cycle/`);
  await expect(page).toHaveScreenshot("initial.png");
});
