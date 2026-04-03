export function EditorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="rounded-[28px] border border-[var(--panel-border)] bg-[var(--panel)] px-8 py-10 text-center shadow-[var(--shadow-md)] backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">
          Editor
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--text)]">
          Storyboard workspace coming next
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--text-muted)]">
          We are setting up the product shell first so the editor can land
          inside a stronger visual system instead of feeling like a default
          scaffold.
        </p>
      </div>
    </main>
  );
}
