"use client";

import Link from "next/link";
import { Plus, ArrowUpDown, Calendar, ArrowDownAZ, ArrowUpZA } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUkrainianPlural } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WordsListHeaderProps {
  count: number;
  activeTab: string;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function WordsListHeader({ count, activeTab, sortBy, onSortChange }: WordsListHeaderProps) {
  const wordLabel = getUkrainianPlural(count, ["слово", "слова", "слів"]);
  const statusLabel =
    activeTab === "processing" ? " у процесі" :
      activeTab === "learned" ? " вивчено" : "";

  const sortOptions = [
    { value: "newest", label: "Спочатку нові", icon: Calendar },
    { value: "oldest", label: "Спочатку старі", icon: Calendar },
    { value: "az", label: "A-Z", icon: ArrowDownAZ },
    { value: "za", label: "Z-A", icon: ArrowUpZA },
  ];

  const currentSort = sortOptions.find(opt => opt.value === sortBy) || sortOptions[0];

  return (
    <div className="flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <p className="text-muted-foreground text-sm font-medium whitespace-nowrap">
          {count} {wordLabel}{statusLabel}
        </p>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-full hover:bg-primary/10 text-muted-foreground/70 hover:text-primary transition-all active:scale-95"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={6} alignOffset={0} className="w-56 rounded-2xl border border-foreground/10 dark:border-none shadow-xl bg-background/95 backdrop-blur-xl p-1.5 ring-1 ring-foreground/10 dark:ring-foreground/5">
            <div className="px-3 py-2 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
              Сортування
            </div>
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className="gap-3 py-3 px-4 focus:bg-primary/5 focus:text-primary rounded-xl cursor-pointer transition-all duration-200 font-medium"
              >
                <option.icon className="w-5 h-5 opacity-60" />
                <span className={sortBy === option.value ? "text-primary font-bold" : ""}>
                  {option.label}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
