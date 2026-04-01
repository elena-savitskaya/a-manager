import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TrainingProgressProps {
  current: number;
  total: number;
}

export function TrainingProgress({ current, total }: TrainingProgressProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="px-3 py-1 text-sm font-bold uppercase tracking-wider">
          {current} / {total} слів
        </Badge>
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
          {percentage}% виконано
        </p>
      </div>

      <div className="w-full">
        <Progress value={percentage} className="h-3 bg-muted/50" />
      </div>
    </div>
  );
}
