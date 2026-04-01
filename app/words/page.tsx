import { Suspense } from "react";
import WordsList from "./words-list";
import { Loader } from "@/components/ui/loader";

export default function WordsPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-12 py-8 w-full px-4 sm:px-5">
      <div className="flex flex-col gap2 items-center justify-center text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Ваші Слова
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg">
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

