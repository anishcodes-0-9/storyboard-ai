import { useMemo, useState } from "react";
import { Check, GripVertical, PenLine, RefreshCcw, X } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "../../lib/utils";
import type { StoryboardSection } from "../../store/use-storyboard-store";
import { useStoryboardStore } from "../../store/use-storyboard-store";

type StoryboardSectionCardProps = {
  section: StoryboardSection;
};

export function StoryboardSectionCard({ section }: StoryboardSectionCardProps) {
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
        "rounded-[28px] border border-[var(--panel-border)] bg-[rgba(20,16,14,0.92)] p-5 shadow-[var(--shadow-md)]",
        isDragging && "opacity-70 ring-1 ring-[var(--accent)]",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--panel-border)] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--panel)] text-[var(--text-faint)] transition hover:border-[var(--accent)] hover:text-[var(--text)]"
            >
              <GripVertical size={14} />
            </button>

            <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">
              {section.kind}
            </p>

            <span className="rounded-full border border-[var(--panel-border)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">
              {lineCountLabel}
            </span>
          </div>

          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--text)]">
            {section.title}
          </h3>

          {section.tone ? (
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Tone: {section.tone}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em]",
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
                onClick={handleStartEditing}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--panel)] text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--text)]"
              >
                <PenLine size={15} />
              </button>
              <button
                onClick={handleRegenerate}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--panel)] text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--text)]"
              >
                <RefreshCcw size={15} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(141,208,165,0.24)] bg-[rgba(141,208,165,0.1)] text-[var(--success)] transition hover:scale-[1.02]"
              >
                <Check size={15} />
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(240,139,125,0.24)] bg-[rgba(240,139,125,0.1)] text-[var(--danger)] transition hover:scale-[1.02]"
              >
                <X size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      {!isEditing ? (
        <div className="mt-4 space-y-3">
          {section.content.map((line) => (
            <div
              key={line}
              className="rounded-[20px] border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-sm leading-7 text-[var(--text-muted)]"
            >
              {line}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={Math.max(section.content.length * 2, 8)}
            className="w-full resize-none rounded-[22px] border border-[var(--accent)] bg-[rgba(255,248,238,0.04)] px-4 py-4 text-sm leading-7 text-[var(--text)] outline-none"
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
