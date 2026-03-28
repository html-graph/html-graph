import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should have selectable nodes", async ({ page }) => {
  await page.goto(`${e2eBase}/123-user-selectable-nodes/`);

  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(170, 390);
  await page.mouse.down();
  await page.mouse.up();

  await expect(page).toHaveScreenshot("node-selected.png");

  await page.mouse.move(500, 500);
  await page.mouse.down();
  await page.mouse.move(510, 510);
  await page.mouse.up();

  await expect(page).toHaveScreenshot("node-dragged.png");

  await page.mouse.move(700, 700);
  await page.mouse.down();
  await page.mouse.up();

  await expect(page).toHaveScreenshot("deselected-nodes.png");
});
