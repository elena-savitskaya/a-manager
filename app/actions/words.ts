"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { WordFormSchema, TranslationResultSchema } from "@/lib/schemas";
import { redirect } from "next/navigation";
import { generateObject } from "ai";
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
    const { object } = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: TranslationResultSchema,
      prompt: `Translate the English word "${word.trim()}" to Ukrainian and provide exactly 3 short example sentences in English with their Ukrainian translations.`,
    });

    return { success: true, data: object };
  } catch (err: unknown) {
    console.error("AI Error:", err);
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
