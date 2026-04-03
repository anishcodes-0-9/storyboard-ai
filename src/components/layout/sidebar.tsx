import type { ReactNode } from "react";

import { cn } from "../../lib/utils";

type SidebarProps = {
  title: string;
  eyebrow: string;
  children: ReactNode;
  className?: string;
};

export function Sidebar({ title, eyebrow, children, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "rounded-[28px] border border-[var(--panel-border)] bg-[rgba(19,16,14,0.86)] p-5 shadow-[var(--shadow-md)] backdrop-blur-xl",
        className,
      )}
    >
      <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--accent)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[var(--text)]">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </aside>
  );
}
