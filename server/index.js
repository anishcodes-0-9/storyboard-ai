import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = process.env.PORT || 8787;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../dist");

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/generate-storyboard", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Missing OPENAI_API_KEY in server environment.",
      });
    }

    const { prompt, template } = req.body ?? {};

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return badRequest(res, "Prompt is required.");
    }

    const templateLabelMap = {
      "launch-brief": "Launch Brief",
      "product-strategy": "Product Strategy",
      "exec-summary": "Executive Summary",
    };

    const templateLabel =
      templateLabelMap[template] ?? templateLabelMap["launch-brief"];

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: "Return only valid JSON matching the schema. Write concise, presentation-ready storyboard content.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
Template: ${templateLabel}
Prompt: ${prompt}

Return:
- artifactTitle: presentation-ready title
- artifactSubtitle: mention selected template
- sections: exactly 4 items with ids summary, pillars, roadmap, success
- each section: 2-3 short content lines
- no markdown fences
              `.trim(),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "storyboard_artifact",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              artifactTitle: { type: "string" },
              artifactSubtitle: { type: "string" },
              sections: {
                type: "array",
                minItems: 4,
                maxItems: 4,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    id: {
                      type: "string",
                      enum: ["summary", "pillars", "roadmap", "success"],
                    },
                    title: { type: "string" },
                    kind: {
                      type: "string",
                      enum: ["summary", "bullets", "timeline", "metrics"],
                    },
                    tone: { type: "string" },
                    status: {
                      type: "string",
                      enum: ["ai"],
                    },
                    content: {
                      type: "array",
                      minItems: 1,
                      maxItems: 3,
                      items: { type: "string" },
                    },
                  },
                  required: [
                    "id",
                    "title",
                    "kind",
                    "tone",
                    "status",
                    "content",
                  ],
                },
              },
            },
            required: ["artifactTitle", "artifactSubtitle", "sections"],
          },
        },
      },
    });

    const payload = JSON.parse(response.output_text);

    res.json(payload);
  } catch (error) {
    console.error("Storyboard generation failed:", error);

    res.status(500).json({
      error: "Generation failed. Please try again.",
    });
  }
});

app.use(express.static(distPath));

app.get("/*splat", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Storyboard API listening on http://0.0.0.0:${port}`);
});
