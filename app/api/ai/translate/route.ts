import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { TranslationResultSchema } from "@/lib/schemas";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  const { word } = await request.json();

  if (!word || typeof word !== "string") {
    return Response.json({ error: "Word is required" }, { status: 400 });
  }

  try {
    const { object } = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: TranslationResultSchema,
      prompt: `Translate the English word "${word.trim()}" to Ukrainian and provide exactly 3 short example sentences in English with their Ukrainian translations.`,
    });

    return Response.json(object);
  } catch (err: unknown) {
    console.error("AI Error:", err);
    const status = (err as { statusCode?: number }).statusCode ?? 500;
    const message =
      status === 429
        ? "AI quota exceeded. Please check your Groq API limits."
        : "AI translation failed. Please try again later.";

    return Response.json({ error: message }, { status });
  }
}

