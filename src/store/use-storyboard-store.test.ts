import { beforeEach, describe, expect, it, vi } from "vitest";

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
});
