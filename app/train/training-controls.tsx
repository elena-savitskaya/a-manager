import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface TrainingControlsProps {
  onNotKnow: () => void;
  onKnow: () => void;
  disabled?: boolean;
}

export function TrainingControls({ onNotKnow, onKnow, disabled = false }: TrainingControlsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="destructive"
        className="h-14 rounded-2xl font-bold text-lg shadow-lg hover:shadow-destructive/20 transition-all gap-2"
        onClick={onNotKnow}
        disabled={disabled}
      >
        <X className="w-5 h-5" /> Не знаю
      </Button>
      <Button
        variant="default"
        className="h-14 rounded-2xl font-bold text-lg shadow-lg hover:shadow-primary/20 transition-all gap-2"
        onClick={onKnow}
        disabled={disabled}
      >
        <Check className="w-5 h-5" /> Знаю
      </Button>
    </div>
  );
}
