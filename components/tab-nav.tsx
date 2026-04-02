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
    activeClass: "data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-500 data-[state=active]:border-blue-500/20 dark:data-[state=active]:bg-blue-500/20 dark:data-[state=active]:text-blue-400 dark:data-[state=active]:border-blue-500/30"
  },
  {
    href: "/add-word",
    label: "Додати",
    icon: <PlusCircle className="w-4 h-4" />,
    activeClass: "data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary/20 dark:data-[state=active]:bg-primary/20 dark:data-[state=active]:text-primary dark:data-[state=active]:border-primary/30"
  },
  {
    href: "/train",
    label: "Тренування",
    icon: <Lightbulb className="w-4 h-4" />,
    activeClass: "data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-500 data-[state=active]:border-emerald-500/20 dark:data-[state=active]:bg-emerald-500/20 dark:data-[state=active]:text-emerald-400 dark:data-[state=active]:border-emerald-500/30"
  },
];

const TAB_PATHS = tabs.map((t) => t.href);

export function TabNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (!TAB_PATHS.includes(pathname)) return null;

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-2 py-4">
      <Tabs value={pathname} onValueChange={(value) => router.push(value)}>
        <TabsList className="w-full bg-transparent gap-2 sm:gap-0 flex-nowrap">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.href}
              value={tab.href}
              className={cn(
                "h-12 flex-1 flex flex-row items-center gap-2 px-3 sm:px-2 py-2.5 rounded-xl border border-transparent transition-all duration-300",
                "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                tab.activeClass,
                "data-[state=active]:shadow-none data-[state=active]:font-bold"
              )}
            >
              {tab.icon}
              <span className="text-base md:text-sm whitespace-nowrap">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
