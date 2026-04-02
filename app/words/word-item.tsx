"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, BookOpen, Quote, Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import { deleteWordAction } from "@/app/actions/words";
import { EditWordDialog } from "./edit-word-dialog";
import { BrandedSpinner } from "@/components/ui/loader";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WordItemProps {
  word: {
    id: string;
    word: string;
    translation: string;
    status: string;
    examples: { en: string; ua: string }[];
  };
}

export function WordItem({ word }: WordItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const examples = Array.isArray(word.examples) ? word.examples : [];

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteWordAction(word.id);
      // Sheet will close automatically because WordItem will unmount
    } catch (error) {
      console.error("Failed to delete:", error);
      setIsDeleting(false);
    }
  }

  return (
    <Sheet>
      <Card
        className="relative overflow-hidden group border-none bg-background/50 backdrop-blur-sm shadow-sm rounded-2xl transition-all duration-200 hover:bg-background/80"
      >
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 min-w-0">
            <h3 className="text-base font-bold text-foreground tracking-tight truncate">
              {word.word}
            </h3>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <p className="text-sm font-medium text-muted-foreground/90 italic truncate max-w-[150px]">
              {word.translation}
            </p>

            <div className="flex items-center gap-1">
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-primary/10 text-muted-foreground/30 hover:text-primary transition-all active:scale-95"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
            </div>
          </div>

        </div>
      </Card>

      <SheetContent side="right" className="w-full sm:max-w-md border-l-0 sm:border-l bg-background/95 backdrop-blur-xl p-0 overflow-hidden">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 pb-4 bg-muted/30 border-b border-foreground/5 shrink-0">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <SheetTitle className="text-2xl font-black tracking-tight break-words">{word.word}</SheetTitle>
                  <SheetDescription className="text-base font-medium text-primary/70 break-words">{word.translation}</SheetDescription>
                </div>
              </div>

              <Badge
                variant={word.status === "learned" ? "info" : "success"}
                className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest shadow-sm"
              >
                {word.status === "learned" ? "Мною вивчено" : "У процесі вивчення"}
              </Badge>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
            {examples.length > 0 ? (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 text-muted-foreground/40 uppercase tracking-[0.2em] text-[10px] font-bold">
                  <Quote className="w-3 h-3" />
                  <span>Приклади вживання</span>
                </div>

                <div className="flex flex-col gap-6">
                  {examples.map((ex: { en: string; ua: string }, idx: number) => (
                    <div key={idx} className="relative pl-6 group/item transition-all">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-primary to-emerald-500 rounded-full opacity-20 group-hover/item:opacity-100 transition-opacity" />
                      <div className="flex flex-col gap-2">
                        <p className="text-lg font-medium text-foreground leading-snug">
                          {ex.en}
                        </p>
                        <p className="text-base text-muted-foreground/80 leading-relaxed font-light">
                          {ex.ua}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4 py-20">
                <Quote className="w-12 h-12" />
                <p className="text-sm font-medium">Приклади відсутні</p>
              </div>
            )}
          </div>

          <div className="p-6 bg-muted/10 border-t border-foreground/5 shrink-0 flex sm:flex-row flex-col gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex-1 font-semibold shadow-sm hover:shadow-destructive/20 transition-all active:scale-95"
                  disabled={isDeleting}
                >
                  {isDeleting ? <BrandedSpinner className="w-4 h-4" size={16} /> : <Trash2 className="w-4 h-4 mr-2" />}
                  {isDeleting ? "Видалення..." : "Видалити слово"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold">Ви впевнені?</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    Це дію неможливо скасувати. Слово <span className="font-bold text-foreground">&quot;{word.word}&quot;</span> буде назавжди видалено з вашого словника.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3">
                  <AlertDialogCancel className="border-foreground/10 hover:bg-foreground/5 flex-1">Скасувати</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg shadow-destructive/20 flex-1 font-bold"
                  >
                    Так, видалити
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              variant="secondary"
              onClick={() => setIsEditDialogOpen(true)}
              className="flex-1 font-semibold bg-primary/10 hover:bg-primary/20 text-primary border-none transition-all active:scale-95"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Редагувати
            </Button>
          </div>
        </div>
      </SheetContent>

      <EditWordDialog
        word={word}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </Sheet>
  );
}
