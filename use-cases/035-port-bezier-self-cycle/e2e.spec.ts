import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display bezier port self cycle", async ({ page }) => {
  await page.goto(`${e2eBase}/035-port-bezier-self-cycle/`);
  await expect(page).toHaveScreenshot("initial.png");
});
