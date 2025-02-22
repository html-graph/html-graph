import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display straight port self cycle", async ({ page }) => {
  await page.goto(`${e2eBase}/039-port-straight-self-cycle/`);
  await expect(page).toHaveScreenshot("initial.png");
});
