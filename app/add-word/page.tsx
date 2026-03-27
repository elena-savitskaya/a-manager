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
    <div className="container mx-auto max-w-3xl py-2 px-6 flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Додати слово</CardTitle>
          <CardDescription>
            Введіть англійське слово — AI перекладе його та підбере приклади.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* Word input */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="word">Слово</Label>
            <div className="flex gap-2">
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
                variant="outline"
                onClick={handleTranslate}
                disabled={!word.trim() || isTranslating || isSaving}
                className="shrink-0"
              >
                {isTranslating ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Перекладаю...
                  </>
                ) : (
                  "Перекласти"
                )}
              </Button>
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-sm text-destructive">{error}</p>}

          {/* Translation preview */}
          {showPreview && (
            <div className="rounded-lg border bg-muted/50 p-4 flex flex-col gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Переклад
                </p>
                <p className="text-lg font-semibold">{result.translation}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Приклади використання
                </p>
                <ol className="flex flex-col gap-1.5 list-decimal list-inside">
                  {result.examples.map((ex, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      {ex}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={!result || isSaving || isTranslating}
          >
            {isSaving ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Зберігаю...
              </>
            ) : (
              "Зберегти"
            )}
          </Button>
          {result && (
            <Button variant="ghost" onClick={handleReset} disabled={isSaving}>
              Скинути
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
