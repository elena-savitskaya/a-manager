import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  const { word } = await request.json();

  if (!word || typeof word !== "string") {
    return Response.json({ error: "Word is required" }, { status: 400 });
  }

  try {
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `Translate the English word "${word.trim()}" to Ukrainian and provide exactly 3 short example sentences in English.
Return ONLY valid JSON in this exact format, no other text:
{"translation": "Ukrainian word here", "examples": ["sentence 1", "sentence 2", "sentence 3"]}`,
    });

    const clean = text.trim().replace(/^```json\n?|```$/g, "").trim();
    const parsed = JSON.parse(clean);

    if (!parsed.translation || !Array.isArray(parsed.examples)) {
      throw new Error("Invalid AI response structure");
    }

    return Response.json({
      translation: parsed.translation,
      examples: parsed.examples.slice(0, 3),
    });
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode ?? 500;
    const message =
      status === 429
        ? "AI quota exceeded. Please check your Groq API limits."
        : "AI translation failed. Please try again later.";

    return Response.json({ error: message }, { status });
  }
}
