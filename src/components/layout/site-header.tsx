import { Link, useLocation } from "react-router-dom";
import { LayoutTemplate, Sparkles } from "lucide-react";

export function SiteHeader() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--panel-border)] bg-[rgba(10,8,8,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            aria-label="Go to home page"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(224,176,122,0.18)] bg-[rgba(224,176,122,0.08)] text-[var(--accent)] transition hover:border-[var(--accent)]"
          >
            <LayoutTemplate size={18} />
          </Link>

          <div>
            <Link
              to="/"
              className="text-xs uppercase tracking-[0.35em] text-[var(--accent)]"
            >
              Storyboard AI
            </Link>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Build narrative artifacts that feel ready to review.
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
            {location.pathname === "/editor" ? "Editor mode" : "Overview"}
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(224,176,122,0.12)] px-4 py-2 text-sm text-[var(--accent)]">
            <Sparkles size={15} />
            Frontend-first build
          </div>
        </div>
      </div>
    </header>
  );
}
