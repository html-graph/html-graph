import { test, expect } from "@playwright/test";
import { e2eBase } from "../shared/e2e-base";

test("should render connection with specified dragging port direction", async ({
  page,
}) => {
  await page.goto(`${e2eBase}/086-interactive-edges/`);
  await expect(page).toHaveScreenshot("initial.png");

  await page.mouse.click(260, 403);

  await expect(page).toHaveScreenshot("after-edge-clicked.png");
});
