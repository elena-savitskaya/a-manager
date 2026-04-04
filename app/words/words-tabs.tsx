"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WordsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function WordsTabs({ activeTab, onTabChange }: WordsTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
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
  );
}
