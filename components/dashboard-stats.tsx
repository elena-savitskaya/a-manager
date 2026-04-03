import { getUkrainianPlural } from "@/lib/utils";

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
      count: total
    },
    { status: "Вчити", count: toLearn },
    { status: "Вивчено", count: stats.learned },
  ];

  return (
    <div className="flex items-center justify-between w-full bg-muted/30 backdrop-blur-sm rounded-xl border border-foreground/5 shadow-sm overflow-hidden">
      {statCards.map(({ status, count }, index) => (
        <div
          key={status}
          className="flex-1 flex flex-col gap-2 items-center justify-center py-6 text-center group cursor-default relative after:absolute after:right-0 after:top-[10%] after:h-[80%] after:w-px after:bg-foreground/5 last:after:hidden"
        >
          <span className="text-[32px] font-black text-foreground tracking-tighter">
            {count}
          </span>
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
            {status}
          </p>
        </div>
      ))}
    </div>
  );
}
