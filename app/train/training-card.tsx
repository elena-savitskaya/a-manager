import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface TrainingCardProps {
  word: string;
  translation?: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export function TrainingCard({ word, translation, isFlipped, onFlip }: TrainingCardProps) {
  return (
    <Card className="min-h-[320px] flex flex-col justify-between border-none shadow-xl ring-1 ring-foreground/5 rounded-3xl bg-muted/40 overflow-hidden">
      <CardHeader className="pb-2 pt-10 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">
          {isFlipped ? "Значення слова" : "Перекладіть слово"}
        </p>
        <CardTitle className="text-5xl font-black tracking-tight text-foreground">
          {isFlipped && translation ? translation : word}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-10">
        {!isFlipped && (
          <div className="rounded-2xl border-2 border-dashed border-foreground/10 bg-muted/20 p-8 text-center text-muted-foreground/80 flex flex-col items-center gap-3">
            <Eye className="w-6 h-6 opacity-30 text-primary" />
            <p className="text-sm">Натисніть нижче, щоб побачити переклад</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-4 p-8 pt-0">
        <Button 
          variant="outline" 
          className="flex-1 border-foreground/10 hover:bg-muted font-bold transition-all"
          onClick={onFlip}
          disabled={isFlipped}
        >
          {isFlipped ? "Відповідь показано" : "Показати відповідь"}
        </Button>
      </CardFooter>
    </Card>
  );
}
