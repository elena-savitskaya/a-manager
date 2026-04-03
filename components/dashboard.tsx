import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BrandedHand } from "@/components/branded-hand";
import { DashboardStats } from "@/components/dashboard-stats";
import { DashboardActions } from "@/components/dashboard-actions";
import { getUkrainianPlural } from "@/lib/utils";

async function getWordStats(userId: string): Promise<{ new: number; learning: number; learned: number }> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("words")
    .select("status")
    .eq("user_id", userId);

  const counts = { new: 0, learning: 0, learned: 0 };
  (data ?? []).forEach((row) => {
    if (row.status in counts) {
      counts[row.status as keyof typeof counts]++;
    }
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

  return (
    <div className="flex flex-col gap-8">
      {/* Greeting Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-5xl font-extrabold tracking-tight flex items-center gap-4">
          Привіт
          <BrandedHand size={44} />
        </h2>
        <p className="text-lg text-muted-foreground">
          У вашому словнику вже{" "}
          <span className="font-bold text-foreground inline-flex items-center gap-1">
            {total}
          </span>{" "}
          {getUkrainianPlural(total, ["слово", "слова", "слів"])}.
        </p>
      </div>

      {/* Stats Overview */}
      <DashboardStats stats={stats} />

      {/* Modern Quick Actions Grid */}
      <DashboardActions />
    </div>
  );
}

