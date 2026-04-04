import { useMemo, useState } from "react";
import { Check, GripVertical, PenLine, RefreshCcw, X } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "../../lib/utils";
import type { StoryboardSection } from "../../store/use-storyboard-store";
import { useStoryboardStore } from "../../store/use-storyboard-store";

type StoryboardSectionCardProps = {
  section: StoryboardSection;
  index: number;
};

export function StoryboardSectionCard({
  section,
  index,
}: StoryboardSectionCardProps) {
  const { updateSection, regenerateSection } = useStoryboardStore();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(section.content.join("\n"));

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    disabled: isEditing,
  });

  const lineCountLabel = useMemo(() => {
    return `${section.content.length} block${section.content.length === 1 ? "" : "s"}`;
  }, [section.content.length]);

  function handleStartEditing() {
    setDraft(section.content.join("\n"));
    setIsEditing(true);
  }

  function handleCancel() {
    setDraft(section.content.join("\n"));
    setIsEditing(false);
  }

  function handleSave() {
    updateSection(
      section.id,
      draft
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    );
    setIsEditing(false);
  }

  function handleRegenerate() {
    regenerateSection(section.id);
    setDraft(section.content.join("\n"));
    setIsEditing(false);
  }

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "rounded-[24px] border border-[var(--panel-border)] bg-[rgba(20,16,14,0.92)] p-4 shadow-[var(--shadow-md)] sm:rounded-[28px] sm:p-5",
        isDragging && "opacity-70 ring-1 ring-[var(--accent)]",
      )}
    >
      <div className="flex flex-col gap-4 border-b border-[var(--panel-border)] pb-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label={`Drag ${section.title}`}
            {...attributes}
            {...listeners}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--panel)] text-[var(--text-faint)] transition hover:border-[var(--accent)] hover:text-[var(--text)]"
          >
            <GripVertical size={14} />
          </button>

          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] sm:tracking-[0.3em]">
            {section.kind}
          </p>

          <span className="rounded-full border border-[var(--panel-border)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)] sm:tracking-[0.2em]">
            {lineCountLabel}
          </span>

          <span className="rounded-full border border-[var(--panel-border)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)] sm:tracking-[0.2em]">
            {index + 1}
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-[var(--text)] sm:text-2xl">
              {section.title}
            </h3>

            {section.tone ? (
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Tone: {section.tone}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-2 self-start">
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em]",
                section.status === "edited"
                  ? "border-[rgba(141,208,165,0.24)] bg-[rgba(141,208,165,0.1)] text-[var(--success)]"
                  : "border-[var(--panel-border)] text-[var(--text-muted)]",
              )}
            >
              {section.status === "edited" ? "User refined" : "AI generated"}
            </span>

            {!isEditing ? (
              <>
                <button
                  type="button"
                  aria-label={`Edit ${section.title}`}
                  onClick={handleStartEditing}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--panel)] text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--text)]"
                >
                  <PenLine size={15} />
                </button>
                <button
                  type="button"
                  aria-label={`Regenerate ${section.title}`}
                  onClick={handleRegenerate}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--panel)] text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--text)]"
                >
                  <RefreshCcw size={15} />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  aria-label={`Save ${section.title}`}
                  onClick={handleSave}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(141,208,165,0.24)] bg-[rgba(141,208,165,0.1)] text-[var(--success)] transition hover:scale-[1.02]"
                >
                  <Check size={15} />
                </button>
                <button
                  type="button"
                  aria-label={`Cancel ${section.title}`}
                  onClick={handleCancel}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(240,139,125,0.24)] bg-[rgba(240,139,125,0.1)] text-[var(--danger)] transition hover:scale-[1.02]"
                >
                  <X size={15} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {!isEditing ? (
        <div className="mt-4 space-y-3">
          {section.content.map((line, lineIndex) => (
            <div
              key={`${section.id}-${lineIndex}`}
              className="rounded-[18px] border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-sm leading-7 text-[var(--text-muted)] sm:rounded-[20px]"
            >
              {line}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <textarea
            aria-label={`Editor for ${section.title}`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={Math.max(section.content.length * 2, 8)}
            className="w-full resize-none rounded-[20px] border border-[var(--accent)] bg-[rgba(255,248,238,0.04)] px-4 py-4 text-sm leading-7 text-[var(--text)] outline-none sm:rounded-[22px]"
          />
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--text-faint)]">
            One line per content block. Save to persist locally in the
            workspace.
          </p>
        </div>
      )}
    </article>
  );
}
