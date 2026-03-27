import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="flex flex-col gap-6 items-center text-center py-16">
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-4xl">📚</span>
      </div>
      <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
        English Vocabulary Trainer
      </h1>
      <p className="text-lg text-muted-foreground max-w-md">
        Build your vocabulary with AI-powered translations and smart practice sessions.
      </p>
      <Button asChild size="lg" className="mt-2">
        <Link href="/auth/sign-up">Get Started</Link>
      </Button>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent mt-8" />
    </div>
  );
}


