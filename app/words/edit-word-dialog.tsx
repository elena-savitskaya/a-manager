"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GradientInput } from "@/components/ui/gradient-input";
import { updateWordAction } from "@/app/actions/words";
import { Plus, Trash2, Save, Pencil, RotateCcw } from "lucide-react";
import { BrandedSpinner } from "@/components/ui/loader";
import { toast } from "sonner";

interface EditWordDialogProps {
  word: {
    id: string;
    word: string;
    translation: string;
    examples: { en: string; ua: string }[];
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditWordDialog({ word, open, onOpenChange }: EditWordDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [translation, setTranslation] = useState(word.translation);
  const [examples, setExamples] = useState<{ en: string; ua: string }[]>(
    Array.isArray(word.examples) ? [...word.examples] : []
  );

  const handleAddExample = () => {
    setExamples([{ en: "", ua: "" }, ...examples]);
  };

  const handleRemoveExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  const handleUpdateExample = (index: number, field: "en" | "ua", value: string) => {
    const newExamples = [...examples];
    newExamples[index][field] = value;
    setExamples(newExamples);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await updateWordAction(word.id, {
        translation,
        examples: examples.filter(ex => ex.en.trim() || ex.ua.trim()), // Filter empty ones
      });

      if (!error) {
        onOpenChange(false);
        toast.success("Слово успішно оновлено");
      } else {
        toast.error("Помилка при збереженні: " + error);
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Невідома помилка при збереженні.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md border-l-0 sm:border-l bg-background/95 backdrop-blur-xl p-0 overflow-hidden">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 pb-4 bg-muted/30 border-b border-foreground/5 shrink-0 text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 shrink-0">
                <Pencil className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col gap-1 min-w-0 flex-1 text-left">
                <p className="text-base font-medium text-primary/70 tracking-tight leading-tight">
                  Редагувати слово
                </p>
                <SheetTitle asChild>
                  <h5 className="text-2xl font-black text-foreground break-words leading-tight">
                    {word.word}
                  </h5>
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Вікно для редагування перекладу та прикладів слова {word.word}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
            <div className="flex flex-col gap-2 shrink-0">
              <Label htmlFor="translation" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
                Переклад (UA)
              </Label>
              <GradientInput
                id="translation"
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                placeholder="Введіть переклад"
                className="h-12"
              />
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between px-1 shrink-0">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                  Приклади використання
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddExample}
                  className="text-primary hover:bg-primary/10 font-bold flex items-center gap-1 text-sm"
                >
                  <Plus className="w-6 h-6" /> Додати приклад
                </Button>
              </div>

              <div className="flex flex-col gap-5">
                {examples.map((ex, index) => (
                  <div key={index} className="bg-muted/30 rounded-2xl p-5 flex flex-col gap-4 relative group hover:bg-muted/50 transition-all border border-foreground/5 shadow-sm">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveExample(index)}
                      className="absolute top-2 right-2 w-12 h-12 rounded-xl text-muted-foreground/20 hover:text-destructive hover:bg-transparent transition-all z-10"
                    >
                      <Trash2 className="h-6 w-6" />
                    </Button>

                    <div className="flex flex-col gap-3 min-w-0 pr-6">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary/50 px-1">Англійська</span>
                        <GradientInput
                          value={ex.en}
                          onChange={(e) => handleUpdateExample(index, "en", e.target.value)}
                          placeholder="Введіть ваш приклад"
                          glowColor="primary"
                          className="h-11"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/50 px-1">Переклад</span>
                        <GradientInput
                          value={ex.ua}
                          onChange={(e) => handleUpdateExample(index, "ua", e.target.value)}
                          placeholder="Український переклад"
                          glowColor="emerald"
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {examples.length === 0 && (
                  <div className="py-12 text-center rounded-2xl border border-dashed border-foreground/10 bg-muted/5">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Немає прикладів</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 bg-muted/10 border-t border-foreground/5 shrink-0 flex sm:flex-row flex-col gap-3 mt-auto">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="flex-1 font-bold text-muted-foreground hover:bg-foreground/5 gap-2"
              disabled={isSaving}
            >
              <RotateCcw className="w-5 h-5" />
              Скасувати
            </Button>
            <Button
              onClick={handleSave}
              className="flex-[2] font-bold shadow-lg shadow-primary/20 h-12"
              disabled={isSaving || !translation.trim()}
            >
              {isSaving ? (
                <BrandedSpinner size={20} />
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-6 h-6" />
                  Зберегти зміни
                </div>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>

  );
}
