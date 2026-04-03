"use client";

import { useState, useEffect, useCallback } from "react";
import { TrainingHeader } from "./training-header";
import { TrainingProgress } from "./training-progress";
import { Flashcard } from "./flashcard";
import { getWordsForTraining, updateWordStatus } from "@/app/actions/words";
import { Word } from "@/types";
import { WORD_STATUS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function TrainPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  const fetchWords = useCallback(async () => {
    setLoading(true);
    const result = await getWordsForTraining();
    if (result.success && result.data) {
      setWords(result.data);
      if (result.data.length === 0) {
        setCompleted(true);
      }
    } else {
      toast.error(result.error || "Помилка завантаження слів");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const [direction, setDirection] = useState<number>(0);

  const handleNext = async (know: boolean) => {
    const currentWord = words[currentIndex];
    setDirection(know ? 1 : -1);

    // Optimistically update DB progress if they know it
    if (know) {
      const nextStatus = currentWord.status === WORD_STATUS.NEW
        ? WORD_STATUS.LEARNING
        : WORD_STATUS.LEARNED;

      updateWordStatus(currentWord.id, nextStatus);
    }

    // Give a small delay for the animation to start before switching index
    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setIsFlipped(false);
        setCurrentIndex(prev => prev + 1);
      } else {
        setCompleted(true);
      }
    }, 50);
  };

  if (loading) {
    // ... lines 64-122 omitted for brevity, keeping the structure
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-12 py-8 w-full px-4 sm:px-5">
      <TrainingHeader />

      <TrainingProgress current={currentIndex + 1} total={words.length} />

      <div className="relative h-[480px] w-full flex items-center justify-center overflow-visible">
        {words
          .slice(currentIndex, currentIndex + 3)
          .map((word, index) => {
            const isTop = index === 0;
            const offset = index * 15; // зміщення вправо і вниз

            return (
              <motion.div
                key={word.id}
                initial={{ x: offset, y: offset, scale: 1 }}
                animate={{ x: offset, y: offset, scale: 1 }}
                exit={{
                  x: direction * 600,
                  rotate: direction * 45,
                  opacity: 0,
                  transition: { type: "spring", stiffness: 200, damping: 30 },
                }}
                className="absolute top-0 left-0 w-full"
                style={{ zIndex: 50 - index }}
              >
                <Flashcard
                  word={word}
                  isFlipped={isTop ? isFlipped : false}
                  onFlip={() => isTop && setIsFlipped(!isFlipped)}
                  onNext={handleNext}
                  isInteractive={isTop}
                />
              </motion.div>
            );
          })}
      </div>
    </div >
  );
}

