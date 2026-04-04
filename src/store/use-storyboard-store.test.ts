import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useStoryboardStore } from "./use-storyboard-store";

describe("useStoryboardStore snapshots and artifacts", () => {
  beforeEach(() => {
    vi.useFakeTimers();

    useStoryboardStore.setState({
      prompt: "Initial prompt",
      activeTemplate: "launch-brief",
      lastSavedLabel: "Saved just now",
      sections: [
        {
          id: "summary",
          title: "Narrative Summary",
          kind: "summary",
          status: "ai",
          tone: "Confident",
          content: ["Initial summary"],
        },
      ],
      artifactTitle: "Initial Artifact",
      artifactSubtitle: "Launch Brief generated from your latest prompt",
      snapshots: [],
      artifacts: [],
      activeArtifactId: null,
      hydrated: true,
      isGenerating: false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("saves and restores snapshots", () => {
    const firstNow = new Date("2026-04-04T01:30:00.000Z");
    vi.setSystemTime(firstNow);

    useStoryboardStore.getState().saveSnapshot();

    expect(useStoryboardStore.getState().snapshots).toHaveLength(1);
    expect(useStoryboardStore.getState().snapshots[0].artifactTitle).toBe(
      "Initial Artifact",
    );

    useStoryboardStore.setState({
      prompt: "Changed prompt",
      artifactTitle: "Changed Artifact",
      artifactSubtitle: "Executive Summary generated from your latest prompt",
      activeTemplate: "exec-summary",
      sections: [
        {
          id: "summary",
          title: "Narrative Summary",
          kind: "summary",
          status: "edited",
          tone: "Confident",
          content: ["Changed summary"],
        },
      ],
    });

    const secondNow = new Date("2026-04-04T01:31:00.000Z");
    vi.setSystemTime(secondNow);

    useStoryboardStore.getState().saveSnapshot();

    expect(useStoryboardStore.getState().snapshots).toHaveLength(2);
    expect(useStoryboardStore.getState().snapshots[0].artifactTitle).toBe(
      "Changed Artifact",
    );

    const firstSnapshotId = useStoryboardStore.getState().snapshots[1].id;
    useStoryboardStore.getState().restoreSnapshot(firstSnapshotId);

    const restored = useStoryboardStore.getState();
    expect(restored.prompt).toBe("Initial prompt");
    expect(restored.artifactTitle).toBe("Initial Artifact");
    expect(restored.activeTemplate).toBe("launch-brief");
    expect(restored.sections[0].content).toEqual(["Initial summary"]);
  });

  it("deletes only the selected snapshot", () => {
    vi.setSystemTime(new Date("2026-04-04T01:30:00.000Z"));
    useStoryboardStore.getState().saveSnapshot();

    useStoryboardStore.setState({
      prompt: "Second prompt",
      artifactTitle: "Second Artifact",
      sections: [
        {
          id: "summary",
          title: "Narrative Summary",
          kind: "summary",
          status: "edited",
          tone: "Confident",
          content: ["Second summary"],
        },
      ],
    });

    vi.setSystemTime(new Date("2026-04-04T01:31:00.000Z"));
    useStoryboardStore.getState().saveSnapshot();

    const snapshotsBeforeDelete = useStoryboardStore.getState().snapshots;
    expect(snapshotsBeforeDelete).toHaveLength(2);

    const olderSnapshotId = snapshotsBeforeDelete[1].id;
    useStoryboardStore.getState().deleteSnapshot(olderSnapshotId);

    const snapshotsAfterDelete = useStoryboardStore.getState().snapshots;
    expect(snapshotsAfterDelete).toHaveLength(1);
    expect(snapshotsAfterDelete[0].artifactTitle).toBe("Second Artifact");
    expect(snapshotsAfterDelete[0].id).not.toBe(olderSnapshotId);
  });

  it("saves and loads artifacts", () => {
    const firstNow = new Date("2026-04-04T02:00:00.000Z");
    vi.setSystemTime(firstNow);

    useStoryboardStore.getState().saveArtifact();

    expect(useStoryboardStore.getState().artifacts).toHaveLength(1);
    expect(useStoryboardStore.getState().artifacts[0].title).toBe(
      "Initial Artifact",
    );

    const firstArtifactId = useStoryboardStore.getState().artifacts[0].id;

    useStoryboardStore.setState({
      prompt: "Another prompt",
      artifactTitle: "Another Artifact",
      artifactSubtitle: "Executive Summary generated from your latest prompt",
      activeTemplate: "exec-summary",
      sections: [
        {
          id: "summary",
          title: "Narrative Summary",
          kind: "summary",
          status: "edited",
          tone: "Confident",
          content: ["Another summary"],
        },
      ],
    });

    useStoryboardStore.getState().loadArtifact(firstArtifactId);

    const restored = useStoryboardStore.getState();
    expect(restored.prompt).toBe("Initial prompt");
    expect(restored.artifactTitle).toBe("Initial Artifact");
    expect(restored.activeTemplate).toBe("launch-brief");
    expect(restored.sections[0].content).toEqual(["Initial summary"]);
    expect(restored.activeArtifactId).toBe(firstArtifactId);
  });

  it("deletes an artifact and clears activeArtifactId if it was active", () => {
    useStoryboardStore.getState().saveArtifact();

    const artifactId = useStoryboardStore.getState().artifacts[0].id;

    useStoryboardStore.setState({
      activeArtifactId: artifactId,
    });

    useStoryboardStore.getState().deleteArtifact(artifactId);

    const state = useStoryboardStore.getState();
    expect(state.artifacts).toHaveLength(0);
    expect(state.activeArtifactId).toBeNull();
    expect(state.lastSavedLabel).toContain("Artifact deleted from library");
  });

  it("saves artifact as a new entry", () => {
    useStoryboardStore.getState().saveArtifact();

    const originalArtifactId = useStoryboardStore.getState().artifacts[0].id;

    useStoryboardStore.setState({
      prompt: "Variant prompt",
      artifactTitle: "Variant Artifact",
      artifactSubtitle: "Launch Brief generated from your latest prompt",
      sections: [
        {
          id: "summary",
          title: "Narrative Summary",
          kind: "summary",
          status: "edited",
          tone: "Confident",
          content: ["Variant summary"],
        },
      ],
    });

    useStoryboardStore.getState().saveArtifactAsNew();

    const state = useStoryboardStore.getState();
    expect(state.artifacts).toHaveLength(2);
    expect(state.artifacts[0].title).toBe("Variant Artifact");
    expect(state.artifacts[1].title).toBe("Initial Artifact");
    expect(state.artifacts[0].id).not.toBe(originalArtifactId);
    expect(state.activeArtifactId).toBe(state.artifacts[0].id);
  });

  it("generates storyboard from the API response", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        artifactTitle: "API Generated Artifact",
        artifactSubtitle: "Launch Brief generated from your latest prompt",
        sections: [
          {
            id: "summary",
            title: "Narrative Summary",
            kind: "summary",
            tone: "Confident",
            status: "ai",
            content: ["API summary 1", "API summary 2"],
          },
          {
            id: "pillars",
            title: "Strategic Pillars",
            kind: "bullets",
            tone: "Sharp",
            status: "ai",
            content: ["API pillar 1", "API pillar 2"],
          },
          {
            id: "roadmap",
            title: "Milestone Roadmap",
            kind: "timeline",
            tone: "Operational",
            status: "ai",
            content: ["API roadmap 1", "API roadmap 2"],
          },
          {
            id: "success",
            title: "Success Signals",
            kind: "metrics",
            tone: "Measured",
            status: "ai",
            content: ["API success 1", "API success 2"],
          },
        ],
      }),
    } as Response);

    await useStoryboardStore.getState().generateStoryboard();

    expect(fetchMock).toHaveBeenCalledWith("/api/generate-storyboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: "Initial prompt",
        template: "launch-brief",
      }),
    });

    const state = useStoryboardStore.getState();
    expect(state.artifactTitle).toBe("API Generated Artifact");
    expect(state.sections).toHaveLength(4);
    expect(state.lastSavedLabel).toBe("Storyboard generated with AI");
    expect(state.isGenerating).toBe(false);
  });

  it("handles generation failure gracefully", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
    } as Response);

    await useStoryboardStore.getState().generateStoryboard();

    expect(useStoryboardStore.getState().lastSavedLabel).toBe(
      "Generation failed. Check API/server setup.",
    );
    expect(useStoryboardStore.getState().isGenerating).toBe(false);
  });
});
