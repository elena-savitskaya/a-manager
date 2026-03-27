import { Suspense } from "react";
import WordsList from "./words-list";
import { Loader2 } from "lucide-react";

export default function WordsPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 px-6 flex flex-col gap-6">
      <h1 className="text-3xl font-bold">My Words</h1>

      <Suspense fallback={<Loader />}>
        <WordsList />
      </Suspense>
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
