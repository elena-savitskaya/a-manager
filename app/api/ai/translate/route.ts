import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
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
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `Task: Translate the input "${word.trim()}" to Ukrainian.
      
      CRITICAL INSTRUCTIONS:
      1. LANGUAGE & CHARACTER CHECK: If the input contains NON-LATIN characters or is NOT in English, return:
         { "error_message": "Будь ласка, вводьте слова лише англійською мовою." }
      
      2. TYPO DETECTION: If there are obvious typos (e.g., "flowwwwww"), identify the correct English word.
      
      3. VALIDATE: If the input is clearly NOT a valid English word even after correction, return:
         { "error_message": "Це не схоже на коректне англійське слово або фразу." }
      
      4. QUALITY TRANSLATION: Provide a natural, literary, and modern Ukrainian translation. Avoid robotic or literal translations that don't make sense (e.g., don't use 'похід' for 'go' commands).
      
      5. SENTENCE RULES: 
         - Each example sentence MUST contain the English word being translated (or its corrected form).
         - Ukrainian translations of these sentences must be grammatically perfect and natural-sounding.
      
      6. RESPONSE STRUCTURE: Return ONLY a JSON:
         {
           "translation": "natural Ukrainian translation",
           "correctedWord": "the corrected word if applicable",
           "examples": [
             {"en": "Sentence containing the word", "ua": "Natural Ukrainian translation"},
             {"en": "Another sentence", "ua": "Natural translation"},
             {"en": "Third sentence", "ua": "Natural translation"}
           ]
         }
      
      Do not include any other text or explanations.`,
    });

    // Robust JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI returned invalid response format");
    }

    const object = JSON.parse(jsonMatch[0]);

    // Check if AI detected nonsense or wrong language
    if (object.error_message) {
      return Response.json({ error: object.error_message }, { status: 400 });
    }

    const validated = TranslationResultSchema.parse(object);
    return Response.json(validated);
  } catch (err: unknown) {
    console.error("AI Error:", err);
    let status = 500;
    let message = "AI translation failed. Please try again later.";

    if (err instanceof SyntaxError || (err as Error).message.includes("invalid response")) {
      message = "Не вдалося розпізнати переклад. Спробуйте інше слово.";
      status = 400;
    } else if ((err as any).statusCode) {
      status = (err as any).statusCode;
      if (status === 429) message = "AI quota exceeded.";
    }

    return Response.json({ error: message }, { status });
  }
}

