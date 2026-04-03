import {
  BookOpen,
  Clock3,
  CopyPlus,
  History,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Sidebar } from "../../components/layout/sidebar";
import { useStoryboardStore } from "../../store/use-storyboard-store";

function formatSnapshotTime(value: string) {
  const date = new Date(value);
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function HistoryPanel() {
  const hydrated = useStoryboardStore((state) => state.hydrated);
  const lastSavedLabel = useStoryboardStore((state) => state.lastSavedLabel);
  const snapshots = useStoryboardStore((state) => state.snapshots);
  const restoreSnapshot = useStoryboardStore((state) => state.restoreSnapshot);
  const saveArtifact = useStoryboardStore((state) => state.saveArtifact);

  return (
    <Sidebar eyebrow="Timeline" title="Session History" className="h-full">
      <div className="space-y-5">
        <div className="rounded-[24px] border border-[var(--panel-border)] bg-[var(--panel)] p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--text)]">
            <ShieldCheck size={16} className="text-[var(--success)]" />
            Local-first draft safety
          </div>
          <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
            We keep edits recoverable with snapshots, visible save states, and a
            workspace that restores after refresh.
          </p>
        </div>

        <div className="rounded-[24px] border border-[var(--panel-border)] bg-[var(--panel)] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--text)]">
              <History size={16} className="text-[var(--accent)]" />
              Recent activity
            </div>
            <span className="rounded-full border border-[var(--panel-border)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
              {hydrated ? "Hydrated" : "Loading"}
            </span>
          </div>

          <p className="mt-3 text-sm text-[var(--text-muted)]">
            {lastSavedLabel}
          </p>

          <div className="mt-4 space-y-3">
            {snapshots.length === 0 ? (
              <div className="rounded-[20px] border border-[var(--panel-border)] px-4 py-4 text-sm leading-6 text-[var(--text-muted)]">
                Save your first snapshot to create a lightweight restore point.
              </div>
            ) : (
              snapshots.map((snapshot, index) => (
                <div
                  key={snapshot.id}
                  className="rounded-[20px] border border-[var(--panel-border)] px-4 py-3"
                >
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[var(--text-faint)]">
                    <Clock3 size={13} />
                    Snapshot {snapshots.length - index}
                  </div>
                  <p className="mt-2 text-sm font-medium text-[var(--text)]">
                    {snapshot.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                    {formatSnapshotTime(snapshot.createdAt)}
                  </p>
                  <button
                    type="button"
                    onClick={() => restoreSnapshot(snapshot.id)}
                    className="mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-2 text-xs uppercase tracking-[0.16em] text-[var(--text)] transition hover:border-[var(--accent)]"
                  >
                    <RotateCcw size={13} />
                    Restore
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={saveArtifact}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--text)] transition hover:border-[var(--accent)]"
        >
          <CopyPlus size={16} />
          Save to library
        </button>

        <Link
          to="/library"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--text)] transition hover:border-[var(--accent)]"
        >
          <BookOpen size={16} />
          Open artifact library
        </Link>
      </div>
    </Sidebar>
  );
}
