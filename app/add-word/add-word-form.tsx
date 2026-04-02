"use client";

import { useState, useActionState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GradientInput } from "@/components/ui/gradient-input";
import { Sparkles, Save, RotateCcw } from "lucide-react";
import { TranslationPreview } from "./translation-preview";
import { BrandedSpinner } from "@/components/ui/loader";
import { addWordAction } from "@/app/actions/words";
import { toast } from "sonner";

type TranslationResult = {
  translation: string;
  examples: { en: string; ua: string }[];
  correctedWord?: string;
};

export function AddWordForm() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // useActionState for the saving process
  const [state, formAction, isSaving] = useActionState(addWordAction, {});

  // Handle server action errors
  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error]);

  async function handleTranslate() {
    if (!word.trim()) return;
    setIsTranslating(true);
    setResult(null);

    try {
      const response = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: word.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Помилка перекладу");
      }

      // Handle auto-correction
      if (data.correctedWord && data.correctedWord.toLowerCase() !== word.trim().toLowerCase()) {
        const oldWord = word.trim();
        const newWord = data.correctedWord;
        setWord(newWord);
        toast.info(`Виправлено: ми замінили "${oldWord}" на "${newWord}"`, {
          duration: 5000,
        });
      }

      setResult(data as TranslationResult);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Невідома помилка при перекладі");
    } finally {
      setIsTranslating(false);
    }
  }

  function handleReset() {
    setWord("");
    setResult(null);
  }

  const showPreview = !!result;

  return (
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
          <div className="flex gap-4 sm:flex-row flex-col items-center">
            <GradientInput
              id="word"
              name="word-input"
              type="text"
              placeholder="введіть слово"
              value={word}
              onChange={(e) => {
                setWord(e.target.value);
                if (result) setResult(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isTranslating) {
                  e.preventDefault();
                  handleTranslate();
                }
              }}
              disabled={isTranslating || isSaving}
              wrapperClassName="flex-1 w-full"
              className=""
            />
            <Button
              type="button"
              className="h-12 shrink-0 px-6 font-bold shadow-sm transition-all sm:w-auto w-full"
              onClick={handleTranslate}
              disabled={!word.trim() || isTranslating || isSaving}
            >
              {isTranslating ? (
                <>
                  <BrandedSpinner className="mr-2 h-4 w-4" size={16} />
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

        {/* Translation preview */}
        {showPreview && <TranslationPreview result={result} />}
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-3 p-6 pt-0">
        <form action={formAction} className="w-full flex flex-col sm:flex-row gap-3">
          {/* Hidden fields for server action */}
          <input type="hidden" name="word" value={word} />
          <input type="hidden" name="translation" value={result?.translation || ""} />
          <input type="hidden" name="examples" value={JSON.stringify(result?.examples || [])} />

          <Button
            type="submit"
            className="h-12 w-full font-bold shadow-lg hover:shadow-primary/20 transition-all sm:flex-[2]"
            disabled={!result || isSaving || isTranslating}
          >
            {isSaving ? (
              <>
                <BrandedSpinner className="mr-2 h-5 w-5" size={20} />
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
            <Button
              type="button"
              variant="ghost"
              className="h-12 w-full sm:w-auto font-medium text-muted-foreground gap-2 flex-1"
              onClick={handleReset}
              disabled={isSaving}
            >
              <RotateCcw className="w-4 h-4" /> Скинути
            </Button>
          )}
        </form>
      </CardFooter>
    </Card>
  );
}

