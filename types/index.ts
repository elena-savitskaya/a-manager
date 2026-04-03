import { Database } from "./database.types";

export type Tables = Database["public"]["Tables"];
export type Word = Tables["words"]["Row"];
export type WordInsert = Tables["words"]["Insert"];
export type WordUpdate = Tables["words"]["Update"];

export interface Example {
  en: string;
  ua: string;
}

export interface TranslationResult {
  translation: string;
  examples: Example[];
}

export interface WordFormValues {
  word: string;
  translation: string;
  examples: Example[];
}

export type WordStatus = "new" | "learning" | "learned";

export type ActionState = {
  error?: string;
  success?: boolean;
  data?: unknown;
};
