import { Link, useLocation } from "react-router-dom";
import { LayoutTemplate, Sparkles } from "lucide-react";

export function SiteHeader() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--panel-border)] bg-[rgba(10,8,8,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0 flex items-center gap-3">
          <Link
            to="/"
            aria-label="Go to home page"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[rgba(224,176,122,0.18)] bg-[rgba(224,176,122,0.08)] text-[var(--accent)] transition hover:border-[var(--accent)]"
          >
            <LayoutTemplate size={18} />
          </Link>

          <div className="min-w-0">
            <Link
              to="/"
              className="block text-[11px] uppercase tracking-[0.32em] text-[var(--accent)] sm:text-xs sm:tracking-[0.35em]"
            >
              Storyboard AI
            </Link>
            <p className="mt-1 max-w-[14rem] text-xs leading-5 text-[var(--text-muted)] sm:max-w-none sm:text-sm">
              Build narrative artifacts that feel ready to review.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end md:flex">
          <div className="rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] sm:px-4 sm:text-xs sm:tracking-[0.24em]">
            {location.pathname === "/editor" ? "Editor mode" : "Overview"}
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(224,176,122,0.12)] px-3 py-2 text-xs text-[var(--accent)] sm:px-4 sm:text-sm">
            <Sparkles size={15} />
            Frontend-first build
          </div>
        </div>
      </div>
    </header>
  );
}
