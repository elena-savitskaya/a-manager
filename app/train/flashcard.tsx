"use client";

import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Word } from "@/types";

interface FlashcardProps {
  word: Word;
  onNext: (know: boolean) => void;
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

  const greenOpacity = useTransform(x, [10, 100], [0, 1]);
  const redOpacity = useTransform(x, [-10, -100], [0, 1]);
  const labelScale = useTransform(x, [-150, 0, 150], [1.2, 0.8, 1.2]);
  const tintOpacity = useTransform(x, [-150, 0, 150], [0.3, 0, 0.3]);

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
        "relative w-full max-w-md mx-auto h-[350px] sm:h-[400px] perspective-1000",
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
          {/* Front Side */}
          <Card className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center rounded-[2.5rem] backface-hidden border-2 border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-none">
            <motion.div
              style={{ opacity: greenOpacity, scale: labelScale }}
              className="absolute top-12 right-12 border-4 border-emerald-500 rounded-xl px-4 py-1 rotate-12 pointer-events-none"
            >
              <span className="text-emerald-500 font-black text-2xl tracking-tighter uppercase font-uk">Знаю</span>
            </motion.div>
            <motion.div
              style={{ opacity: redOpacity, scale: labelScale }}
              className="absolute top-12 left-12 border-4 border-rose-500 rounded-xl px-4 py-1 -rotate-12 pointer-events-none"
            >
              <span className="text-rose-500 font-black text-2xl tracking-tighter uppercase font-uk">Важко</span>
            </motion.div>
            <h3 className="text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight select-none">
              {word.word}
            </h3>
            <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-medium text-sm uppercase tracking-[0.2em] opacity-40">Натисніть, щоб перевернути</p>
          </Card>

          <Card
            className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center rounded-[2.5rem] backface-hidden border-2 border-zinc-300 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-900 overflow-hidden shadow-none"
            style={{ transform: "rotateY(180deg)" }}
          >
            <motion.div
              style={{ opacity: greenOpacity, scale: labelScale }}
              className="absolute top-12 right-12 border-4 border-emerald-500 rounded-xl px-4 py-1 rotate-12 pointer-events-none"
            >
              <span className="text-emerald-500 font-black text-2xl tracking-tighter uppercase font-uk">Знаю</span>
            </motion.div>
            <motion.div
              style={{ opacity: redOpacity, scale: labelScale }}
              className="absolute top-12 left-12 border-4 border-rose-500 rounded-xl px-4 py-1 -rotate-12 pointer-events-none"
            >
              <span className="text-rose-500 font-black text-2xl tracking-tighter uppercase font-uk">Важко</span>
            </motion.div>
            <h3 className="text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight select-none">
              {word.translation}
            </h3>
            <div className="mt-6">
              <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm uppercase tracking-[0.2em] opacity-40">Переклад</p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}