import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const exportElementToPdf = vi.fn();

vi.mock("../../lib/export-pdf", () => ({
  exportElementToPdf: (...args: unknown[]) => exportElementToPdf(...args),
}));

import { StoryboardCanvas } from "./storyboard-canvas";
import { useStoryboardStore } from "../../store/use-storyboard-store";

describe("StoryboardCanvas actions", () => {
  beforeEach(() => {
    exportElementToPdf.mockReset();

    Object.defineProperty(window.navigator, "clipboard", {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      configurable: true,
    });

    useStoryboardStore.setState({
      prompt: "Create a launch-ready storyboard",
      activeTemplate: "launch-brief",
      lastSavedLabel: "Saved just now",
      sections: [
        {
          id: "summary",
          title: "Narrative Summary",
          kind: "summary",
          status: "ai",
          tone: "Confident",
          content: ["A polished artifact summary."],
        },
      ],
      artifactTitle: "Launch Artifact",
      artifactSubtitle: "Launch Brief generated from your latest prompt",
      snapshots: [],
      hydrated: true,
      isGenerating: false,
    });
  });

  it("calls export helper and shows exporting state", async () => {
    const user = userEvent.setup();

    exportElementToPdf.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 50)),
    );

    render(<StoryboardCanvas />);

    const button = screen.getByRole("button", { name: /export pdf/i });
    await user.click(button);

    expect(exportElementToPdf).toHaveBeenCalledTimes(1);
    expect(exportElementToPdf.mock.calls[0][1]).toBe("Launch Artifact");

    expect(screen.getByRole("button", { name: /exporting/i })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /export pdf/i })).toBeEnabled();
    });
  });

  it("copies markdown output to the clipboard", async () => {
    const user = userEvent.setup();

    render(<StoryboardCanvas />);

    const clipboardSpy = vi.spyOn(window.navigator.clipboard, "writeText");

    await user.click(screen.getByRole("button", { name: /copy output/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /copied markdown/i }),
      ).toBeVisible();
    });

    expect(clipboardSpy).toHaveBeenCalledTimes(1);
    expect(clipboardSpy.mock.calls[0][0]).toContain("# Launch Artifact");
    expect(clipboardSpy.mock.calls[0][0]).toContain(
      "> Launch Brief generated from your latest prompt",
    );
    expect(clipboardSpy.mock.calls[0][0]).toContain("## Narrative Summary");
    expect(clipboardSpy.mock.calls[0][0]).toContain(
      "- A polished artifact summary.",
    );
  });
});
