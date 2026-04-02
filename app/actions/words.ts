"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { WordFormSchema, TranslationResultSchema } from "@/lib/schemas";
import { redirect } from "next/navigation";
import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export type ActionState = {
  error?: string;
  success?: boolean;
  data?: unknown;
};

export async function translateWordAction(word: string): Promise<ActionState> {
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
      return { error: object.error_message };
    }

    const validated = TranslationResultSchema.parse(object);
    return { success: true, data: validated };
  } catch (err: unknown) {
    console.error("AI Error:", err);
    if (err instanceof SyntaxError || (err as Error).message.includes("invalid response")) {
      return { error: "Не вдалося розпізнати переклад. Спробуйте інше слово." };
    }
    return { error: "AI translation failed. Please try again later." };
  }
}

export async function addWordAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const word = formData.get("word") as string;
  const translation = formData.get("translation") as string;
  const examplesJson = formData.get("examples") as string;

  // Validate input
  const wordValidation = WordFormSchema.safeParse({ word });
  if (!wordValidation.success) {
    return { error: "Некоректне слово" };
  }

  let examples;
  try {
    examples = JSON.parse(examplesJson);
    const translationValidation = TranslationResultSchema.safeParse({ translation, examples });
    if (!translationValidation.success) {
      return { error: "Некоректні дані перекладу" };
    }
  } catch {
    return { error: "Помилка обробки прикладів" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Необхідна авторизація" };
  }

  // Check for duplicate
  const { data: existing } = await supabase
    .from("words")
    .select("id")
    .eq("user_id", user.id)
    .ilike("word", word.trim())
    .maybeSingle();

  if (existing) {
    return { error: `Слово "${word.trim()}" вже є у вашому словнику.` };
  }

  const { error: dbError } = await supabase.from("words").insert({
    user_id: user.id,
    word: word.trim(),
    translation,
    examples,
    status: "new",
  });

  if (dbError) {
    console.error("DB Error:", dbError);
    return { error: "Помилка збереження в базу даних" };
  }

  revalidatePath("/words");
  redirect("/words");
}

export async function updateWordAction(id: string, updates: { translation?: string; examples?: unknown; status?: string }) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("words")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Error updating word:", error);
    return { error: error.message };
  }

  revalidatePath("/words");
  return { success: true };
}

export async function deleteWordAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("words")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting word:", error);
    return { error: error.message };
  }

  revalidatePath("/words");
  return { success: true };
}
