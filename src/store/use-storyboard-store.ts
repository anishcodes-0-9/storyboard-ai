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
  saveArtifact: () => void;
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

function extractPromptKeywords(prompt: string) {
  return prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 6);
}

function deriveArtifactTitle(prompt: string) {
  const cleaned = prompt.trim().replace(/\s+/g, " ");
  if (!cleaned) return "Untitled Storyboard";
  const trimmed =
    cleaned.length > 48 ? `${cleaned.slice(0, 48).trim()}...` : cleaned;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function buildGeneratedSections(
  prompt: string,
  template: StoryboardState["activeTemplate"],
): {
  sections: StoryboardSection[];
  artifactTitle: string;
  artifactSubtitle: string;
} {
  const normalizedPrompt = prompt.trim();
  const keywords = extractPromptKeywords(normalizedPrompt);
  const subject =
    normalizedPrompt.length > 0
      ? normalizedPrompt.slice(0, 72)
      : "an AI-assisted product story";
  const templateLabel = templateLabels[template];

  return {
    artifactTitle: deriveArtifactTitle(normalizedPrompt),
    artifactSubtitle: `${templateLabel} generated from your latest prompt`,
    sections: [
      {
        id: "summary",
        title: "Narrative Summary",
        kind: "summary",
        status: "ai",
        tone: "Confident",
        content: [
          `This storyboard frames ${subject} as a polished ${templateLabel.toLowerCase()} with a clearer story arc, stronger structure, and sharper review readiness.`,
          `The generated draft emphasizes speed, visual clarity, and editable sections so the artifact feels useful immediately instead of reading like raw AI output.`,
        ],
      },
      {
        id: "pillars",
        title: "Strategic Pillars",
        kind: "bullets",
        status: "ai",
        tone: "Sharp",
        content: [
          `Lead with ${keywords[0] ?? "a compelling product narrative"} to anchor the story`,
          `Show why ${keywords[1] ?? "the core workflow"} matters now`,
          `Translate ${keywords[2] ?? "the value proposition"} into a presentation-ready structure`,
        ],
      },
      {
        id: "roadmap",
        title: "Milestone Roadmap",
        kind: "timeline",
        status: "ai",
        tone: "Operational",
        content: [
          `Phase 1: shape the ${keywords[3] ?? "opening narrative"} and establish the visual hierarchy`,
          `Phase 2: refine sections, iterate on ${keywords[4] ?? "key messages"}, and validate clarity`,
          `Phase 3: prepare export-ready output and finalize the ${keywords[5] ?? "review flow"}`,
        ],
      },
      {
        id: "success",
        title: "Success Signals",
        kind: "metrics",
        status: "ai",
        tone: "Measured",
        content: [
          "The first draft feels credible within one generation pass",
          "Users can refine individual sections without losing the broader story",
          "The final artifact looks polished enough to review or present right away",
        ],
      },
    ],
  };
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
    const { prompt, activeTemplate } = get();

    set({
      isGenerating: true,
      lastSavedLabel: "Generating storyboard...",
    });

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    const generated = buildGeneratedSections(prompt, activeTemplate);

    set({
      isGenerating: false,
      sections: generated.sections,
      artifactTitle: generated.artifactTitle,
      artifactSubtitle: generated.artifactSubtitle,
      lastSavedLabel: "Storyboard generated locally",
    });
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

      return {
        snapshots: [snapshot, ...state.snapshots].slice(0, 8),
        lastSavedLabel: "Snapshot saved locally",
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
  saveArtifact: () =>
    set((state) => {
      const now = new Date().toISOString();
      const artifactId = state.activeArtifactId ?? crypto.randomUUID();
      const nextArtifact: StoryboardArtifact = {
        id: artifactId,
        updatedAt: now,
        ...createArtifactLabelState(state),
      };

      const remaining = state.artifacts.filter(
        (artifact) => artifact.id !== artifactId,
      );

      return {
        artifacts: [nextArtifact, ...remaining].slice(0, 12),
        activeArtifactId: artifactId,
        lastSavedLabel: "Artifact saved to library",
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

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        getPersistableState({
          prompt: state.prompt,
          activeTemplate: state.activeTemplate,
          sections: state.sections,
          artifactTitle: state.artifactTitle,
          artifactSubtitle: state.artifactSubtitle,
          snapshots: state.snapshots,
          artifacts: state.artifacts,
          activeArtifactId: state.activeArtifactId,
        }),
      ),
    );

    set({
      lastSavedLabel: "Saved to local storage",
    });
  },
}));
