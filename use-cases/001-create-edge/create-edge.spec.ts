import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should create nodes and edges", async ({ page }) => {
  await page.goto(`${e2eBase}/001-create-edge/`);
  await expect(page).toHaveScreenshot("create-edge.png");
});
