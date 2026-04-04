"use client";

import Link from "next/link";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WordsEmptyStateProps {
  activeTab: string;
}

export function WordsEmptyState({ activeTab }: WordsEmptyStateProps) {
  const statusLabel =
    activeTab === "processing" ? "В процесі" :
      activeTab === "learned" ? "Вивчено" : "Всі";

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-6 bg-muted/30 rounded-[2.5rem] border-2 border-dashed border-foreground/10 shadow-inner">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-background/50 shadow-sm ring-1 ring-foreground/5 uppercase">
        <Inbox className="w-6 h-6 opacity-40 text-primary" />
      </div>
      <div className="space-y-2 px-6">
        <p className="text-xl font-bold tracking-tight">Слів не знайдено</p>
        <p className="text-muted-foreground max-w-[300px] mx-auto text-sm">
          У категорії &quot;{statusLabel}&quot; поки що немає жодного слова.
        </p>
      </div>
      {activeTab === "all" && (
        <Button asChild size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-bold">
          <Link href="/add-word">Додати перше слово</Link>
        </Button>
      )}
    </div>
  );
}
