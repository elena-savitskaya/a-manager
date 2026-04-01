import { Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WordItem } from "./word-item";

export default async function WordsList() {
  const supabase = await createClient();

  const { data: words, error } = await supabase
    .from("words")
    .select("id, word, translation, examples, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="flex items-center justify-between pb-3">
        <p className="text-muted-foreground text-sm font-medium">
          {words?.length ?? 0} word{words?.length !== 1 ? "s" : ""} in vocabulary
        </p>
        <Button asChild variant="ghost" className="text-primary hover:bg-primary/5 font-bold rounded-xl text-sm">
          <Link href="/add-word">+ Додати слово</Link>
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive font-medium p-4 bg-destructive/10 rounded-2xl border border-destructive/20">
          Failed to load words: {error.message}
        </p>
      )}

      {!error && (!words || words.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-6 bg-muted/30 rounded-[2.5rem] border-2 border-dashed border-foreground/10 shadow-inner">
          <div className="p-8 rounded-full bg-background/50 shadow-sm ring-1 ring-foreground/5 animate-in fade-in zoom-in duration-700">
            <Inbox className="w-12 h-12 opacity-20 text-primary" />
          </div>
          <div className="space-y-2 px-6">
            <p className="text-2xl font-bold tracking-tight">Словник поки порожній</p>
            <p className="text-muted-foreground max-w-[300px] mx-auto">
              Додайте своє перше слово, щоб почати будувати власний інтелектуальний словник.
            </p>
          </div>
          <Button asChild size="lg" className="rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-bold">
            <Link href="/add-word">Додати перше слово</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {words?.map((item) => (
            <WordItem key={item.id} word={item} />
          ))}
        </div>
      )}
    </>
  );
}
