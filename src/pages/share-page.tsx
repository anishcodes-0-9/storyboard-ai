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
          <div className="rounded-[28px] border border-[var(--panel-border)] bg-[rgba(16,12,11,0.82)] p-6 text-center shadow-[var(--shadow-lg)] backdrop-blur-xl sm:rounded-[32px] sm:p-8">
            <div className="mx-auto inline-flex rounded-2xl bg-[rgba(240,139,125,0.12)] p-4 text-[var(--danger)]">
              <FileWarning size={20} />
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[var(--text)] sm:text-3xl">
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
        <div className="rounded-[28px] border border-[var(--panel-border)] bg-[rgba(16,12,11,0.82)] p-4 shadow-[var(--shadow-lg)] backdrop-blur-xl sm:rounded-[32px] sm:p-6">
          <div className="flex flex-col gap-4 border-b border-[var(--panel-border)] pb-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--accent)]">
                Shared Artifact
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-4xl">
                {artifact.title}
              </h1>
              <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full border border-[rgba(224,176,122,0.18)] bg-[rgba(224,176,122,0.08)] px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--accent)] sm:text-xs sm:tracking-[0.18em]">
                <Share2 size={14} className="shrink-0" />
                <span className="truncate">{artifact.subtitle}</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <Clock3 size={14} />
                Updated {formatArtifactTime(artifact.updatedAt)}
              </div>
            </div>

            <Link
              to="/library"
              className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-5 py-3 text-sm text-[var(--text)] transition hover:border-[var(--accent)]"
            >
              Open library
            </Link>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {artifact.sections.map((section, index) => (
              <article
                key={section.id}
                className="rounded-[24px] border border-[var(--panel-border)] bg-[rgba(20,16,14,0.92)] p-4 shadow-[var(--shadow-md)] sm:rounded-[28px] sm:p-5"
              >
                <div className="border-b border-[var(--panel-border)] pb-4">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] sm:tracking-[0.3em]">
                      {section.kind}
                    </p>
                    <span className="rounded-full border border-[var(--panel-border)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)] sm:tracking-[0.2em]">
                      {section.content.length} block
                      {section.content.length === 1 ? "" : "s"}
                    </span>
                    <span className="rounded-full border border-[var(--panel-border)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)] sm:tracking-[0.2em]">
                      {index + 1}
                    </span>
                  </div>

                  <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[var(--text)] sm:text-2xl">
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
                      className="rounded-[18px] border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-sm leading-7 text-[var(--text-muted)] sm:rounded-[20px]"
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
