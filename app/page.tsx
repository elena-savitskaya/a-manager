import { Hero } from "@/components/hero";
import { Dashboard } from "@/components/dashboard";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";

async function PageContent() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = !!data?.claims;

  return isLoggedIn ? <Dashboard /> : <Hero />;
}

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-20 max-w-5xl mx-auto w-full p-5 py-12">
      <Suspense>
        <PageContent />
      </Suspense>
    </div>
  );
}
