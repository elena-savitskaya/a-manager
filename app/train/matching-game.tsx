"use client";

import { useState, useEffect, useMemo, Fragment } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Word } from "@/types";
import { CheckCircle2 } from "lucide-react";

interface MatchingGameProps {
  words: Word[];
  onComplete: () => void;
}

interface Item {
  id: string;
  text: string;
  type: "word" | "translation";
  originalId: string;
}

export function MatchingGame({ words, onComplete }: MatchingGameProps) {
  const [selectedWord, setSelectedWord] = useState<Item | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState<Item | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set());

  // Prepare shuffled items
  const enItems = useMemo(() =>
    words.map(w => ({ id: `en-${w.id}`, text: w.word, type: "word" as const, originalId: w.id })),
    [words]
  );

  const uaItems = useMemo(() =>
    [...words]
      .sort(() => Math.random() - 0.5)
      .map(w => ({ id: `ua-${w.id}`, text: w.translation || "", type: "translation" as const, originalId: w.id })),
    [words]
  );

  useEffect(() => {
    if (matchedIds.size === words.length && words.length > 0) {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [matchedIds, words.length, onComplete]);

  const handleSelect = (item: Item) => {
    if (matchedIds.has(item.originalId)) return;
    if (errorIds.size > 0) return; // Prevent selection during error animation

    if (item.type === "word") {
      if (selectedWord?.id === item.id) {
        setSelectedWord(null);
        return;
      }
      setSelectedWord(item);
      if (selectedTranslation) {
        checkMatch(item, selectedTranslation);
      }
    } else {
      if (selectedTranslation?.id === item.id) {
        setSelectedTranslation(null);
        return;
      }
      setSelectedTranslation(item);
      if (selectedWord) {
        checkMatch(selectedWord, item);
      }
    }
  };

  const checkMatch = (wordItem: Item, transItem: Item) => {
    if (wordItem.originalId === transItem.originalId) {
      // Success
      setMatchedIds(prev => new Set(prev).add(wordItem.originalId));
      setSelectedWord(null);
      setSelectedTranslation(null);
    } else {
      // Error
      setErrorIds(new Set([wordItem.id, transItem.id]));
      setTimeout(() => {
        setErrorIds(new Set());
        setSelectedWord(null);
        setSelectedTranslation(null);
      }, 800);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3 w-full max-w-2xl mx-auto py-4">
      {Array.from({ length: words.length }).map((_, i) => (
        <Fragment key={i}>
          <MatchingCard
            item={enItems[i]}
            isSelected={selectedWord?.id === enItems[i].id}
            isMatched={matchedIds.has(enItems[i].originalId)}
            isError={errorIds.has(enItems[i].id)}
            onClick={() => handleSelect(enItems[i])}
          />
          <MatchingCard
            item={uaItems[i]}
            isSelected={selectedTranslation?.id === uaItems[i].id}
            isMatched={matchedIds.has(uaItems[i].originalId)}
            isError={errorIds.has(uaItems[i].id)}
            onClick={() => handleSelect(uaItems[i])}
          />
        </Fragment>
      ))}
    </div>
  );
}

function MatchingCard({
  item,
  isSelected,
  isMatched,
  isError,
  onClick
}: {
  item: Item;
  isSelected: boolean;
  isMatched: boolean;
  isError: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={!isMatched ? { scale: 1.02 } : {}}
      whileTap={!isMatched ? { scale: 0.98 } : {}}
      animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      <Card
        onClick={onClick}
        className={cn(
          "h-full relative py-4 flex items-center justify-center cursor-pointer transition-all duration-300 rounded-xl border-2 overflow-hidden",
          isSelected ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "border-muted/20 bg-card/50",
          isMatched ? "border-emerald-500 bg-emerald-500/10 cursor-default" : "hover:border-primary/50",
          isError ? "border-destructive bg-destructive/10" : ""
        )}
      >
        <span className={cn(
          "text-lg font-semibold px-2 text-center",
          isMatched ? "text-emerald-500 opacity-70" : "text-foreground"
        )}>
          {item.text}
        </span>
      </Card>
    </motion.div>
  );
}
