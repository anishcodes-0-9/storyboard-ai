import type { StoryboardSection } from "../store/use-storyboard-store";

export function buildStoryboardMarkdown(params: {
  title: string;
  subtitle: string;
  templateLabel: string;
  sections: StoryboardSection[];
}) {
  const { title, subtitle, templateLabel, sections } = params;

  const lines: string[] = [
    `# ${title}`,
    "",
    `> ${subtitle}`,
    "",
    `Template: ${templateLabel}`,
    "",
  ];

  for (const section of sections) {
    lines.push(`## ${section.title}`);
    lines.push("");

    if (section.tone) {
      lines.push(`Tone: ${section.tone}`);
      lines.push("");
    }

    for (const block of section.content) {
      lines.push(`- ${block}`);
    }

    lines.push("");
  }

  return lines.join("\n").trim();
}
