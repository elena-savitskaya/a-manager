import { createClient } from "@/lib/supabase/server";
import { WordsListClient } from "./words-list-client";

export default async function WordsList() {
  const supabase = await createClient();

  const { data: words, error } = await supabase
    .from("words")
    .select("id, word, translation, examples, status, created_at, progress")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p className="text-sm text-destructive font-medium p-4 bg-destructive/10 rounded-2xl border border-destructive/20">
        Не вдалося завантажити слова: {error.message}
      </p>
    );
  }

  return <WordsListClient initialWords={words || []} />;
}
