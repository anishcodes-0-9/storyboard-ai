import { create } from "zustand";

export type StoryboardSection = {
  id: string;
  title: string;
  kind: "summary" | "bullets" | "timeline" | "metrics";
  content: string[];
  tone?: string;
  status: "ai" | "edited";
};

export type StoryboardSnapshot = {
  id: string;
  label: string;
  createdAt: string;
  prompt: string;
  activeTemplate: "launch-brief" | "product-strategy" | "exec-summary";
  artifactTitle: string;
  artifactSubtitle: string;
  sections: StoryboardSection[];
};

export type StoryboardArtifact = {
  id: string;
  title: string;
  subtitle: string;
  updatedAt: string;
  prompt: string;
  activeTemplate: "launch-brief" | "product-strategy" | "exec-summary";
  sections: StoryboardSection[];
  snapshots: StoryboardSnapshot[];
};

type StoryboardState = {
  prompt: string;
  activeTemplate: "launch-brief" | "product-strategy" | "exec-summary";
  lastSavedLabel: string;
  sections: StoryboardSection[];
  artifactTitle: string;
  artifactSubtitle: string;
  snapshots: StoryboardSnapshot[];
  artifacts: StoryboardArtifact[];
  activeArtifactId: string | null;
  hydrated: boolean;
  isGenerating: boolean;
  setPrompt: (value: string) => void;
  setTemplate: (value: StoryboardState["activeTemplate"]) => void;
  generateStoryboard: () => Promise<void>;
  updateSection: (id: string, content: string[]) => void;
  regenerateSection: (id: string) => void;
  reorderSections: (activeId: string, overId: string) => void;
  saveSnapshot: () => void;
  restoreSnapshot: (snapshotId: string) => void;
  deleteSnapshot: (snapshotId: string) => void;
  saveArtifact: () => void;
  saveArtifactAsNew: () => void;
  deleteArtifact: (artifactId: string) => void;
  loadArtifact: (artifactId: string) => void;
  hydrateFromStorage: () => void;
  saveToStorage: () => void;
};

type PersistedStoryboardState = Pick<
  StoryboardState,
  | "prompt"
  | "activeTemplate"
  | "sections"
  | "artifactTitle"
  | "artifactSubtitle"
  | "snapshots"
  | "artifacts"
  | "activeArtifactId"
>;

const STORAGE_KEY = "storyboard-ai.workspace";

const templateLabels: Record<StoryboardState["activeTemplate"], string> = {
  "launch-brief": "Launch Brief",
  "product-strategy": "Product Strategy",
  "exec-summary": "Executive Summary",
};

const initialSections: StoryboardSection[] = [
  {
    id: "summary",
    title: "Narrative Summary",
    kind: "summary",
    status: "ai",
    tone: "Confident",
    content: [
      "Storyboard AI turns rough prompts into structured, presentation-ready narratives with a visual language that feels crafted instead of auto-generated.",
      "The MVP focuses on speed, editability, and section-level regeneration so the output becomes a working artifact, not a disposable draft.",
    ],
  },
  {
    id: "pillars",
    title: "Strategic Pillars",
    kind: "bullets",
    status: "edited",
    tone: "Sharp",
    content: [
      "Prompt-first workflow with instant visual payoff",
      "Inline editing that respects manual refinement",
      "Presentation-grade layout, export, and review readiness",
    ],
  },
  {
    id: "roadmap",
    title: "Milestone Roadmap",
    kind: "timeline",
    status: "ai",
    tone: "Operational",
    content: [
      "Week 1: land visual shell, app structure, and prompt workflow",
      "Week 2: add editable sections, reorder, and autosave",
      "Week 3: connect generation API and polish export flow",
    ],
  },
  {
    id: "success",
    title: "Success Signals",
    kind: "metrics",
    status: "ai",
    tone: "Measured",
    content: [
      "First meaningful artifact generated in under 60 seconds",
      "Users can revise one section without losing the rest",
      "The result feels polished enough to present immediately",
    ],
  },
];

const regeneratedCopy: Record<string, string[]> = {
  summary: [
    "Storyboard AI converts rough product thinking into a polished narrative artifact designed for review, alignment, and presentation.",
    "The experience emphasizes a fast first draft, section-level refinement, and a visual system strong enough to make the output feel immediately usable.",
  ],
  pillars: [
    "Opinionated prompt-to-artifact workflow",
    "Editable structure with low-friction iteration",
    "Presentation-ready output with export potential",
  ],
  roadmap: [
    "Phase 1: establish premium frontend shell and information hierarchy",
    "Phase 2: unlock editing, persistence, and regeneration controls",
    "Phase 3: connect live AI generation and export-ready delivery",
  ],
  success: [
    "Users reach a credible first draft quickly",
    "Manual changes survive iterative AI refinement",
    "The artifact feels strong enough to share without redesigning it elsewhere",
  ],
};

function getPersistableState(
  state: Pick<
    StoryboardState,
    | "prompt"
    | "activeTemplate"
    | "sections"
    | "artifactTitle"
    | "artifactSubtitle"
    | "snapshots"
    | "artifacts"
    | "activeArtifactId"
  >,
): PersistedStoryboardState {
  return {
    prompt: state.prompt,
    activeTemplate: state.activeTemplate,
    sections: state.sections,
    artifactTitle: state.artifactTitle,
    artifactSubtitle: state.artifactSubtitle,
    snapshots: state.snapshots,
    artifacts: state.artifacts,
    activeArtifactId: state.activeArtifactId,
  };
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

function cloneSections(sections: StoryboardSection[]) {
  return sections.map((section) => ({
    ...section,
    content: [...section.content],
  }));
}

function cloneSnapshots(snapshots: StoryboardSnapshot[]) {
  return snapshots.map((snapshot) => ({
    ...snapshot,
    sections: cloneSections(snapshot.sections),
  }));
}

function createSnapshotLabel(title: string, count: number) {
  return `${title || "Untitled Storyboard"} · Snapshot ${count}`;
}

function createArtifactLabelState(
  state: Pick<
    StoryboardState,
    | "prompt"
    | "activeTemplate"
    | "sections"
    | "artifactTitle"
    | "artifactSubtitle"
    | "snapshots"
  >,
) {
  return {
    title: state.artifactTitle,
    subtitle: state.artifactSubtitle,
    prompt: state.prompt,
    activeTemplate: state.activeTemplate,
    sections: cloneSections(state.sections),
    snapshots: cloneSnapshots(state.snapshots),
  };
}

function createArtifactFromState(
  state: Pick<
    StoryboardState,
    | "prompt"
    | "activeTemplate"
    | "sections"
    | "artifactTitle"
    | "artifactSubtitle"
    | "snapshots"
  >,
  artifactId: string,
  updatedAt: string,
): StoryboardArtifact {
  return {
    id: artifactId,
    updatedAt,
    ...createArtifactLabelState(state),
  };
}

function persistWorkspaceState(
  state: Pick<
    StoryboardState,
    | "prompt"
    | "activeTemplate"
    | "sections"
    | "artifactTitle"
    | "artifactSubtitle"
    | "snapshots"
    | "artifacts"
    | "activeArtifactId"
  >,
) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(getPersistableState(state)),
  );
}

function tryPersistWorkspaceState(
  state: Pick<
    StoryboardState,
    | "prompt"
    | "activeTemplate"
    | "sections"
    | "artifactTitle"
    | "artifactSubtitle"
    | "snapshots"
    | "artifacts"
    | "activeArtifactId"
  >,
) {
  try {
    persistWorkspaceState(state);
    return true;
  } catch {
    return false;
  }
}

export const useStoryboardStore = create<StoryboardState>((set, get) => ({
  prompt:
    "Create a launch-ready storyboard for an AI tool that converts rough product ideas into polished presentation narratives for team reviews.",
  activeTemplate: "launch-brief",
  lastSavedLabel: "Saved just now",
  sections: initialSections,
  artifactTitle: "New Product Launch",
  artifactSubtitle: "Launch Brief generated from your latest prompt",
  snapshots: [],
  artifacts: [],
  activeArtifactId: null,
  hydrated: false,
  isGenerating: false,
  setPrompt: (value) =>
    set({
      prompt: value,
      lastSavedLabel: "Draft updated locally",
    }),
  setTemplate: (value) =>
    set({
      activeTemplate: value,
      artifactSubtitle: `${templateLabels[value]} selected for the next generation`,
      lastSavedLabel: "Template switched locally",
    }),
  generateStoryboard: async () => {
    const { prompt, activeTemplate, isGenerating } = get();

    if (isGenerating) {
      return;
    }

    if (!prompt.trim()) {
      set({
        lastSavedLabel: "Prompt is required before generation",
      });
      return;
    }

    set({
      isGenerating: true,
      lastSavedLabel: "Generating storyboard...",
    });

    try {
      const response = await fetch("/api/generate-storyboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          template: activeTemplate,
        }),
      });

      if (!response.ok) {
        throw new Error("Generation request failed");
      }

      const generated = await response.json();

      set((state) => ({
        isGenerating: false,
        sections: generated.sections,
        artifactTitle: generated.artifactTitle,
        artifactSubtitle: generated.artifactSubtitle,
        lastSavedLabel: "Storyboard generated with AI",
        activeArtifactId: state.activeArtifactId,
      }));
    } catch (error) {
      console.error(error);
      set({
        isGenerating: false,
        lastSavedLabel: "Generation failed. Check API/server setup.",
      });
    }
  },
  updateSection: (id, content) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === id
          ? {
              ...section,
              content: content.filter((line) => line.trim().length > 0),
              status: "edited",
            }
          : section,
      ),
      lastSavedLabel: "Section edits saved locally",
    })),
  regenerateSection: (id) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === id
          ? {
              ...section,
              content: regeneratedCopy[id] ?? section.content,
              status: "ai",
            }
          : section,
      ),
      lastSavedLabel: "Section regenerated locally",
    })),
  reorderSections: (activeId, overId) =>
    set((state) => {
      const fromIndex = state.sections.findIndex(
        (section) => section.id === activeId,
      );
      const toIndex = state.sections.findIndex(
        (section) => section.id === overId,
      );

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
        return state;
      }

      return {
        sections: moveItem(state.sections, fromIndex, toIndex),
        lastSavedLabel: "Section order updated locally",
      };
    }),
  saveSnapshot: () =>
    set((state) => {
      const nextCount = state.snapshots.length + 1;
      const snapshot: StoryboardSnapshot = {
        id: crypto.randomUUID(),
        label: createSnapshotLabel(state.artifactTitle, nextCount),
        createdAt: new Date().toISOString(),
        prompt: state.prompt,
        activeTemplate: state.activeTemplate,
        artifactTitle: state.artifactTitle,
        artifactSubtitle: state.artifactSubtitle,
        sections: cloneSections(state.sections),
      };

      const nextSnapshots = [snapshot, ...state.snapshots].slice(0, 8);
      const persisted = tryPersistWorkspaceState({
        prompt: state.prompt,
        activeTemplate: state.activeTemplate,
        sections: state.sections,
        artifactTitle: state.artifactTitle,
        artifactSubtitle: state.artifactSubtitle,
        snapshots: nextSnapshots,
        artifacts: state.artifacts,
        activeArtifactId: state.activeArtifactId,
      });

      return {
        snapshots: nextSnapshots,
        lastSavedLabel: persisted
          ? "Snapshot saved locally"
          : "Snapshot saved in memory only",
      };
    }),
  restoreSnapshot: (snapshotId) =>
    set((state) => {
      const snapshot = state.snapshots.find((item) => item.id === snapshotId);
      if (!snapshot) {
        return state;
      }

      return {
        prompt: snapshot.prompt,
        activeTemplate: snapshot.activeTemplate,
        artifactTitle: snapshot.artifactTitle,
        artifactSubtitle: snapshot.artifactSubtitle,
        sections: cloneSections(snapshot.sections),
        lastSavedLabel: `Restored ${snapshot.label}`,
      };
    }),
  deleteSnapshot: (snapshotId) =>
    set((state) => {
      const nextSnapshots = state.snapshots.filter(
        (snapshot) => snapshot.id !== snapshotId,
      );

      const persisted = tryPersistWorkspaceState({
        prompt: state.prompt,
        activeTemplate: state.activeTemplate,
        sections: state.sections,
        artifactTitle: state.artifactTitle,
        artifactSubtitle: state.artifactSubtitle,
        snapshots: nextSnapshots,
        artifacts: state.artifacts,
        activeArtifactId: state.activeArtifactId,
      });

      return {
        snapshots: nextSnapshots,
        lastSavedLabel: persisted
          ? "Snapshot deleted locally"
          : "Snapshot deleted in memory only",
      };
    }),
  saveArtifact: () =>
    set((state) => {
      const now = new Date().toISOString();
      const artifactId = state.activeArtifactId ?? crypto.randomUUID();
      const nextArtifact = createArtifactFromState(state, artifactId, now);

      const remaining = state.artifacts.filter(
        (artifact) => artifact.id !== artifactId,
      );
      const nextArtifacts = [nextArtifact, ...remaining].slice(0, 12);

      const persisted = tryPersistWorkspaceState({
        prompt: state.prompt,
        activeTemplate: state.activeTemplate,
        sections: state.sections,
        artifactTitle: state.artifactTitle,
        artifactSubtitle: state.artifactSubtitle,
        snapshots: state.snapshots,
        artifacts: nextArtifacts,
        activeArtifactId: artifactId,
      });

      return {
        artifacts: nextArtifacts,
        activeArtifactId: artifactId,
        lastSavedLabel: persisted
          ? "Artifact saved to library"
          : "Artifact saved in memory only",
      };
    }),
  saveArtifactAsNew: () =>
    set((state) => {
      const now = new Date().toISOString();
      const artifactId = crypto.randomUUID();
      const nextArtifact = createArtifactFromState(state, artifactId, now);
      const nextArtifacts = [nextArtifact, ...state.artifacts].slice(0, 12);

      const persisted = tryPersistWorkspaceState({
        prompt: state.prompt,
        activeTemplate: state.activeTemplate,
        sections: state.sections,
        artifactTitle: state.artifactTitle,
        artifactSubtitle: state.artifactSubtitle,
        snapshots: state.snapshots,
        artifacts: nextArtifacts,
        activeArtifactId: artifactId,
      });

      return {
        artifacts: nextArtifacts,
        activeArtifactId: artifactId,
        lastSavedLabel: persisted
          ? "Artifact saved as new entry"
          : "Artifact saved as new in memory only",
      };
    }),
  deleteArtifact: (artifactId) =>
    set((state) => {
      const nextArtifacts = state.artifacts.filter(
        (artifact) => artifact.id !== artifactId,
      );
      const deletedActiveArtifact = state.activeArtifactId === artifactId;
      const nextActiveArtifactId = deletedActiveArtifact
        ? null
        : state.activeArtifactId;

      const persisted = tryPersistWorkspaceState({
        prompt: state.prompt,
        activeTemplate: state.activeTemplate,
        sections: state.sections,
        artifactTitle: state.artifactTitle,
        artifactSubtitle: state.artifactSubtitle,
        snapshots: state.snapshots,
        artifacts: nextArtifacts,
        activeArtifactId: nextActiveArtifactId,
      });

      return {
        artifacts: nextArtifacts,
        activeArtifactId: nextActiveArtifactId,
        lastSavedLabel: persisted
          ? deletedActiveArtifact
            ? "Artifact deleted from library. Current editor is now an unsaved draft"
            : "Artifact deleted from library"
          : "Artifact deleted in memory only",
      };
    }),
  loadArtifact: (artifactId) =>
    set((state) => {
      const artifact = state.artifacts.find((item) => item.id === artifactId);
      if (!artifact) {
        return state;
      }

      return {
        prompt: artifact.prompt,
        activeTemplate: artifact.activeTemplate,
        sections: cloneSections(artifact.sections),
        artifactTitle: artifact.title,
        artifactSubtitle: artifact.subtitle,
        snapshots: cloneSnapshots(artifact.snapshots),
        activeArtifactId: artifact.id,
        lastSavedLabel: `Loaded ${artifact.title}`,
      };
    }),
  hydrateFromStorage: () => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        set({
          hydrated: true,
          lastSavedLabel: "Fresh workspace ready",
        });
        return;
      }

      const parsed = JSON.parse(raw) as PersistedStoryboardState;

      set({
        prompt: parsed.prompt,
        activeTemplate: parsed.activeTemplate,
        sections: parsed.sections,
        artifactTitle: parsed.artifactTitle ?? "New Product Launch",
        artifactSubtitle:
          parsed.artifactSubtitle ??
          "Launch Brief generated from your latest prompt",
        snapshots: parsed.snapshots ?? [],
        artifacts: parsed.artifacts ?? [],
        activeArtifactId: parsed.activeArtifactId ?? null,
        hydrated: true,
        lastSavedLabel: "Restored from local storage",
      });
    } catch {
      set({
        hydrated: true,
        lastSavedLabel: "Storage restore failed, using defaults",
      });
    }
  },
  saveToStorage: () => {
    if (typeof window === "undefined") {
      return;
    }

    const state = get();

    try {
      persistWorkspaceState({
        prompt: state.prompt,
        activeTemplate: state.activeTemplate,
        sections: state.sections,
        artifactTitle: state.artifactTitle,
        artifactSubtitle: state.artifactSubtitle,
        snapshots: state.snapshots,
        artifacts: state.artifacts,
        activeArtifactId: state.activeArtifactId,
      });

      set({
        lastSavedLabel: "Saved to local storage",
      });
    } catch {
      set({
        lastSavedLabel: "Local save failed. Changes remain in memory",
      });
    }
  },
}));
