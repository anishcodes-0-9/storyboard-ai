import { expect, test } from "@playwright/test";

test.describe("Storyboard editor", () => {
  test("loads the editor workspace", async ({ page }) => {
    await page.goto("/editor");

    await expect(page).toHaveTitle(/Storyboard AI/i);
    await expect(page.getByText("Prompt Composer")).toBeVisible();
    await expect(page.getByText("Session History")).toBeVisible();
    await expect(page.getByText("Hydrated")).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 1, name: /new product launch/i }),
    ).toBeVisible();
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
      /Product Strategy/i,
    );

    await page.waitForTimeout(800);
    await page.reload();

    await expect(page.getByLabel("Active template")).toHaveText(
      /Product Strategy/i,
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
      /Executive Summary/i,
    );

    await page.getByRole("button", { name: /Generate storyboard/i }).click();

    await expect(page.getByText(/polished executive summary/i)).toBeVisible();
  });

  test("generated artifact title updates and persists after refresh", async ({
    page,
  }) => {
    await page.goto("/editor");

    const prompt = page.locator("textarea").first();
    await prompt.fill(
      "create a storyboard for a football recruiting platform for college coaches",
    );

    await page.getByRole("button", { name: /Generate storyboard/i }).click();

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /create a storyboard for a football recruiting/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByText(/Launch Brief generated from your latest prompt/i),
    ).toBeVisible();

    await page.waitForTimeout(800);
    await page.reload();

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /create a storyboard for a football recruiting/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByText(/Launch Brief generated from your latest prompt/i),
    ).toBeVisible();
  });
  test("saves and restores snapshots across refresh", async ({ page }) => {
    await page.goto("/editor");

    const prompt = page.locator("textarea").first();

    await prompt.fill("First snapshot prompt");
    await page.getByRole("button", { name: /Generate storyboard/i }).click();
    await page.getByRole("button", { name: /Save snapshot/i }).click();

    await expect(page.getByText("Snapshot 1", { exact: true })).toBeVisible();

    await prompt.fill("Second snapshot prompt");
    await page.getByRole("button", { name: /Generate storyboard/i }).click();
    await page.getByRole("button", { name: /Save snapshot/i }).click();

    await expect(page.getByText("Snapshot 2", { exact: true })).toBeVisible();

    const restoreButtons = page.getByRole("button", { name: /Restore/i });
    await restoreButtons.nth(1).click();

    await expect(prompt).toHaveValue("First snapshot prompt");

    await page.waitForTimeout(800);
    await page.reload();

    await expect(prompt).toHaveValue("First snapshot prompt");
    await expect(page.getByText("Snapshot 1", { exact: true })).toBeVisible();
    await expect(page.getByText("Snapshot 2", { exact: true })).toBeVisible();
  });
  test("saves an artifact to the library and reloads it", async ({ page }) => {
    await page.goto("/editor");

    const prompt = page.locator("textarea").first();
    await prompt.fill("Library artifact prompt");
    await page.getByRole("button", { name: /Generate storyboard/i }).click();

    await page.getByRole("button", { name: /Save to library/i }).click();

    await page.waitForTimeout(800);
    await page.goto("/library");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /return to previous storyboard drafts/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: /Open artifact/i }),
    ).toHaveCount(1);
    await page.getByRole("button", { name: /Open artifact/i }).click();

    await expect(page.locator("textarea").first()).toHaveValue(
      "Library artifact prompt",
    );

    await page.waitForTimeout(800);
    await page.reload();

    await page.goto("/library");
    await expect(
      page.getByRole("button", { name: /Open artifact/i }),
    ).toHaveCount(1);
  });
});
