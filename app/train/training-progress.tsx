import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TrainingProgressProps {
  current: number;
  total: number;
}

export function TrainingProgress({ current, total }: TrainingProgressProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-start">
        <Badge variant="secondary" className="px-3 py-1 text-sm font-bold uppercase tracking-wider">
          {current} / {total} слів
        </Badge>
      </div>
      <div className="w-full">
        <Progress
          value={percentage}
          className="
                h-1 bg-muted /20
                [&>div]:bg-gradient-to-r
                [&>div]:from-blue-500
                [&>div]:via-purple-500
                [&>div]:to-emerald-500
        "
        />
      </div>
    </div>
  );
}
