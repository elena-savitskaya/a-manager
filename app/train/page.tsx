import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, X, Eye, Loader2 } from "lucide-react";

export default function TrainPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-12 py-10 w-full px-4 sm:px-5">
      {/* Premium Header */}
      <div className="flex flex-col gap-2 items-center justify-center text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Тренування
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg">
          Перевірте свої знання на флеш-картках.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="px-3 py-1 text-sm font-bold uppercase tracking-wider">
            3 / 5 слів
          </Badge>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            60% виконано
          </p>
        </div>

        <div className="w-full">
          <Progress value={60} className="h-3 bg-muted/50" />
        </div>
      </div>

      <Card className="min-h-[320px] flex flex-col justify-between border-none shadow-xl ring-1 ring-foreground/5 rounded-3xl bg-muted/40 overflow-hidden">
        <CardHeader className="pb-2 pt-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">
            Перекладіть слово
          </p>
          <CardTitle className="text-5xl font-black tracking-tight text-foreground">
            Ephemeral
          </CardTitle>
        </CardHeader>

        <CardContent className="px-10">
          <div className="rounded-2xl border-2 border-dashed border-foreground/10 bg-muted/20 p-8 text-center text-muted-foreground/80 flex flex-col items-center gap-3">
            <Eye className="w-6 h-6 opacity-30 text-primary" />
            <p className="text-sm">Натисніть нижче, щоб побачити переклад</p>
          </div>
        </CardContent>

        <CardFooter className="flex gap-4 p-8 pt-0">
          <Button variant="outline" className="flex-1 h-12 rounded-xl border-foreground/10 hover:bg-muted font-bold transition-all" disabled>
            Показати відповідь
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="destructive" className="h-14 rounded-2xl font-bold text-lg shadow-lg hover:shadow-destructive/20 transition-all gap-2" disabled>
          <X className="w-5 h-5" /> Не знаю
        </Button>
        <Button variant="default" className="h-14 rounded-2xl font-bold text-lg shadow-lg hover:shadow-primary/20 transition-all gap-2" disabled>
          <Check className="w-5 h-5" /> Знаю
        </Button>
      </div>
    </div>
  );
}
