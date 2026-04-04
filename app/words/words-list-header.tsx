"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUkrainianPlural } from "@/lib/utils";

interface WordsListHeaderProps {
  count: number;
  activeTab: string;
}

export function WordsListHeader({ count, activeTab }: WordsListHeaderProps) {
  const wordLabel = getUkrainianPlural(count, ["слово", "слова", "слів"]);
  const statusLabel =
    activeTab === "processing" ? " у процесі" :
      activeTab === "learned" ? " вивчено" : "";

  return (
    <div className="flex items-center justify-between px-4">
      <p className="text-muted-foreground text-sm font-medium">
        {count} {wordLabel}{statusLabel}
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
  );
}
