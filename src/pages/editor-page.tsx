import { AppShell } from "../components/layout/app-shell";
import { HistoryPanel } from "../features/history/history-panel";
import { PromptPanel } from "../features/prompt/prompt-panel";
import { StoryboardCanvas } from "../features/storyboard/storyboard-canvas";

export function EditorPage() {
  return (
    <AppShell>
      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)_320px]">
        <PromptPanel />
        <StoryboardCanvas />
        <HistoryPanel />
      </div>
    </AppShell>
  );
}
