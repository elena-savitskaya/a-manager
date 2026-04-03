import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { TranslationResultSchema } from "@/lib/schemas";
import { z } from "zod";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export type TranslationResponse = z.infer<typeof TranslationResultSchema>;

export class AIService {
  static async translateWord(word: string): Promise<{ data?: TranslationResponse; error?: string }> {
    if (!word || typeof word !== "string") {
      return { error: "Word is required" };
    }

    try {
      const { text } = await generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt: `Task: Translate the input "${word.trim()}" to Ukrainian.
        
        CRITICAL INSTRUCTIONS:
        1. LANGUAGE & CHARACTER CHECK: If the input contains NON-LATIN characters or is NOT in English, return:
           { "error_message": "Будь ласка, вводьте слова лише англійською мовою." }
        
        2. TYPO DETECTION: If there are obvious spelling errors (e.g., "flowwwwww"), identify the correct English word. 
        
        4. PROFESSIONAL DICTIONARY TRANSLATION: Act as a high-quality professional dictionary (like Google Translate, Oxford, or Cambridge). 
           - Provide the most common, direct, and natural Ukrainian translation for the given word or phrase.
           - For phrases (like "get ready"), provide the natural Ukrainian equivalent (e.g., "готуватися"), not a literal word-for-word translation.
           - If a word has multiple common meanings, provide the most frequent one or a couple of synonymous translations separated by commas.
           - Avoid robotic, overly formal, or "AI-style" explanations.
        
        5. VALIDATE: If the input is clearly NOT any recognizable English word or phrase even after correcting spelling, return:
           { "error_message": "Це не схоже на коректне англійське слово або фразу." }
        
        6. SENTENCE RULES: 
           - Each example sentence MUST contain the English word or EXACT phrase being translated.
           - Sentences must be idiomatic, useful for learners, and show the word in a clear context.
           - Ukrainian translations of these sentences must be natural and literary.
        
        7. RESPONSE STRUCTURE: Return ONLY a JSON:
           {
             "translation": "direct natural Ukrainian translation",
             "correctedWord": "the corrected spelling if applicable",
             "examples": [
               {"en": "Example 1", "ua": "UA Translation 1"},
               {"en": "Example 2", "ua": "UA Translation 2"},
               {"en": "Example 3", "ua": "UA Translation 3"}
             ]
           }
        
        Do not include text like 'Here is the JSON' or explanations.`,
      });

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
         throw new Error("AI returned invalid response format");
      }

      const object = JSON.parse(jsonMatch[0]);

      if (object.error_message) {
        return { error: object.error_message };
      }

      const validated = TranslationResultSchema.parse(object);
      return { data: validated };
    } catch (err: unknown) {
      console.error("AIService Error:", err);
      if (err instanceof SyntaxError || (err as Error).message.includes("invalid response")) {
        return { error: "Не вдалося отримати коректний переклад. Спробуйте інше слово." };
      }
      return { error: "Помилка роботи штучного інтелекту. Спробуйте ще раз пізніше." };
    }
  }
}
