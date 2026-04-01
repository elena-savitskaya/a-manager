"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type TranslationResult = {
  translation: string;
  examples: string[];
};

type FormState = "idle" | "translating" | "preview" | "saving" | "saved";

import { PlusCircle, Sparkles, Save, RotateCcw, Loader2 } from "lucide-react";

export default function AddWordPage() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleTranslate() {
    if (!word.trim()) return;
    setFormState("translating");
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: word.trim() }),
      });

      if (!res.ok) throw new Error("Помилка перекладу");

      const data: TranslationResult = await res.json();
      setResult(data);
      setFormState("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Невідома помилка");
      setFormState("idle");
    }
  }

  async function handleSave() {
    if (!result) return;
    setFormState("saving");
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Необхідна авторизація");

      // Check for duplicate
      const { data: existing } = await supabase
        .from("words")
        .select("id")
        .eq("user_id", user.id)
        .ilike("word", word.trim())
        .maybeSingle();

      if (existing) {
        setError(`Слово "${word.trim()}" вже є у вашому словнику.`);
        setFormState("preview");
        return;
      }

      const { error: dbError } = await supabase.from("words").insert({
        user_id: user.id,
        word: word.trim(),
        translation: result.translation,
        examples: result.examples,
        status: "new",
      });

      if (dbError) throw new Error(dbError.message);

      // Reset state before navigating so the router cache stores a clean form
      setWord("");
      setResult(null);
      setError(null);
      setFormState("idle");
      router.push("/words");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка збереження");
      setFormState("preview");
    }
  }

  function handleReset() {
    setWord("");
    setResult(null);
    setFormState("idle");
    setError(null);
  }

  const isTranslating = formState === "translating";
  const isSaving = formState === "saving";
  const showPreview =
    result && (formState === "preview" || formState === "saving");

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-12 py-10 w-full px-4 sm:px-5">
      {/* Premium Header */}
      <div className="flex flex-col gap-2 items-center justify-center text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Додати Слово
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg">
          Введіть слово англійською — AI запропонує переклад та приклади.
        </p>
      </div>

      <Card className="border-none shadow-xl ring-1 ring-foreground/5 rounded-3xl overflow-hidden bg-muted/30">
        <CardHeader>
          <CardDescription className="text-center font-medium">
            Заповніть форму нижче для автоматичного перекладу
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* Word input */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="word">Слово</Label>
            <div className="flex gap-2 sm:flex-row flex-col items-center">
              <Input
                id="word"
                type="text"
                placeholder="введіть слово"
                value={word}
                onChange={(e) => {
                  setWord(e.target.value);
                  if (result) {
                    setResult(null);
                    setFormState("idle");
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isTranslating) handleTranslate();
                }}
                disabled={isTranslating || isSaving}
              />
              <Button
                type="button"
                className="shrink-0 h-11 px-6 rounded-xl font-bold shadow-sm transition-all sm:w-auto w-full"
                onClick={handleTranslate}
                disabled={!word.trim() || isTranslating || isSaving}
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Перекладаю...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Перекласти
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center font-medium">
              {error}
            </div>
          )}

          {/* Translation preview */}
          {showPreview && (
            <div className="rounded-2xl border-none bg-background/50 p-6 flex flex-col gap-5 shadow-sm ring-1 ring-foreground/5 transition-all">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">
                  Переклад
                </p>
                <p className="text-2xl font-bold text-foreground">{result.translation}</p>
              </div>
              <div className="w-full h-px bg-muted" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">
                  Приклади використання
                </p>
                <ol className="flex flex-col gap-3">
                  {result.examples.map((ex, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-3 italic leading-relaxed">
                      <span className="text-primary font-bold">{i + 1}.</span>
                      {ex}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            className="w-full h-12 rounded-xl font-bold text-lg shadow-lg hover:shadow-primary/20 transition-all flex-[2]"
            onClick={handleSave}
            disabled={!result || isSaving || isTranslating}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Зберігаю...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Зберегти
              </>
            )}
          </Button>
          {result && (
            <Button variant="ghost" className="w-full sm:w-auto h-12 rounded-xl font-medium text-muted-foreground gap-2 flex-1" onClick={handleReset} disabled={isSaving}>
              <RotateCcw className="w-4 h-4" /> Скинути
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
