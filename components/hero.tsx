import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Lightbulb } from "lucide-react";

export function Hero() {
  return (
    <div className="flex flex-col gap-8 items-center text-center justify-center pt-6 pb-2">
      <div className="relative group transition-all duration-500">
        {/* Animated Background Glows */}
        <div className="absolute -inset-8 bg-blue-500/20 blur-[50px] rounded-full animate-pulse" />
        <div className="absolute -inset-8 bg-primary/20 blur-[50px] rounded-full animate-pulse delay-700" />
        <div className="absolute -inset-8 bg-emerald-500/20 blur-[50px] rounded-full animate-pulse delay-1000" />

        {/* Icon Container */}
        <div className="relative flex items-center justify-center p-8 rounded-[2.5rem] bg-muted/30 backdrop-blur-sm border border-foreground/5 shadow-2xl overflow-visible">
          {/* Main AI Icon */}
          <Sparkles className="w-14 h-14 text-primary animate-pulse z-10" />

          {/* Secondary Brand Icons */}
          <div className="absolute -top-3 -left-3 p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-lg backdrop-blur-md transition-transform group-hover:-translate-y-2 group-hover:-translate-x-1 duration-500">
            <BookOpen className="w-6 h-6 text-blue-500 -rotate-12" />
          </div>

          <div className="absolute -bottom-3 -right-3 p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-lg backdrop-blur-md transition-transform group-hover:translate-y-2 group-hover:translate-x-1 duration-500">
            <Lightbulb className="w-6 h-6 text-emerald-500 rotate-12" />
          </div>
        </div>
      </div>
      <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
        English Vocabulary Trainer
      </h1>
      <p className="text-lg text-muted-foreground max-w-md">
        Build your vocabulary with AI-powered translations and smart practice sessions.
      </p>
      <Button asChild size="lg" className="rounded-xl">
        <Link href="/auth/sign-up">Get Started</Link>
      </Button>
    </div>
  );
}


