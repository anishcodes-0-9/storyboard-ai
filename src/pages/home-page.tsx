import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Layers3, Sparkles, Wand2 } from "lucide-react";
import { motion } from "framer-motion";

import { useStoryboardStore } from "../store/use-storyboard-store";

const highlights = [
  {
    title: "Prompt to polished storyboard",
    description:
      "Turn a rough brief into a cinematic, presentation-ready narrative with strong hierarchy and pacing.",
    icon: Sparkles,
  },
  {
    title: "Editable by design",
    description:
      "Refine sections, adjust the story arc, and keep manual edits intact while iterating on AI output.",
    icon: Wand2,
  },
  {
    title: "Built for review",
    description:
      "Shape ideas into a format that feels ready to present, export, and hand off with confidence.",
    icon: Layers3,
  },
];

export function HomePage() {
  const artifacts = useStoryboardStore((state) => state.artifacts);

  return (
    <main className="relative overflow-hidden">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-12 pt-6 sm:px-8 sm:pt-8 lg:px-10">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--accent)] sm:text-xs sm:tracking-[0.35em]">
              Storyboard AI
            </p>
            <p className="mt-3 max-w-md text-sm leading-6 text-[var(--text-muted)]">
              AI-assisted story crafting for product pitches, launch plans, and
              structured presentation narratives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/library"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-5 py-3 text-sm text-[var(--text)] transition hover:border-[var(--accent)] hover:bg-[var(--panel-strong)]"
            >
              <BookOpen size={16} />
              Library
            </Link>
            <Link
              to="/editor"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-5 py-3 text-sm text-[var(--text)] transition hover:border-[var(--accent)] hover:bg-[var(--panel-strong)]"
            >
              Open editor
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.header>

        <section className="flex flex-1 items-center py-12 sm:py-16">
          <div className="grid w-full gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(224,176,122,0.2)] bg-[rgba(224,176,122,0.08)] px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-[var(--accent)] sm:text-xs sm:tracking-[0.24em]">
                Presentation-first frontend MVP
              </div>

              <h1 className="max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-[var(--text)] sm:text-6xl lg:text-7xl">
                Shape rough ideas into a storyboard that already feels
                pitch-ready.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--text-muted)] sm:text-lg sm:leading-8">
                Start from a single prompt, generate a clean narrative
                structure, and refine each section inside an interface designed
                to look as compelling as the output itself.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/editor"
                  className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--accent)_0%,var(--accent-strong)_100%)] px-6 py-3 text-sm font-medium text-[#1a120f] shadow-[var(--shadow-md)] transition hover:scale-[1.01]"
                >
                  Start creating
                  <ArrowRight size={16} />
                </Link>

                <a
                  href="#highlights"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-6 py-3 text-sm text-[var(--text)] transition hover:border-[var(--accent)] hover:bg-[var(--panel-strong)]"
                >
                  See product shape
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(224,176,122,0.2),transparent_56%)] blur-3xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-[var(--panel-border)] bg-[rgba(20,16,14,0.86)] p-4 shadow-[var(--shadow-lg)] backdrop-blur-xl sm:rounded-[32px] sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--panel-border)] pb-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] sm:tracking-[0.28em]">
                      Saved Artifacts
                    </p>
                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                      {artifacts.length > 0
                        ? `${artifacts.length} drafts in library`
                        : "No drafts yet"}
                    </h2>
                  </div>
                  <div className="rounded-full border border-[var(--panel-border)] px-3 py-1 text-[10px] text-[var(--text-muted)]">
                    Retrieval ready
                  </div>
                </div>

                <div className="space-y-4 py-5">
                  {artifacts.length === 0 ? (
                    <div className="rounded-[24px] border border-[var(--panel-border)] bg-[var(--panel)] p-4">
                      <p className="text-sm leading-7 text-[var(--text-muted)]">
                        Save artifacts from the editor to build a reusable
                        library you can come back to later.
                      </p>
                    </div>
                  ) : (
                    artifacts.slice(0, 3).map((artifact) => (
                      <div
                        key={artifact.id}
                        className="rounded-[24px] border border-[var(--panel-border)] bg-[var(--panel)] p-4"
                      >
                        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--accent)] sm:tracking-[0.24em]">
                          Artifact
                        </p>
                        <p className="mt-2 text-lg font-medium text-[var(--text)]">
                          {artifact.title}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                          {artifact.subtitle}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section
          id="highlights"
          className="grid gap-4 border-t border-[var(--panel-border)] pt-8 md:grid-cols-3"
        >
          {highlights.map(({ title, description, icon: Icon }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
              className="rounded-[28px] border border-[var(--panel-border)] bg-[var(--panel)] p-5 backdrop-blur-sm"
            >
              <div className="inline-flex rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
                <Icon size={18} />
              </div>
              <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em]">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                {description}
              </p>
            </motion.article>
          ))}
        </section>
      </div>
    </main>
  );
}
