"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Button 
      variant="default" 
      onClick={logout} 
      className="w-full md:w-auto rounded-xl h-12 px-6 font-bold shadow-sm"
    >
      Вийти
    </Button>
  );
}
