"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateWord(id: string, updates: { translation?: string; examples?: any; status?: string }) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("words")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Error updating word:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/words");
  return { success: true };
}

export async function deleteWord(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("words")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting word:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/words");
  return { success: true };
}
