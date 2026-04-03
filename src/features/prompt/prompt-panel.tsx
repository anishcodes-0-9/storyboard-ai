import { FileText, Sparkles, Wand2 } from "lucide-react";

import { Sidebar } from "../../components/layout/sidebar";
import { cn } from "../../lib/utils";
import { useStoryboardStore } from "../../store/use-storyboard-store";

const templates = [
  {
    id: "launch-brief",
    label: "Launch brief",
    description: "Best for product launches and rollout plans.",
  },
  {
    id: "product-strategy",
    label: "Product strategy",
    description: "Best for roadmap, priorities, and strategic direction.",
  },
  {
    id: "exec-summary",
    label: "Executive summary",
    description: "Best for concise decision-ready overviews.",
  },
] as const;

export function PromptPanel() {
  const { prompt, setPrompt, activeTemplate, setTemplate, lastSavedLabel } =
    useStoryboardStore();

  return (
    <Sidebar eyebrow="Input" title="Prompt Composer" className="h-full">
      <div className="space-y-5">
        <div className="rounded-[24px] border border-[var(--panel-border)] bg-[var(--panel)] p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--text)]">
              Source prompt
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(141,208,165,0.12)] px-3 py-1 text-xs text-[var(--success)]">
              <Sparkles size={14} />
              {lastSavedLabel}
            </div>
          </div>

          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={10}
            className="mt-4 w-full resize-none rounded-[20px] border border-[var(--panel-border)] bg-[rgba(255,248,238,0.03)] px-4 py-4 text-sm leading-7 text-[var(--text)] outline-none transition placeholder:text-[var(--text-faint)] focus:border-[var(--accent)]"
            placeholder="Describe the story you want to turn into a polished artifact..."
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--accent)_0%,var(--accent-strong)_100%)] px-4 py-3 text-sm font-medium text-[#1b130f] transition hover:scale-[1.01]">
              <Wand2 size={16} />
              Generate storyboard
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--text)] transition hover:border-[var(--accent)]">
              <FileText size={16} />
              Save snapshot
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-[var(--text)]">Templates</p>
          <div className="mt-3 space-y-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setTemplate(template.id)}
                className={cn(
                  "w-full rounded-[22px] border p-4 text-left transition",
                  activeTemplate === template.id
                    ? "border-[rgba(224,176,122,0.4)] bg-[rgba(224,176,122,0.12)]"
                    : "border-[var(--panel-border)] bg-[var(--panel)] hover:border-[var(--accent)]",
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--text)]">
                    {template.label}
                  </p>
                  <span className="rounded-full border border-[var(--panel-border)] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                    {activeTemplate === template.id ? "Active" : "Template"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
