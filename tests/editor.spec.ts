import { expect, test } from "@playwright/test";

test.describe("Storyboard editor", () => {
  test("loads the editor workspace", async ({ page }) => {
    await page.goto("/editor");

    await expect(
      page.getByRole("heading", { name: "Storyboard workspace" }),
    ).toBeVisible();

    await expect(page.getByText("Prompt Composer")).toBeVisible();
    await expect(page.getByText("Session History")).toBeVisible();
    await expect(page.getByText("Hydrated")).toBeVisible();
  });

  test("persists prompt edits after refresh", async ({ page }) => {
    await page.goto("/editor");

    const prompt = page.locator("textarea").first();
    const updatedPrompt = "Playwright prompt persistence test";

    await prompt.fill(updatedPrompt);
    await page.waitForTimeout(800);
    await page.reload();

    await expect(prompt).toHaveValue(updatedPrompt);
  });

  test("edits and saves a section", async ({ page }) => {
    await page.goto("/editor");

    await page.getByRole("button", { name: "Edit Narrative Summary" }).click();

    const editor = page.getByRole("textbox", {
      name: "Editor for Narrative Summary",
    });
    await editor.fill("Playwright edited line 1\nPlaywright edited line 2");

    await page.getByRole("button", { name: "Save Narrative Summary" }).click();

    await expect(page.getByText("Playwright edited line 1")).toBeVisible();
    await expect(page.getByText("Playwright edited line 2")).toBeVisible();

    await page.waitForTimeout(800);
    await page.reload();

    await expect(page.getByText("Playwright edited line 1")).toBeVisible();
    await expect(page.getByText("Playwright edited line 2")).toBeVisible();
  });

  test("canceling a section edit does not persist changes", async ({
    page,
  }) => {
    await page.goto("/editor");

    await page.getByRole("button", { name: "Edit Narrative Summary" }).click();

    const editor = page.getByRole("textbox", {
      name: "Editor for Narrative Summary",
    });
    await editor.fill("This should be canceled");

    await page
      .getByRole("button", { name: "Cancel Narrative Summary" })
      .click();

    await expect(page.getByText("This should be canceled")).not.toBeVisible();
  });

  test("regenerates a section", async ({ page }) => {
    await page.goto("/editor");

    await page
      .getByRole("button", { name: "Regenerate Narrative Summary" })
      .click();

    await expect(
      page.getByText(
        "Storyboard AI converts rough product thinking into a polished narrative artifact designed for review, alignment, and presentation.",
      ),
    ).toBeVisible();
  });

  test("switches template and keeps it after refresh", async ({ page }) => {
    await page.goto("/editor");

    await page.getByRole("button", { name: /Product strategy/i }).click();

    await expect(page.getByLabel("Active template")).toHaveText(
      /product strategy/i,
    );

    await page.waitForTimeout(800);
    await page.reload();

    await expect(page.getByLabel("Active template")).toHaveText(
      /product strategy/i,
    );
  });

  test("generates storyboard content from the prompt", async ({ page }) => {
    await page.goto("/editor");

    const prompt = page.locator("textarea").first();
    await prompt.fill(
      "Create a cinematic storyboard for a football coaching assistant app for college teams.",
    );

    await page.getByRole("button", { name: /Generate storyboard/i }).click();

    await expect(
      page.getByRole("button", { name: /Generating/i }),
    ).toBeDisabled();

    await expect(
      page.getByText(/football coaching assistant app for college teams/i),
    ).toBeVisible();

    await page.waitForTimeout(800);
    await page.reload();

    await expect(
      page.getByText(/football coaching assistant app for college teams/i),
    ).toBeVisible();
  });

  test("generation reflects template context", async ({ page }) => {
    await page.goto("/editor");

    const prompt = page.locator("textarea").first();
    await prompt.fill(
      "Build a concise storyboard for an AI product launch narrative.",
    );

    await page.getByRole("button", { name: /Executive summary/i }).click();
    await expect(page.getByLabel("Active template")).toHaveText(
      /exec summary/i,
    );

    await page.getByRole("button", { name: /Generate storyboard/i }).click();

    await expect(page.getByText(/polished exec summary/i)).toBeVisible();
  });
});
