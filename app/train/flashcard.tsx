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
          className="w-full h-full relative preserve-3d cursor-pointer"
          onClick={() => isInteractive && onFlip()}
        >
          <Card className="bg-card absolute inset-0 flex items-center justify-center p-10 text-center rounded-[2.5rem] backface-hidden">
            <h3 className="text-4xl font-black text-primary">{word.word}</h3>
          </Card>
          <Card
            className="bg-card absolute inset-0 flex items-center justify-center p-10 text-center rounded-[2.5rem] backface-hidden"
            style={{ transform: "rotateY(180deg)" }}
          >
            <h3 className="text-4xl font-black text-primary">{word.translation}</h3>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}