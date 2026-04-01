import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStatsProps {
  stats: {
    new: number;
    learning: number;
    learned: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    { status: "Нові слова", count: stats.new },
    { status: "В процесі", count: stats.learning },
    { status: "Вивчені", count: stats.learned },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {statCards.map(({ status, count }) => (
        <Card key={status} className="border-none shadow-sm bg-muted/30 hover:bg-muted/50 transition-colors">
          <CardHeader className="pb-2 pt-6 text-center">
            <CardTitle className="text-4xl font-black">{count}</CardTitle>
          </CardHeader>
          <CardContent className="pb-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{status}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
