import { Download, Grip, Share2, Sparkles } from "lucide-react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";

import { useStoryboardStore } from "../../store/use-storyboard-store";
import { StoryboardSectionCard } from "./storyboard-section-card";

export function StoryboardCanvas() {
  const {
    sections,
    activeTemplate,
    artifactTitle,
    artifactSubtitle,
    reorderSections,
  } = useStoryboardStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    reorderSections(String(active.id), String(over.id));
  }

  return (
    <section className="rounded-[32px] border border-[var(--panel-border)] bg-[rgba(16,12,11,0.82)] p-5 shadow-[var(--shadow-lg)] backdrop-blur-xl">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--panel-border)] pb-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--accent)]">
            Live Artifact
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--text)]">
            {artifactTitle}
          </h1>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[rgba(224,176,122,0.18)] bg-[rgba(224,176,122,0.08)] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            <Sparkles size={14} />
            {artifactSubtitle}
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
            This is the core product surface: prompt in, structured narrative
            out, with editable sections that can later support regenerate,
            reorder, export, and share actions.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div
            aria-label="Active template"
            className="rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]"
          >
            {
              {
                "launch-brief": "Launch Brief",
                "product-strategy": "Product Strategy",
                "exec-summary": "Executive Summary",
              }[activeTemplate]
            }
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-2 text-sm text-[var(--text)] transition hover:border-[var(--accent)]">
            <Share2 size={15} />
            Share
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--accent)_0%,var(--accent-strong)_100%)] px-4 py-2 text-sm font-medium text-[#1b130f] transition hover:scale-[1.01]">
            <Download size={15} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
        <Grip size={14} />
        Drag sections to reorder the artifact
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((section) => section.id)}
          strategy={rectSortingStrategy}
        >
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {sections.map((section) => (
              <StoryboardSectionCard key={section.id} section={section} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}
