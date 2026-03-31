import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
        <Button asChild size="sm" variant={"outline"} className="w-full md:w-auto rounded-xl h-11 md:h-9">
          <Link href="/auth/login">Увійти</Link>
        </Button>
        <Button asChild size="sm" variant={"default"} className="w-full md:w-auto rounded-xl h-11 md:h-9 font-bold">
          <Link href="/auth/sign-up">Зареєструватися</Link>
        </Button>
      </div>
    );
  }

  const name = user.user_metadata?.full_name || user.email;

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto px-4 py-3 md:p-0">
      <span className="text-sm font-bold md:font-medium whitespace-nowrap">Привіт, {name}!</span>
      <LogoutButton />
    </div>
  );
}
