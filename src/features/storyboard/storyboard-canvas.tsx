import { useRef, useState } from "react";
import { Check, Download, Grip, Share2, Sparkles } from "lucide-react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";

import { exportElementToPdf } from "../../lib/export-pdf";
import { buildStoryboardMarkdown } from "../../lib/export-markdown";
import { useStoryboardStore } from "../../store/use-storyboard-store";
import { StoryboardSectionCard } from "./storyboard-section-card";

const templateLabels = {
  "launch-brief": "Launch Brief",
  "product-strategy": "Product Strategy",
  "exec-summary": "Executive Summary",
} as const;

export function StoryboardCanvas() {
  const {
    sections,
    activeTemplate,
    artifactTitle,
    artifactSubtitle,
    reorderSections,
    lastSavedLabel,
  } = useStoryboardStore();

  const [isExporting, setIsExporting] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const exportRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  async function handleExport() {
    if (!exportRef.current || isExporting) {
      return;
    }

    try {
      setIsExporting(true);
      await exportElementToPdf(exportRef.current, artifactTitle);
    } finally {
      setIsExporting(false);
    }
  }

  async function handleCopy() {
    try {
      const markdown = buildStoryboardMarkdown({
        title: artifactTitle,
        subtitle: artifactSubtitle,
        templateLabel: templateLabels[activeTemplate],
        sections,
      });

      await navigator.clipboard.writeText(markdown);
      setCopyState("copied");
      window.setTimeout(() => {
        setCopyState("idle");
      }, 1500);
    } catch {
      setCopyState("failed");
      window.setTimeout(() => {
        setCopyState("idle");
      }, 2000);
    }
  }

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
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--text-faint)]">
            {lastSavedLabel}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div
            aria-label="Active template"
            className="rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]"
          >
            {templateLabels[activeTemplate]}
          </div>
          <button
            type="button"
            onClick={() => {
              void handleCopy();
            }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-2 text-sm text-[var(--text)] transition hover:border-[var(--accent)]"
          >
            {copyState === "copied" ? (
              <Check size={15} />
            ) : (
              <Share2 size={15} />
            )}
            {copyState === "copied"
              ? "Copied Markdown"
              : copyState === "failed"
                ? "Copy Failed"
                : "Copy Output"}
          </button>
          <button
            type="button"
            onClick={() => {
              void handleExport();
            }}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--accent)_0%,var(--accent-strong)_100%)] px-4 py-2 text-sm font-medium text-[#1b130f] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Download size={15} />
            {isExporting ? "Exporting..." : "Export PDF"}
          </button>
        </div>
      </div>

      <div ref={exportRef} className="mt-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
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
              {sections.map((section, index) => (
                <StoryboardSectionCard
                  key={section.id}
                  section={section}
                  index={index}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </section>
  );
}
