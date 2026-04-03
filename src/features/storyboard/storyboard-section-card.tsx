import { PenLine, RefreshCcw } from "lucide-react";

import type { StoryboardSection } from "../../store/use-storyboard-store";

type StoryboardSectionCardProps = {
  section: StoryboardSection;
};

export function StoryboardSectionCard({ section }: StoryboardSectionCardProps) {
  return (
    <article className="rounded-[28px] border border-[var(--panel-border)] bg-[rgba(20,16,14,0.92)] p-5 shadow-[var(--shadow-md)]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--panel-border)] pb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">
            {section.kind}
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--text)]">
            {section.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-[var(--panel-border)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            {section.status === "edited" ? "User refined" : "AI generated"}
          </span>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--panel)] text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--text)]">
            <PenLine size={15} />
          </button>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--panel)] text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--text)]">
            <RefreshCcw size={15} />
          </button>
        </div>
      </div>

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
    </article>
  );
}
