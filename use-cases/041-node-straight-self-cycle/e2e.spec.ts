import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should display straight node self cycle", async ({ page }) => {
  await page.goto(`${e2eBase}/041-node-straight-self-cycle/`);
  await expect(page).toHaveScreenshot("initial.png");
});
