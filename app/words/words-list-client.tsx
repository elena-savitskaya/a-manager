"use client";

import { useState, useEffect, useMemo } from "react";
import { WordItem } from "./word-item";
import { WORD_STATUS } from "@/lib/constants";
import { WordsListHeader } from "./words-list-header";
import { WordsTabs } from "./words-tabs";
import { WordsEmptyState } from "./words-empty-state";

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

  // Memoized counts for performance
  const counts = useMemo(() => ({
    all: initialWords.length,
    processing: initialWords.filter(w => w.status !== WORD_STATUS.LEARNED).length,
    learned: initialWords.filter(w => w.status === WORD_STATUS.LEARNED).length,
  }), [initialWords]);

  // Memoized filtering
  const filteredWords = useMemo(() => {
    return initialWords.filter((word) => {
      if (activeTab === "processing") {
        return word.status !== WORD_STATUS.LEARNED;
      }
      if (activeTab === "learned") {
        return word.status === WORD_STATUS.LEARNED;
      }
      return true;
    });
  }, [initialWords, activeTab]);

  if (!isMounted) {
    return <div className="h-[200px]" />; // Placeholder to avoid layout shift
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <WordsListHeader 
          count={filteredWords.length} 
          activeTab={activeTab} 
        />
        
        <WordsTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />
      </div>

      <div className="space-y-3">
        {filteredWords.length === 0 ? (
          <WordsEmptyState activeTab={activeTab} />
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
