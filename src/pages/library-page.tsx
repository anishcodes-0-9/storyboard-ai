import { BookOpen, Clock3, MoveRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { AppShell } from "../components/layout/app-shell";
import { useStoryboardStore } from "../store/use-storyboard-store";

function formatArtifactTime(value: string) {
  const date = new Date(value);
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function LibraryPage() {
  const artifacts = useStoryboardStore((state) => state.artifacts);
  const loadArtifact = useStoryboardStore((state) => state.loadArtifact);
  const navigate = useNavigate();

  function handleOpenArtifact(artifactId: string) {
    loadArtifact(artifactId);
    navigate("/editor");
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[32px] border border-[var(--panel-border)] bg-[rgba(16,12,11,0.82)] p-6 shadow-[var(--shadow-lg)] backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--panel-border)] pb-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--accent)]">
                Artifact Library
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[var(--text)]">
                Return to previous storyboard drafts
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
                This library stores the latest saved versions of your artifacts
                so you can come back later and continue refining them.
              </p>
            </div>

            <Link
              to="/editor"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-5 py-3 text-sm text-[var(--text)] transition hover:border-[var(--accent)]"
            >
              Back to editor
            </Link>
          </div>

          {artifacts.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-[var(--panel-border)] bg-[var(--panel)] p-8 text-center">
              <div className="mx-auto inline-flex rounded-2xl bg-[rgba(224,176,122,0.12)] p-4 text-[var(--accent)]">
                <BookOpen size={20} />
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[var(--text)]">
                No saved artifacts yet
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                Save the current storyboard to your library from the editor to
                make it retrievable here.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {artifacts.map((artifact) => (
                <article
                  key={artifact.id}
                  className="rounded-[24px] border border-[var(--panel-border)] bg-[var(--panel)] p-5"
                >
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[var(--accent)]">
                    <Clock3 size={13} />
                    Updated {formatArtifactTime(artifact.updatedAt)}
                  </div>

                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--text)]">
                    {artifact.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                    {artifact.subtitle}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-faint)]">
                    {artifact.sections.length} sections ·{" "}
                    {artifact.snapshots.length} snapshots
                  </p>

                  <button
                    type="button"
                    onClick={() => handleOpenArtifact(artifact.id)}
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[rgba(224,176,122,0.08)] px-4 py-2 text-sm text-[var(--text)] transition hover:border-[var(--accent)]"
                  >
                    Open artifact
                    <MoveRight size={15} />
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
