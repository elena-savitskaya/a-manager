interface TranslationResult {
  translation: string;
  examples: string[];
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
        <ol className="flex flex-col gap-3">
          {result.examples.map((ex, i) => (
            <li
              key={i}
              className="text-sm text-muted-foreground flex gap-3 italic leading-relaxed"
            >
              <span className="text-primary font-bold">{i + 1}.</span>
              {ex}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
