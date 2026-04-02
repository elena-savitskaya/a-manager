import Link from "next/link";
import { PlusCircle, BookOpen, Lightbulb, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function DashboardActions() {
  const quickActions = [
    {
      title: "Словник",
      description: "Список слів та їх прогрес",
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      href: "/words",
      color: "bg-blue-500/10",
    }, {
      title: "Додати слово",
      description: "Нові слова з прикладами від ШІ",
      icon: <PlusCircle className="w-6 h-6 text-primary" />,
      href: "/add-word",
      color: "bg-primary/10",
    },
    {
      title: "Тренування",
      description: "Закріпіть знання на практиці",
      icon: <Lightbulb className="w-6 h-6 text-emerald-500" />,
      href: "/train",
      color: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Швидкі дії</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link key={action.title} href={action.href} className="group">
            <Card className="h-full flex flex-col gap-2 border-none shadow-sm ring-1 ring-foreground/5 hover:ring-primary/50 transition-all duration-300 overflow-hidden relative">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className={`p-2.5 rounded-xl ${action.color} transition-transform group-hover:scale-110 duration-300`}>
                  {action.icon}
                </div>
                <CardTitle className="text-lg space-y-0">{action.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <CardDescription className="text-sm leading-relaxed">
                  {action.description}
                </CardDescription>
                <div className="flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Перейти <ArrowRight className="ml-1 w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
