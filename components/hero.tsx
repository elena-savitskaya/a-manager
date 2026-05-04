import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Sparkles, Zap } from "lucide-react";

export function Hero() {
  return (
    <div className="flex flex-col gap-10 items-center text-center justify-center pt-6 md:pt-16 pb-2">
      <div className="relative w-full max-w-2xl mx-auto">
        {/* Background Glows */}
        <div className="absolute -inset-10 bg-blue-500/15 blur-[80px] rounded-full animate-pulse" />
        <div className="absolute -inset-10 bg-emerald-500/10 blur-[80px] rounded-full animate-pulse delay-1000" />
        {/* Banner Container */}
        <div className="relative rounded-3xl bg-gradient-to-br from-muted/40 via-muted/20 to-muted/40 backdrop-blur-sm border border-foreground/5 shadow-2xl p-8 md:p-12 overflow-hidden">
          {/* Decorative Grid Background */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Floating Word Cards */}
          <div className="relative flex flex-col items-center gap-6">
            {/* Text Content */}
            <div className="flex flex-col gap-4 items-center">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
                <span className="bg-gradient-to-r from-blue-500 via-primary to-emerald-500 bg-clip-text text-transparent">
                  WordTrainer
                </span>
                <br />
                <span className="text-foreground text-3xl md:text-5xl">
                  Тренажер Слів
                </span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-md">
                Збільшуйте свій словниковий запас за допомогою розумних тренувань
              </p>
            </div>

            {/* CTA Button */}
            <Button
              asChild
              size="lg"
              className="h-14 px-8 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 group"
            >
              <Link href="/auth/sign-up">ПОЧАТИ</Link>
            </Button>

            {/* Center - AI Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-primary/10 to-emerald-500/10 border border-foreground/5 backdrop-blur-md shadow-md">
              <Zap className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
              <span className="text-[11px] md:text-xs font-bold tracking-wider uppercase text-muted-foreground">
                AI-переклад та приклади
              </span>
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse delay-700" />
            </div>

            {/* Bottom Row - Feature Pills */}
            <div className="flex gap-2 md:gap-3 flex-wrap justify-center">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/40 border border-foreground/5 text-[11px] md:text-xs font-medium text-muted-foreground">
                <BookOpen className="w-3 h-3 text-blue-400" />
                Флешкартки
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/40 border border-foreground/5 text-[11px] md:text-xs font-medium text-muted-foreground">
                <Brain className="w-3 h-3 text-emerald-400" />
                Matching Game
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/40 border border-foreground/5 text-[11px] md:text-xs font-medium text-muted-foreground">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                Smart AI
              </div>
            </div>
          </div>
        </div>
      </div>




    </div>
  );
}
