import { Suspense } from "react";
import WordsList from "./words-list";
import { Loader } from "@/components/ui/loader";

export default function WordsPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 py-8 w-full px-4 sm:px-5">
      <div className="flex flex-col gap-2 items-center justify-center text-center">
        <h3 className="text-4xl font-extrabold tracking-tight">
          Ваші Слова
        </h3>
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
