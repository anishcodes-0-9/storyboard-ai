import { AppShell } from "../components/layout/app-shell";
import { HistoryPanel } from "../features/history/history-panel";
import { PromptPanel } from "../features/prompt/prompt-panel";
import { StoryboardCanvas } from "../features/storyboard/storyboard-canvas";

export function EditorPage() {
  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)_300px]">
        <PromptPanel />
        <StoryboardCanvas />
        <HistoryPanel />
      </div>
    </AppShell>
  );
}
