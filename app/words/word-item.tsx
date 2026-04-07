"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, BookOpen, Quote, Trash2, Pencil, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { deleteWordAction, repeatWordAction } from "@/app/actions/words";
import { EditWordDialog } from "./edit-word-dialog";
import { BrandedSpinner } from "@/components/ui/loader";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
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
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WordItemProps {
  word: {
    id: string;
    word: string;
    translation: string;
    status: string;
    progress: number | null;
    examples: { en: string; ua: string }[];
  };
}

export function WordItem({ word }: WordItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const examples = Array.isArray(word.examples) ? word.examples : [];

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteWordAction(word.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete:", error);
      setIsDeleting(false);
    }
  }

  async function handleRepeat() {
    setIsRepeating(true);
    try {
      const { success, error } = await repeatWordAction(word.id);
      if (success) {
        toast.success("Слово відправлено на повторення");
        setIsSheetOpen(false);
      } else {
        toast.error("Помилка: " + error);
      }
    } catch (error) {
      console.error("Failed to repeat:", error);
      toast.error("Невідома помилка");
    } finally {
      setIsRepeating(false);
    }
  }

  return (
    <>
      <Card
        className="relative overflow-hidden group border border-foreground/10 dark:border-none bg-background/50 backdrop-blur-sm shadow-sm rounded-2xl transition-all duration-200 hover:bg-background/80"
      >
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <h3 className="text-base font-bold text-foreground tracking-tight break-words">
              {word.word}
            </h3>
            <p className="text-sm font-medium text-muted-foreground/90 italic break-words">
              {word.translation}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {word.status === "learned" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRepeat}
                disabled={isRepeating}
                className="w-12 h-12 rounded-full hover:bg-primary/10 text-muted-foreground/90 hover:text-primary transition-all active:scale-95"
                title="Повторити"
              >
                {isRepeating ? (
                  <BrandedSpinner size={20} />
                ) : (
                  <RefreshCw className="h-6 w-6" />
                )}
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-full hover:bg-primary/10 text-muted-foreground/90 hover:text-primary transition-all active:scale-95"
                >
                  <MoreVertical className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={-6} alignOffset={8} className="w-48 rounded-2xl border border-foreground/10 dark:border-none shadow-xl bg-background/95 backdrop-blur-xl p-1.5 ring-1 ring-foreground/10 dark:ring-foreground/5">
                <DropdownMenuItem
                  onClick={() => setIsSheetOpen(true)}
                  className="gap-3 py-3 px-4 focus:bg-primary/5 focus:text-primary rounded-xl cursor-pointer transition-all duration-200 font-medium"
                >
                  <Eye className="w-6 h-6 opacity-60" />
                  <span className="text-base">Деталі</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsEditDialogOpen(true)}
                  className="gap-3 py-3 px-4 focus:bg-primary/5 focus:text-primary rounded-xl cursor-pointer transition-all duration-200 font-medium"
                >
                  <Pencil className="w-6 h-6 opacity-60" />
                  <span className="text-base">Редагувати</span>
                </DropdownMenuItem>
                <div className="h-px bg-foreground/5 my-1" />
                <DropdownMenuItem
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="gap-3 py-3 px-4 focus:bg-destructive/5 focus:text-destructive rounded-xl cursor-pointer transition-all duration-200 font-medium"
                >
                  <Trash2 className="w-6 h-6 opacity-60" />
                  <span className="text-base">Видалити</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </div>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md border-l-0 sm:border-l bg-background/95 backdrop-blur-xl p-0 overflow-hidden">
          <div className="h-full flex flex-col">
            <SheetHeader className="p-6 pb-4 bg-muted/50 dark:bg-muted/30 border-b border-foreground/10 dark:border-foreground/5 shrink-0">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex flex-col gap-2 min-w-0 flex-1">
                    <SheetTitle asChild>
                      <h5 className="text-2xl font-black tracking-tight break-words">{word.word}</h5>
                    </SheetTitle>
                    <SheetDescription className="text-base font-medium text-primary/70 break-words">{word.translation}</SheetDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={word.status === "learned" ? "secondary" : "success"}
                    className={cn(
                      "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-none shadow-sm",
                      word.status === "learned" ? "bg-primary/10 text-primary" : "bg-emerald-500/10 text-emerald-500"
                    )}
                  >
                    {word.status === "learned" ? "Вивчено" : "В процесі"}
                  </Badge>

                  {word.status === "learned" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRepeat}
                      disabled={isRepeating}
                      className="h-7 rounded-full px-3 text-[10px] font-bold uppercase tracking-widest border-primary/20 hover:bg-primary/5 text-primary gap-1.5"
                    >
                      {isRepeating ? (
                        <BrandedSpinner size={12} />
                      ) : (
                        <RefreshCw className="w-3 h-3" />
                      )}
                      Повторити
                    </Button>
                  )}
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              {examples.length > 0 ? (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2 text-muted-foreground/40 uppercase tracking-[0.2em] text-xs font-bold">
                    <Quote className="w-6 h-6 opacity-40 shrink-0" />
                    <span>Приклади використання</span>
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
                <div className="h-full flex flex-col items-center justify-center opacity-30 gap-6 py-20 px-10 text-center">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-muted shadow-inner ring-1 ring-foreground/5">
                    <Quote className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium">Приклади відсутні</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-muted/10 border-t border-foreground/5 shrink-0 flex sm:flex-row flex-col gap-3 mt-auto">
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="flex-1 h-12 font-semibold shadow-sm hover:shadow-destructive/20 transition-all active:scale-95 px-6"
                disabled={isDeleting}
              >
                {isDeleting ? <BrandedSpinner className="w-6 h-6" size={24} /> : <Trash2 className="w-6 h-6 mr-2" />}
                {isDeleting ? "Видалення..." : "Видалити слово"}
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  setIsSheetOpen(false);
                  setIsEditDialogOpen(true);
                }}
                className="flex-1 h-12 font-semibold bg-primary/10 hover:bg-primary/20 text-primary border-none transition-all active:scale-95 px-6"
              >
                <Pencil className="w-6 h-6 mr-2" />
                Редагувати
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <EditWordDialog
        word={word}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Ви впевнені?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Це дію неможливо скасувати. Слово <span className="font-bold text-foreground">&quot;{word.word}&quot;</span> буде назавжди видалено з вашого словника.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="border-foreground/10 hover:bg-foreground/5 flex-1 rounded-xl">Скасувати</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg shadow-destructive/20 flex-1 font-bold rounded-xl"
            >
              Так, видалити
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
