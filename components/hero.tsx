import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BookOpen, Library } from "lucide-react";

export function Hero() {
  return (
    <div className="flex flex-col gap-8 items-center text-center justify-center pt-6 md:pt-24 pb-2">
      <div className="relative group transition-all duration-500">
        {/* Animated Background Glows */}
        <div className="absolute -inset-8 bg-blue-500/20 blur-[50px] rounded-full animate-pulse" />
        <div className="absolute -inset-8 bg-primary/20 blur-[50px] rounded-full animate-pulse delay-700" />
        <div className="absolute -inset-8 bg-emerald-500/20 blur-[50px] rounded-full animate-pulse delay-1000" />

        {/* Icon Container */}
        <div className="relative flex items-center justify-center p-12 rounded-[2.5rem] bg-muted/30 backdrop-blur-sm border border-foreground/5 shadow-2xl overflow-visible">
          {/* Main Logo Image */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 z-10 animate-pulse">
            <Image
              src="/logo.png"
              alt="WordTrainer Icon"
              width={128}
              height={128}
              className="object-contain"
              priority
            />
          </div>

          {/* Secondary Brand Icons */}
          <div className="absolute -top-3 -left-3 w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-lg backdrop-blur-md transition-transform group-hover:-translate-y-2 group-hover:-translate-x-1 duration-500">
            <BookOpen className="w-6 h-6 text-blue-500 -rotate-12" />
          </div>

          <div className="absolute -bottom-3 -right-3 w-12 h-12 flex items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-lg backdrop-blur-md transition-transform group-hover:translate-y-2 group-hover:translate-x-1 duration-500">
            <Library className="w-6 h-6 text-emerald-500 rotate-12" />
          </div>
        </div>
      </div>
      <h1 className="text-5xl lg:text-6xl font-bold tracking-tight pt-10">
        WordTrainer - Тренажер Слів
      </h1>
      <p className="text-lg text-muted-foreground max-w-md">
        Збільшуйте свій словниковий запас за допомогою розумних тренувань
      </p>
      <Button asChild size="lg" className="font-bold">
        <Link href="/auth/sign-up">ПОЧАТИ</Link>
      </Button>
    </div>
  );
}


