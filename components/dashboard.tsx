import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    { status: "В процесі навчання", count: stats.learning },
    { status: "Вивчені", count: stats.learned },
  ];

  return (
    <div className="flex flex-col gap-10 py-10 w-full max-w-2xl mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold">
          Вітаємо 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Ваш словниковий запас налічує{" "}
          <span className="font-semibold text-foreground">{total}</span>{" "}
          {total === 1 ? "слово" : total < 5 ? "слова" : "слів"}.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4">
        {statCards.map(({ status, count }) => (
          <Card key={status} className="text-center">
            <CardHeader className="pb-2 pt-5">
              <CardTitle className="text-4xl font-bold">{count}</CardTitle>
            </CardHeader>
            <CardContent className="pb-5">
              <p className="text-sm text-muted-foreground">{status}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Швидкі дії</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/add-word">➕ Додати слово</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/words">📚 Переглянути слова</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/train">🏋️ Почати тренування</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
