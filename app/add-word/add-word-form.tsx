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
import { GradientTextarea } from "@/components/ui/gradient-textarea";
import { Sparkles, Save, RotateCcw, Plus, Trash2, Check, X } from "lucide-react";
import { BrandedSpinner } from "@/components/ui/loader";
import { addWordAction } from "@/app/actions/words";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type Example = { en: string; ua: string };

export function AddWordForm() {
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [examples, setExamples] = useState<Example[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [suggestedWord, setSuggestedWord] = useState<string | null>(null);

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

    // Client-side validation for English word/phrase
    const latinOnlyRegex = /^[a-zA-Z\s'-/]+$/;
    if (!latinOnlyRegex.test(word.trim())) {
      toast.error("Дозволені лише латинські літери");
      return;
    }

    setIsTranslating(true);

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

      if (data.correctedWord && data.correctedWord.toLowerCase() !== word.trim().toLowerCase()) {
        setSuggestedWord(data.correctedWord);
      } else {
        setSuggestedWord(null);
      }

      setTranslation(data.translation || "");
      setExamples(data.examples || []);

      if (data.translation === "не розпізнано") {
        toast.warning("ШІ не зміг розпізнати слово");
      } else {
        toast.success("Варіант від ШІ отримано!");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Невідома помилка при перекладі");
    } finally {
      setIsTranslating(false);
    }
  }

  function applyCorrection() {
    if (suggestedWord) {
      setWord(suggestedWord);
      setSuggestedWord(null);
      toast.success("Виправлення застосовано");
    }
  }

  function handleReset() {
    setWord("");
    setTranslation("");
    setExamples([]);
    setSuggestedWord(null);
  }

  function addExample() {
    setExamples([...examples, { en: "", ua: "" }]);
  }

  function removeExample(index: number) {
    setExamples(examples.filter((_, i) => i !== index));
  }

  function updateExample(index: number, field: keyof Example, value: string) {
    const newExamples = [...examples];
    newExamples[index] = { ...newExamples[index], [field]: value };
    setExamples(newExamples);
  }

  return (
    <Card className="border-none shadow-xl ring-1 ring-foreground/5 rounded-3xl overflow-hidden bg-muted/30">
      <CardHeader>
        <CardDescription className="text-center font-medium">
          Введіть слово та його переклад. Можна скористатися допомогою ШІ.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-8">
        {/* Word input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="word" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">
            Слово англійською
          </Label>
          <div className="flex flex-col gap-1 w-full">
            <div className="flex gap-4 sm:flex-row flex-col items-start w-full">
              <GradientInput
                id="word"
                name="word-input"
                placeholder="Введіть слово англійською"
                value={word}
                onChange={(e) => {
                  setWord(e.target.value);
                  if (suggestedWord) setSuggestedWord(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isTranslating) {
                    e.preventDefault();
                    handleTranslate();
                  }
                }}
                disabled={isTranslating || isSaving}
                wrapperClassName="flex-1 w-full"
              />
              <Button
                type="button"
                variant="outline"
                className="h-12 shrink-0 px-6 font-bold shadow-sm transition-all sm:w-auto w-full border-primary/20 hover:border-primary/50 hover:bg-primary/5 text-primary"
                onClick={handleTranslate}
                disabled={!word.trim() || isTranslating || isSaving}
              >
                {isTranslating ? (
                  <>
                    <BrandedSpinner className="mr-2 h-6 w-6" size={16} />
                    Аналізую...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-6 w-6" />
                    Допомога ШІ
                  </>
                )}
              </Button>
            </div>
            <AnimatePresence mode="wait">
              {suggestedWord && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -5 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -5 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 p-2 px-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between group backdrop-blur-sm">
                    <p className="text-sm text-foreground/90 py-1">
                      Можливо, ви мали на увазі: <span className="font-bold text-primary italic">"{suggestedWord}"</span>?
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSuggestedWord(null)}
                        className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={applyCorrection}
                        className="h-8 px-4 text-xs gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95 transition-all rounded-xl border-none shrink-0"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Так
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Translation input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="translation" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">
            Переклад українською
          </Label>
          <GradientTextarea
            id="translation"
            name="translation-input"
            placeholder="Введіть переклад або натисніть 'Допомога ШІ'"
            value={translation}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTranslation(e.target.value)}
            disabled={isSaving}
            glowColor="emerald"
            className="min-h-[80px]"
          />
        </div>

        {/* Examples Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between ml-1">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
              Приклади використання (опціонально)
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addExample}
              className="h-8 text-xs font-bold gap-1 hover:text-primary transition-colors"
            >
              <Plus className="w-3 h-3" /> Додати приклад
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {examples.length === 0 && (
              <p className="text-sm text-muted-foreground/50 italic text-center py-4 bg-background/20 rounded-2xl border border-dashed border-muted-foreground/10">
                Прикладів поки немає. ШІ може згенерувати їх для вас.
              </p>
            )}
            {examples.map((ex, i) => (
              <div key={i} className="flex flex-col gap-3 p-4 rounded-2xl bg-background/40 border border-foreground/5 relative group transition-all hover:border-primary/20">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeExample(i)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest w-4 text-right">{i + 1}.</span>
                    <input
                      className="bg-transparent border-none focus:ring-0 text-sm font-medium w-full p-0 italic text-foreground/90"
                      value={ex.en}
                      placeholder="Речення англійською..."
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExample(i, "en", e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 pl-6">
                    <input
                      className="bg-transparent border-none focus:ring-0 text-xs w-full p-0 text-muted-foreground"
                      value={ex.ua}
                      placeholder="Переклад прикладу..."
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExample(i, "ua", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-3 p-6 mt-4 bg-muted/20 border-t border-foreground/5">
        <form action={formAction} className="w-full flex flex-col sm:flex-row gap-3">
          {/* Hidden fields for server action */}
          <input type="hidden" name="word" value={word} />
          <input type="hidden" name="translation" value={translation} />
          <input
            type="hidden"
            name="examples"
            value={JSON.stringify(examples.filter(ex => ex.en.trim() && ex.ua.trim()))}
          />

          <Button
            type="submit"
            className="h-12 w-full font-bold shadow-lg hover:shadow-primary/20 transition-all sm:flex-[2]"
            disabled={!word.trim() || !translation.trim() || isSaving || isTranslating}
          >
            {isSaving ? (
              <>
                <BrandedSpinner className="mr-2 h-6 w-6" size={24} />
                Збереження...
              </>
            ) : (
              <>
                <Save className="mr-2 h-6 w-6" />
                Зберегти в словник
              </>
            )}
          </Button>
          {(word || translation || examples.length > 0) && (
            <Button
              type="button"
              variant="ghost"
              className="h-12 w-full sm:w-auto font-medium text-muted-foreground gap-2 flex-1"
              onClick={handleReset}
              disabled={isSaving}
            >
              <RotateCcw className="w-5 h-5" /> Скинути
            </Button>
          )}
        </form>
      </CardFooter>
    </Card>
  );
}

