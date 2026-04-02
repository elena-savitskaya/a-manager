"use client";

import { useState } from "react";
import { TrainingHeader } from "./training-header";
import { TrainingProgress } from "./training-progress";
import { TrainingCard } from "./training-card";
import { TrainingControls } from "./training-controls";

export default function TrainPage() {
  const [isFlipped, setIsFlipped] = useState(false);

  // Mock data for now
  const mockWord = {
    original: "Ephemeral",
    translation: "Ефемерний, скороминущий"
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-12 py-8 w-full px-4 sm:px-5">
      {/* Page Title & Desc */}
      <TrainingHeader />

      {/* Progress Section */}
      <TrainingProgress current={3} total={5} />

      {/* Main Flashcard */}
      <TrainingCard
        word={mockWord.original}
        translation={mockWord.translation}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped(true)}
      />

      {/* Action Buttons */}
      <TrainingControls
        onKnow={() => setIsFlipped(false)}
        onNotKnow={() => setIsFlipped(false)}
      />
    </div>
  );
}

