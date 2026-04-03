import { Clock3, CopyPlus, History, ShieldCheck } from "lucide-react";

import { Sidebar } from "../../components/layout/sidebar";

const events = [
  "Initial artifact generated from launch brief prompt",
  "Narrative summary refined with a sharper product angle",
  "Roadmap section marked for regenerate after API wiring",
];

export function HistoryPanel() {
  return (
    <Sidebar eyebrow="Timeline" title="Session History" className="h-full">
      <div className="space-y-5">
        <div className="rounded-[24px] border border-[var(--panel-border)] bg-[var(--panel)] p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--text)]">
            <ShieldCheck size={16} className="text-[var(--success)]" />
            Local-first draft safety
          </div>
          <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
            We will keep edits recoverable with snapshots, clear save states,
            and safe regeneration boundaries.
          </p>
        </div>

        <div className="rounded-[24px] border border-[var(--panel-border)] bg-[var(--panel)] p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--text)]">
            <History size={16} className="text-[var(--accent)]" />
            Recent activity
          </div>

          <div className="mt-4 space-y-3">
            {events.map((event, index) => (
              <div
                key={event}
                className="rounded-[20px] border border-[var(--panel-border)] px-4 py-3"
              >
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[var(--text-faint)]">
                  <Clock3 size={13} />
                  Event {index + 1}
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  {event}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--text)] transition hover:border-[var(--accent)]">
          <CopyPlus size={16} />
          Duplicate current draft
        </button>
      </div>
    </Sidebar>
  );
}
