"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Inbox, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WordItem } from "./word-item";
import { getUkrainianPlural } from "@/lib/utils";
import { WORD_STATUS } from "@/lib/constants";

interface WordsListClientProps {
  initialWords: any[];
}

export function WordsListClient({ initialWords }: WordsListClientProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [isMounted, setIsMounted] = useState(false);

  // Load tab from localStorage on mount
  useEffect(() => {
    const savedTab = localStorage.getItem("words_active_tab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
    setIsMounted(true);
  }, []);

  // Update tab and save to localStorage
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem("words_active_tab", value);
  };

  if (!isMounted) {
    return <div className="h-[200px]" />; // Placeholder to avoid layout shift
  }

  const filteredWords = initialWords.filter((word) => {
    if (activeTab === "processing") {
      return word.status !== WORD_STATUS.LEARNED;
    }
    if (activeTab === "learned") {
      return word.status === WORD_STATUS.LEARNED;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-4">
          <p className="text-muted-foreground text-sm font-medium">
            {(() => {
              const count = filteredWords.length;
              const wordLabel = getUkrainianPlural(count, ["слово", "слова", "слів"]);
              const statusLabel =
                activeTab === "processing" ? " у процесі" :
                  activeTab === "learned" ? " вивчено" : "";
              return `${count} ${wordLabel}${statusLabel}`;
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

        <div className="px-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full h-12 p-1 bg-muted/60 dark:bg-muted/40 backdrop-blur-md rounded-2xl border border-foreground/10 dark:border-foreground/5 overflow-hidden shadow-sm">
              <TabsTrigger
                value="all"
                className="flex-1 h-full rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all"
              >
                Всі
              </TabsTrigger>
              <TabsTrigger
                value="processing"
                className="flex-1 h-full rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all"
              >
                В процесі
              </TabsTrigger>
              <TabsTrigger
                value="learned"
                className="flex-1 h-full rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all"
              >
                Вивчено
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="space-y-3">
        {filteredWords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-6 bg-muted/30 rounded-[2.5rem] border-2 border-dashed border-foreground/10 shadow-inner">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-background/50 shadow-sm ring-1 ring-foreground/5 uppercase">
              <Inbox className="w-6 h-6 opacity-40 text-primary" />
            </div>
            <div className="space-y-2 px-6">
              <p className="text-xl font-bold tracking-tight">Слів не знайдено</p>
              <p className="text-muted-foreground max-w-[300px] mx-auto text-sm">
                У категорії &quot;{
                  activeTab === "processing" ? "В процесі" :
                    activeTab === "learned" ? "Вивчено" : "Всі"
                }&quot; поки що немає жодного слова.
              </p>
            </div>
            {activeTab === "all" && (
              <Button asChild size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-bold">
                <Link href="/add-word">Додати перше слово</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredWords.map((item) => (
              <WordItem key={item.id} word={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
