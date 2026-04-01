"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GradientInput } from "@/components/ui/gradient-input";
import { updateWord } from "./actions";
import { Plus, Trash2, Save } from "lucide-react";
import { BrandedSpinner } from "@/components/ui/loader";

interface EditWordDialogProps {
  word: {
    id: string;
    word: string;
    translation: string;
    examples: any;
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
      const { success, error } = await updateWord(word.id, {
        translation,
        examples: examples.filter(ex => ex.en.trim() || ex.ua.trim()), // Filter empty ones
      });

      if (success) {
        onOpenChange(false);
      } else {
        alert("Помилка при збереженні: " + error);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Невідома помилка при збереженні.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-background/95 backdrop-blur-xl">
        <DialogHeader className="p-6 pb-4 bg-primary/5 border-b border-primary/10">
          <DialogTitle className="text-2xl font-black tracking-tight">Редагувати слово</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Внесіть зміни до перекладу або прикладів вживання для слова <span className="text-foreground font-bold italic">"{word.word}"</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 flex flex-col gap-6 overflow-hidden">
          {/* Translation - Fixed at content top */}
          <div className="flex flex-col gap-2 shrink-0">
            <Label htmlFor="translation" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
              Переклад (UA)
            </Label>
            <GradientInput
              id="translation"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Введіть переклад"
              className="text-lg"
            />
          </div>

          <div className="flex items-center justify-between px-1 shrink-0">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
              Приклади вживання
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddExample}
              className="h-7 text-primary hover:bg-primary/10 rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Додати приклад
            </Button>
          </div>

          {/* Examples - Scrollable area */}
          <div className="flex-1 overflow-y-auto pr-1 -mr-1 custom-scrollbar min-h-[100px] max-h-[40vh]">
            <div className="flex flex-col gap-5 py-2 px-1">
              {examples.map((ex, index) => (
                <div key={index} className="bg-muted/30 rounded-2xl p-5 flex flex-col gap-4 relative group hover:bg-muted/50 transition-all border border-foreground/5 shadow-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveExample(index)}
                    className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/80 border border-foreground/5 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all shadow-sm z-10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>

                  <div className="flex flex-col gap-3 min-w-0 pr-6">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary/50 px-1">Англійська</span>
                      <GradientInput
                        value={ex.en}
                        onChange={(e) => handleUpdateExample(index, "en", e.target.value)}
                        placeholder="Введіть ваш приклад"
                        glowColor="primary"
                        className="h-10 text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/50 px-1">Переклад</span>
                      <GradientInput
                        value={ex.ua}
                        onChange={(e) => handleUpdateExample(index, "ua", e.target.value)}
                        placeholder="Український переклад"
                        glowColor="emerald"
                        className="h-10 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {examples.length === 0 && (
                <div className="py-8 text-center rounded-2xl border border-dashed border-foreground/10 bg-muted/5">
                  <p className="text-xs text-muted-foreground font-medium">Немає прикладів. Натисніть "Додати приклад".</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-muted/30 border-t border-foreground/5 gap-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl font-bold h-12 text-muted-foreground hover:bg-foreground/5"
            disabled={isSaving}
          >
            Відмінити
          </Button>
          <Button
            onClick={handleSave}
            className="flex-[2] rounded-xl font-bold h-12 shadow-lg shadow-primary/20"
            disabled={isSaving || !translation.trim()}
          >
            {isSaving ? (
              <BrandedSpinner size={20} />
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Зберегти зміни
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
