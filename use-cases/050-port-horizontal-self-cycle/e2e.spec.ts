import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display horizontal port self cycle", async ({ page }) => {
  await page.goto(`${e2eBase}/050-port-horizontal-self-cycle/`);
  await expect(page).toHaveScreenshot("initial.png");
});
