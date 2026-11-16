import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const MODE_INSTRUCTIONS: Record<string, string> = {
  explain:
    "Break down the concept step-by-step from first principles. Use crisp headings, a concrete analogy or worked example, and end with one short self-check question.",
  socratic:
    "Act as a Socratic study coach. Do not dump the full final answer immediately—ask guiding questions, point out the key intuition, and help the student reason through the next step.",
  debug:
    "Inspect the student's code or problem attempt carefully. Identify the root cause, explain why it happens, and show a clean corrected approach with brief reasoning.",
  "quiz-me":
    "Give the student a concise practice challenge or worked scenario on their topic, wait for their reasoning, or evaluate their attempt constructively.",
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "12mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { messages, mode = "explain", goalTitle } = req.body ?? {};
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error:
            "AI Study Partner is waiting for GEMINI_API_KEY in Settings > Secrets. Add your key to enable live responses.",
        });
      }

      const modeGuide = MODE_INSTRUCTIONS[mode] || MODE_INSTRUCTIONS.explain;
      const goalContext = goalTitle
        ? `The student is currently studying: "${goalTitle}". Tailor examples to this subject when relevant.`
        : "";

      const systemInstruction = [
        "You are SeedIQ, a personal AI study partner inside a student's distraction-free notebook and desk.",
        modeGuide,
        goalContext,
        "Keep formatting clean and scannable (short paragraphs, numbered steps, clear code blocks if needed). Avoid fluff.",
      ]
        .filter(Boolean)
        .join(" ");

      const contents = messages
        .filter((m: { role?: string }) => m.role === "user" || m.role === "assistant")
        .map((m: { role: string; content: string; image?: string }) => {
          const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];
          if (m.image && typeof m.image === "string" && m.image.startsWith("data:")) {
            const match = m.image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
            if (match) {
              parts.push({
                inlineData: {
                  mimeType: match[1],
                  data: match[2],
                },
              });
            }
          }
          parts.push({ text: m.content || "Please analyze this image." });
          return {
            role: m.role === "assistant" ? "model" : "user",
            parts,
          };
        });

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents,
        config: {
          systemInstruction,
        },
      });

      const text = response.text?.trim() || "I couldn't generate a response. Please try rephrasing.";
      return res.json({ text });
    } catch (error) {
      console.error("Error in /api/ai/chat:", error);
      const message = error instanceof Error ? error.message : "Failed to reach AI Study Partner.";
      return res.status(500).json({ error: message });
    }
  });

  app.post("/api/ai/quiz", async (req, res) => {
    try {
      const { topic, count = 4 } = req.body ?? {};
      if (!topic || typeof topic !== "string") {
        return res.status(400).json({ error: "Topic is required." });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: "GEMINI_API_KEY is not configured in Settings > Secrets.",
        });
      }

      const safeCount = Math.min(Math.max(Number(count) || 4, 2), 6);
      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: `Create ${safeCount} clear, conceptual multiple-choice study questions for a learner studying "${topic}". Each question should test understanding rather than trivia, have 4 options, 1 correct index (0-3), and a concise 1-2 sentence explanation.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ["question", "options", "correctIndex", "explanation"],
            },
          },
        },
      });

      const raw = (response.text ?? "[]").trim();
      const parsed = JSON.parse(raw);
      return res.json({ questions: Array.isArray(parsed) ? parsed : [] });
    } catch (error) {
      console.error("Error in /api/ai/quiz:", error);
      const message = error instanceof Error ? error.message : "Failed to generate quiz.";
      return res.status(500).json({ error: message });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SeedIQ Study Space running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
