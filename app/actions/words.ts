"use server";

import { revalidatePath } from "next/cache";
import { WordFormSchema, TranslationResultSchema } from "@/lib/schemas";
import { redirect } from "next/navigation";
import { AIService } from "@/lib/services/ai-service";
import { ActionState } from "@/types";
import { getRequiredServerUser } from "@/lib/utils/get-required-server-user";
import { WORD_STATUS } from "@/lib/constants";

export async function translateWordAction(word: string): Promise<ActionState> {
  const { data, error } = await AIService.translateWord(word);

  if (error) {
    return { error };
  }

  return { success: true, data };
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

  const { user, supabase } = await getRequiredServerUser();

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
    status: WORD_STATUS.NEW,
  });

  if (dbError) {
    console.error("DB Error:", dbError);
    return { error: "Помилка збереження в базу даних" };
  }

  revalidatePath("/words");
  redirect("/words");
}

export async function updateWordAction(id: string, updates: { translation?: string; examples?: unknown; status?: string }) {
  const { supabase } = await getRequiredServerUser();

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
  const { supabase } = await getRequiredServerUser();

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

export async function getWordsForTraining(): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    const { user, supabase } = await getRequiredServerUser();
    if (!user) return { success: false, error: "Необхідна авторизація" };

    const { data, error } = await supabase
      .from("words")
      .select("*")
      .eq("user_id", user.id)
      .neq("status", WORD_STATUS.LEARNED)
      .limit(20);

    if (error) throw error;
    if (!data || data.length === 0) {
      return { success: true, data: [] };
    }

    const shuffled = [...data].sort(() => 0.5 - Math.random()).slice(0, 6);

    return { success: true, data: shuffled };
  } catch (error: any) {
    console.error("Error fetching training words:", error);
    return { success: false, error: error.message };
  }
}

export async function updateWordStatus(id: string, status: string) {
  const { supabase } = await getRequiredServerUser();

  const { error } = await supabase
    .from("words")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error updating word status:", error);
    return { error: error.message };
  }

  revalidatePath("/words");
  revalidatePath("/train");
  revalidatePath("/");
  return { success: true };
}
