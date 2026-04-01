interface TranslationResult {
  translation: string;
  examples: { en: string; ua: string }[];
}

interface TranslationPreviewProps {
  result: TranslationResult;
}

export function TranslationPreview({ result }: TranslationPreviewProps) {
  return (
    <div className="rounded-2xl border-none bg-background/50 p-6 flex flex-col gap-5 shadow-sm ring-1 ring-foreground/5 transition-all animate-in fade-in slide-in-from-bottom-2">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">
          Переклад
        </p>
        <p className="text-2xl font-bold text-foreground">
          {result.translation}
        </p>
      </div>
      <div className="w-full h-px bg-muted" />
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">
          Приклади використання
        </p>
        <ol className="flex flex-col gap-4">
          {result.examples.map((ex, i) => (
            <li
              key={i}
              className="text-sm flex flex-col gap-1 leading-relaxed group"
            >
              <div className="flex gap-3 text-foreground/80 font-medium italic">
                <span className="text-primary font-bold not-italic">{i + 1}.</span>
                {ex.en}
              </div>
              <div className="pl-7 text-xs text-muted-foreground/70 font-normal">
                {ex.ua}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
