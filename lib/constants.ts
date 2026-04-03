import { WordStatus } from "@/types";

export const WORD_STATUS: Record<string, WordStatus> = {
  NEW: "new",
  LEARNING: "learning",
  LEARNED: "learned",
} as const;

export const WORD_STATUS_LABELS: Record<WordStatus, string> = {
  new: "Нове",
  learning: "В процесі",
  learned: "Вивчено",
} as const;
