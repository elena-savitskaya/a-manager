"use client";

import { Word } from "@/types";
import { useState, useCallback, useEffect } from "react";
import { TrainingProgress } from "./training-progress";
import { Flashcard } from "./flashcard";
import { updateWordStatus } from "@/app/actions/words";
import { WORD_STATUS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { MatchingGame } from "./matching-game";
import { Button } from "@/components/ui/button";
import { CheckCircle2, BookOpen, RefreshCcw, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTrainingStore } from "@/lib/store/training-store";
import { incrementWordsProgress } from "@/app/actions/words";

interface TrainClientProps {
  initialWords: Word[];
}

export function TrainClient({ initialWords }: TrainClientProps) {
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(false);
  const {
    words,
    currentIndex,
    phase,
    initSession,
    setNextIndex,
    setPhase,
    resetSession
  } = useTrainingStore();

  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState<number>(0);

  // Re-hydration check to avoid SSR mismatch with localStorage
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Initialize session only once when needed
  useEffect(() => {
    if (hasHydrated) {
      initSession(initialWords);
    }
  }, [hasHydrated, initialWords, initSession]);

  const handleNext = async (know: boolean = true) => {
    const currentWord = words[currentIndex];
    if (!currentWord) return;

    setDirection(know ? 1 : -1);

    // Give a small delay for the animation to start before switching index
    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setIsFlipped(false);
        setNextIndex();
      } else {
        setPhase("matching");
      }
    }, 50);
  };

  const handleMatchingComplete = async () => {
    const ids = words.map(w => w.id);
    await incrementWordsProgress(ids);
    setPhase("completed");
  };

  const handleReset = () => {
    resetSession();
    window.location.reload();
  };

  // If not yet hydrated, show nothing or a loader to avoid flashing old state
  if (!hasHydrated) {
    return null;
  }

  if (phase === "completed") {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-12 px-4 text-center gap-12">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <div className="flex flex-col gap-4 items-center">
          <h4 className="text-[32px] font-black bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent leading-tight">
            Тренування завершено!
          </h4>
          <p className="text-muted-foreground text-lg max-w-md">
            Чудова робота! Продовжуйте в тому ж дусі.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Button asChild className="flex-1 h-12 font-semibold shadow-sm transition-all active:scale-95 px-6">
            <Link href="/words">
              <BookOpen className="w-6 h-6 mr-2" />
              До слів
            </Link>
          </Button>
          <Button
            onClick={handleReset}
            variant="secondary"
            className="flex-1 h-12 font-semibold bg-primary/10 hover:bg-primary/20 text-primary border-none transition-all active:scale-95 px-6"
          >
            <RefreshCcw className="w-6 h-6 mr-2" />
            Ще раз
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "start") {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-8 py-8 w-full px-4 sm:px-5">
        <div className="flex flex-col gap-2 items-center justify-center text-center">
          <h3 className="text-4xl font-extrabold tracking-tight">
            Готові почати тренування?
          </h3>
          <p className="text-lg text-muted-foreground max-w-lg">
            Почніть вивчення нових слів за допомогою флеш-карток.
          </p>
        </div>
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
          <PlayCircle className="w-12 h-12 text-primary" />
        </div>
        <Button
          onClick={() => setPhase("flashcards")}
          className="w-full max-w-sm h-12 text-md font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 group"
        >
          Почати тренування
          <motion.span
            className="ml-2"
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 py-8 w-full px-4 sm:px-5">
      <div className="flex flex-col gap-2">
        <TrainingProgress
          current={phase === "flashcards" ? currentIndex + 1 : words.length}
          total={words.length}
        />
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {phase === "flashcards" ? "Етап 1: Картки" : "Етап 2: Відповідності"}
          </span>
          <span className="text-xs font-medium text-muted-foreground/60">
            {phase === "flashcards" ? "Повторення" : "Зназодження пар для слів"}
          </span>
        </div>
      </div>

      <div className="relative min-h-[420px] w-full flex items-center justify-center overflow-visible">
        <AnimatePresence mode="wait">
          {phase === "flashcards" ? (
            <motion.div
              key="flashcards-container"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative h-[420px] w-full flex items-center justify-center"
            >
              {words
                .slice(currentIndex, currentIndex + 6)
                .map((word, index) => {
                  const isTop = index === 0;
                  const rotate = index === 0 ? 0 : index % 2 === 1 ? 10 : 0;
                  const offsetX = index === 0 ? 0 : index % 2 === 1 ? 15 : 0;
                  const offsetY = index * 10;
                  const visible = index < 3;

                  return (
                    <motion.div
                      key={word.id}
                      layoutId={word.id}
                      initial={false}
                      animate={{
                        x: offsetX,
                        y: offsetY,
                        rotate,
                        scale: 1,
                      }}
                      transition={{ type: "spring", stiffness: 250, damping: 25 }}
                      exit={{
                        x: direction * 600,
                        rotate: direction * 45,
                        opacity: 0,
                        transition: { type: "spring", stiffness: 200, damping: 30 },
                      }}
                      className="absolute top-0 left-0 w-full"
                      style={{ zIndex: 50 - index, opacity: visible ? 1 : 0 }}
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
            </motion.div>
          ) : (
            <motion.div
              key="matching"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <MatchingGame
                words={words}
                onComplete={handleMatchingComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div >
  );
}
