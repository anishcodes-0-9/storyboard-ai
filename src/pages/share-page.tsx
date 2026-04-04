import { Clock3, FileWarning, Share2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

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

export function SharePage() {
  const { artifactId } = useParams();
  const artifact = useStoryboardStore((state) =>
    state.artifacts.find((item) => item.id === artifactId),
  );

  if (!artifact) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[32px] border border-[var(--panel-border)] bg-[rgba(16,12,11,0.82)] p-8 text-center shadow-[var(--shadow-lg)] backdrop-blur-xl">
            <div className="mx-auto inline-flex rounded-2xl bg-[rgba(240,139,125,0.12)] p-4 text-[var(--danger)]">
              <FileWarning size={20} />
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--text)]">
              Shared artifact not found
            </h1>
            <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
              This link does not point to an artifact currently stored in the
              local library.
            </p>
            <Link
              to="/library"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-5 py-3 text-sm text-[var(--text)] transition hover:border-[var(--accent)]"
            >
              Back to library
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[32px] border border-[var(--panel-border)] bg-[rgba(16,12,11,0.82)] p-6 shadow-[var(--shadow-lg)] backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--panel-border)] pb-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--accent)]">
                Shared Artifact
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[var(--text)]">
                {artifact.title}
              </h1>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[rgba(224,176,122,0.18)] bg-[rgba(224,176,122,0.08)] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                <Share2 size={14} />
                {artifact.subtitle}
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <Clock3 size={14} />
                Updated {formatArtifactTime(artifact.updatedAt)}
              </div>
            </div>

            <Link
              to="/library"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-5 py-3 text-sm text-[var(--text)] transition hover:border-[var(--accent)]"
            >
              Open library
            </Link>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {artifact.sections.map((section, index) => (
              <article
                key={section.id}
                className="rounded-[28px] border border-[var(--panel-border)] bg-[rgba(20,16,14,0.92)] p-5 shadow-[var(--shadow-md)]"
              >
                <div className="border-b border-[var(--panel-border)] pb-4">
                  <div className="flex items-center gap-3">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">
                      {section.kind}
                    </p>
                    <span className="rounded-full border border-[var(--panel-border)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">
                      {section.content.length} block
                      {section.content.length === 1 ? "" : "s"}
                    </span>
                    <span className="rounded-full border border-[var(--panel-border)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">
                      {index + 1}
                    </span>
                  </div>

                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--text)]">
                    {section.title}
                  </h2>

                  {section.tone ? (
                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                      Tone: {section.tone}
                    </p>
                  ) : null}
                </div>

                <div className="mt-4 space-y-3">
                  {section.content.map((line, lineIndex) => (
                    <div
                      key={`${section.id}-${lineIndex}`}
                      className="rounded-[20px] border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-sm leading-7 text-[var(--text-muted)]"
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
