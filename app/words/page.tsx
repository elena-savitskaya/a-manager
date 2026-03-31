import { Suspense } from "react";
import WordsList from "./words-list";
import { Loader2 } from "lucide-react";

export default function WordsPage() {
  return (
    <div className="flex flex-col gap-12 py-10 w-full max-w-4xl mx-auto px-4">
      {/* Premium Header */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Ваші Слова
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          Тут зібрані всі слова, які ви додали для вивчення. Відстежуйте свій прогрес та повторюйте старі слова.
        </p>
      </div>

      <div className="w-full">
        <Suspense fallback={<Loader />}>
          <WordsList />
        </Suspense>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}
