"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { href: "/words", label: "📚 Слова" },
  { href: "/add-word", label: "➕ Додати" },
  { href: "/train", label: "🏋️ Тренування" },
];

const TAB_PATHS = tabs.map((t) => t.href);

export function TabNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (!TAB_PATHS.includes(pathname)) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-5 py-3">
      <Tabs value={pathname} onValueChange={(value) => router.push(value)}>
        <TabsList className="w-full bg-transparent gap-2">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.href}
              value={tab.href}
              className="flex-1        
          border
        h-9 px-4 py-2
        transition-all
rounded-md text-sm font-medium
        bg-muted text-muted-foreground
        hover:bg-muted/80

        data-[state=active]:bg-primary
        data-[state=active]:text-primary-foreground
        data-[state=active]:shadow
        dark:data-[state=active]:bg-white
dark:data-[state=active]:text-black
      "
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
