import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should apply custom edge for user connectable ports", async ({
  page,
}) => {
  await page.goto(`${e2eBase}/092-user-connectable-ports-custom-edge/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.move(250, 400);
  await page.mouse.down();
  await page.mouse.move(400, 450);

  await expect(page).toHaveScreenshot("edge-dragging.png");
});
