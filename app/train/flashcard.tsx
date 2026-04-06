"use client";

import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Word } from "@/types";

interface FlashcardProps {
  word: Word;
  onNext: (direction?: boolean) => void;
  isFlipped: boolean;
  onFlip: () => void;
  isInteractive?: boolean;
  className?: string;
}

export function Flashcard({
  word,
  onNext,
  isFlipped,
  onFlip,
  isInteractive = true,
  className,
}: FlashcardProps) {
  const x = useMotionValue(0);
  const controls = useAnimation();

  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-250, -200, 0, 200, 250], [0, 1, 1, 1, 0]);

  useEffect(() => {
    x.set(0);
  }, [word.id, x]);

  const swipeRight = async () => {
    await controls.start({
      x: 600,
      rotate: 45,
      opacity: 0,
      transition: { duration: 0.35 },
    });

    onNext(true);
  };

  const swipeLeft = async () => {
    await controls.start({
      x: -600,
      rotate: -45,
      opacity: 0,
      transition: { duration: 0.35 },
    });

    onNext(false);
  };

  const handleDragEnd = (_: any, info: any) => {
    if (!isInteractive) return;

    if (info.offset.x > 120) {
      swipeRight();
    } else if (info.offset.x < -120) {
      swipeLeft();
    } else {
      controls.start({
        x: 0,
        rotate: 0,
        transition: { type: "spring", stiffness: 300 },
      });
    }
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-md mx-auto h-[320px] sm:h-[350px] perspective-1000",
        className
      )}
    >
      <motion.div
        animate={controls}
        style={{
          x: isInteractive ? x : 0,
          rotate: isInteractive ? rotate : 0,
          opacity: isInteractive ? opacity : 1,
        }}
        drag={isInteractive ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragEnd={handleDragEnd}
        className={cn(
          "w-full h-full relative z-10",
          isInteractive ? "cursor-grab active:cursor-grabbing" : ""
        )}
      >
        <motion.div
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className="w-full h-full relative preserve-3d cursor-pointer shadow-2xl rounded-[2.5rem]"
          onClick={() => isInteractive && onFlip()}
        >
          {/* Helper for dynamic font size */}
          {(() => {
            const getFontSize = (text: string) => {
              const len = text.length;
              if (len <= 12) return "text-5xl";
              if (len <= 25) return "text-4xl";
              if (len <= 50) return "text-3xl";
              if (len <= 80) return "text-2xl";
              return "text-xl";
            };

            return (
              <>
                {/* Front Side */}
                <Card className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center rounded-[2.5rem] backface-hidden border-2 border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-none">
                  <h3 className={cn(
                    "font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight select-none text-balance",
                    getFontSize(word.word)
                  )}>
                    {word.word}
                  </h3>
                  <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-medium text-sm uppercase tracking-[0.2em] opacity-40">Натисніть, щоб перевернути</p>
                </Card>

                <Card
                  className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center rounded-[2.5rem] backface-hidden border-2 border-zinc-300 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-900 overflow-hidden shadow-none"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <h3 className={cn(
                    "font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight select-none text-balance",
                    getFontSize(word.translation || "")
                  )}>
                    {word.translation}
                  </h3>
                  <div className="mt-6">
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm uppercase tracking-[0.2em] opacity-40">Переклад</p>
                  </div>
                </Card>
              </>
            );
          })()}
        </motion.div>
      </motion.div>
    </div>
  );
}