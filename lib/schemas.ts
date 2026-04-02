import { z } from "zod";

export const ExampleSchema = z.object({
  en: z.string().min(1, "English sentence is required"),
  ua: z.string().min(1, "Ukrainian translation is required"),
});

export const TranslationResultSchema = z.object({
  translation: z.string().min(1, "Translation is required"),
  examples: z.array(ExampleSchema).length(3, "Exactly 3 examples are required"),
  correctedWord: z.string().optional(),
});

export const WordFormSchema = z.object({
  word: z.string().min(1, "Word is required").max(100),
});

export type TranslationResult = z.infer<typeof TranslationResultSchema>;
export type WordFormValues = z.infer<typeof WordFormSchema>;
