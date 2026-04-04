import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 8787;

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
      model: "gpt-5",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: "You generate polished storyboard artifacts for a frontend product. Return only valid JSON matching the requested schema. Keep the output concise, presentation-ready, and structured for editing.",
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

Prompt:
${prompt}

Return JSON with this shape:
{
  "artifactTitle": "string",
  "artifactSubtitle": "string",
  "sections": [
    {
      "id": "summary | pillars | roadmap | success",
      "title": "string",
      "kind": "summary | bullets | timeline | metrics",
      "tone": "string",
      "status": "ai",
      "content": ["string", "string"]
    }
  ]
}

Requirements:
- Exactly 4 sections with ids: summary, pillars, roadmap, success
- Keep each section to 2-3 content lines
- artifactSubtitle should mention the selected template
- Make the title feel presentation-ready, not generic
- Do not include markdown fences
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
                      minItems: 2,
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

app.listen(port, () => {
  console.log(`Storyboard API listening on http://localhost:${port}`);
});
