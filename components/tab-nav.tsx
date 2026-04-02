"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, PlusCircle, Lightbulb } from "lucide-react";

const tabs = [
  {
    href: "/words",
    label: "Слова",
    icon: <BookOpen className="w-4 h-4" />,
    activeClass: "data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-600 data-[state=active]:border-blue-500/30 dark:data-[state=active]:bg-blue-500/25 dark:data-[state=active]:text-blue-400 dark:data-[state=active]:border-blue-500/40 data-[state=active]:shadow-[0_0_15px_rgba(59,130,246,0.15)]"
  },
  {
    href: "/add-word",
    label: "Додати",
    icon: <PlusCircle className="w-4 h-4" />,
    activeClass: "data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:border-primary/30 dark:data-[state=active]:bg-primary/25 dark:data-[state=active]:text-primary dark:data-[state=active]:border-primary/40 data-[state=active]:shadow-[0_0_15px_rgba(var(--primary),0.1)]"
  },
  {
    href: "/train",
    label: "Тренування",
    icon: <Lightbulb className="w-4 h-4" />,
    activeClass: "data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-600 data-[state=active]:border-emerald-500/30 dark:data-[state=active]:bg-emerald-500/25 dark:data-[state=active]:text-emerald-400 dark:data-[state=active]:border-emerald-500/40 data-[state=active]:shadow-[0_0_15px_rgba(16,185,129,0.15)]"
  },
];

const TAB_PATHS = tabs.map((t) => t.href);

export function TabNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (!TAB_PATHS.includes(pathname)) return null;

  return (
    <div className="w-full z-50 bg-transparent">
      <div className="w-full max-w-lg mx-auto px-4 pt-2 pb-8 md:pb-2">
        <Tabs value={pathname} onValueChange={(value) => router.push(value)}>
          <TabsList className="grid grid-cols-3 w-full bg-transparent gap-2 h-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.href}
                value={tab.href}
                className={cn(
                  "h-16 md:h-12 flex flex-col md:flex-row items-center justify-center gap-1.5 px-3 py-2 rounded-2xl border border-transparent transition-all duration-300 w-full",
                  "text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground",
                  tab.activeClass,
                  "data-[state=active]:font-bold"
                )}
              >
                <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                  <div className="h-5 w-5 flex items-center justify-center">
                    {tab.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tight">
                    {tab.label}
                  </span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
