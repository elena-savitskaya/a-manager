import { getUkrainianPlural, cn } from "@/lib/utils";

interface DashboardStatsProps {
  stats: {
    new: number;
    learning: number;
    learned: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const total = stats.new + stats.learning + stats.learned;
  const toLearn = stats.new + stats.learning;

  const statCards = [
    {
      status: getUkrainianPlural(total, ["Слово", "Слова", "Слів"]),
      count: total,
      colorClass: "text-blue-600 dark:text-blue-400"
    },
    { 
      status: "Вчити", 
      count: toLearn,
      colorClass: "text-primary"
    },
    { 
      status: "Вивчено", 
      count: stats.learned,
      colorClass: "text-emerald-600 dark:text-emerald-400"
    },
  ];

  return (
    <div className="flex items-center justify-between w-full bg-muted/30 backdrop-blur-sm rounded-xl border border-foreground/5 shadow-sm overflow-hidden">
      {statCards.map(({ status, count, colorClass }) => (
        <div
          key={status}
          className="flex-1 flex flex-col gap-1 items-center justify-center py-6 text-center group cursor-default relative after:absolute after:right-0 after:top-[10%] after:h-[80%] after:w-px after:bg-foreground/5 last:after:hidden"
        >
          <span className={cn("text-[24px] font-black tracking-tighter", colorClass)}>
            {count}
          </span>
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors">
            {status}
          </p>
        </div>
      ))}
    </div>
  );
}
