import type { ReactNode } from "react";

import { SiteHeader } from "./site-header";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
