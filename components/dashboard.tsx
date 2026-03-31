import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, BookOpen, Dumbbell, ArrowRight } from "lucide-react";

type StatusCount = { status: string; count: number };

async function getWordStats(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("words")
    .select("status")
    .eq("user_id", userId);

  const counts: Record<string, number> = { new: 0, learning: 0, learned: 0 };
  (data ?? []).forEach((row) => {
    if (row.status in counts) counts[row.status]++;
  });
  return counts;
}

export async function Dashboard() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) redirect("/login");

  const stats = await getWordStats(user.sub);
  const total = stats.new + stats.learning + stats.learned;

  const statCards: StatusCount[] = [
    { status: "Нові слова", count: stats.new },
    { status: "В процесі", count: stats.learning },
    { status: "Вивчені", count: stats.learned },
  ];

  const quickActions = [
    {
      title: "Додати слово",
      description: "Нові слова з прикладами від ШІ",
      icon: <PlusCircle className="w-6 h-6 text-primary" />,
      href: "/add-word",
      color: "bg-primary/10",
    },
    {
      title: "Словник",
      description: "Список слів та їх прогрес",
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      href: "/words",
      color: "bg-blue-500/10",
    },
    {
      title: "Тренування",
      description: "Закріпіть знання на практиці",
      icon: <Dumbbell className="w-6 h-6 text-emerald-500" />,
      href: "/train",
      color: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="flex flex-col gap-12 py-8 w-full max-w-4xl mx-auto px-4">
      {/* Greeting Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Привіт 👋
        </h1>
        <p className="text-xl text-muted-foreground">
          У вашому словнику вже{" "}
          <span className="font-bold text-foreground inline-flex items-center gap-1">
            {total}
          </span>{" "}
          {total === 1 ? "слово" : total < 5 && total > 0 ? "слова" : "слів"}.
        </p>
      </div>

      {/* Stats Overview */}
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

      {/* Modern Quick Actions Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Швидкі дії</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href} className="group">
              <Card className="h-full border-none shadow-sm ring-1 ring-foreground/5 hover:ring-primary/50 transition-all duration-300 overflow-hidden relative">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className={`p-2.5 rounded-xl ${action.color} transition-transform group-hover:scale-110 duration-300`}>
                    {action.icon}
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <CardDescription className="text-sm leading-relaxed mb-4">
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
    </div>
  );
}
