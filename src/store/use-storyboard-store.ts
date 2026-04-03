import { create } from "zustand";

export type StoryboardSection = {
  id: string;
  title: string;
  kind: "summary" | "bullets" | "timeline" | "metrics";
  content: string[];
  tone?: string;
  status: "ai" | "edited";
};

type StoryboardState = {
  prompt: string;
  activeTemplate: "launch-brief" | "product-strategy" | "exec-summary";
  lastSavedLabel: string;
  sections: StoryboardSection[];
  setPrompt: (value: string) => void;
  setTemplate: (value: StoryboardState["activeTemplate"]) => void;
  updateSection: (id: string, content: string[]) => void;
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

export const useStoryboardStore = create<StoryboardState>((set) => ({
  prompt:
    "Create a launch-ready storyboard for an AI tool that converts rough product ideas into polished presentation narratives for team reviews.",
  activeTemplate: "launch-brief",
  lastSavedLabel: "Saved just now",
  sections: initialSections,
  setPrompt: (value) =>
    set({
      prompt: value,
      lastSavedLabel: "Draft updated just now",
    }),
  setTemplate: (value) =>
    set({
      activeTemplate: value,
      lastSavedLabel: "Template switched just now",
    }),
  updateSection: (id, content) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === id
          ? {
              ...section,
              content,
              status: "edited",
            }
          : section,
      ),
      lastSavedLabel: "Section edits saved locally",
    })),
}));
