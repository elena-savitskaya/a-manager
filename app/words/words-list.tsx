import Link from "next/link";
import { Inbox, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { WordItem } from "./word-item";
import { getUkrainianPlural } from "@/lib/utils";

export default async function WordsList() {
  const supabase = await createClient();

  const { data: words, error } = await supabase
    .from("words")
    .select("id, word, translation, examples, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <p className="text-muted-foreground text-sm font-medium">
          {(() => {
            const count = words?.length ?? 0;
            const wordLabel = getUkrainianPlural(count, ["слово", "слова", "слів"]);
            return `${count} ${wordLabel} у словнику`;
          })()}
        </p>
        <Button
          asChild
          variant="ghost"
          className="w-12 h-12 rounded-full p-0 bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 group"
        >
          <Link href="/add-word">
            <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </Link>
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive font-medium p-4 bg-destructive/10 rounded-2xl border border-destructive/20">
          Не вдалося завантажити слова: {error.message}
        </p>
      )}

      {!error && (!words || words.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-6 bg-muted/30 rounded-[2.5rem] border-2 border-dashed border-foreground/10 shadow-inner">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-background/50 shadow-sm ring-1 ring-foreground/5 animate-in fade-in zoom-in duration-700 uppercase">
            <Inbox className="w-6 h-6 opacity-40 text-primary" />
          </div>
          <div className="space-y-2 px-6">
            <p className="text-2xl font-bold tracking-tight">Словник поки порожній</p>
            <p className="text-muted-foreground max-w-[300px] mx-auto">
              Додайте своє перше слово, щоб почати будувати власний інтелектуальний словник.
            </p>
          </div>
          <Button asChild size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-bold">
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
