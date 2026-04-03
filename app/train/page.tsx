import { getWordsForTraining } from "@/app/actions/words";
import { TrainClient } from "./train-client";
import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";
import { headers } from "next/headers";

// Note: Removing 'export const dynamic' because it conflicts with cacheComponents
// Calling headers() inside the component is the standard way to opt-into dynamic rendering

export default async function TrainPage() {
  // Accessing headers() ensures this page is rendered dynamically on every request
  await headers();
  
  const result = await getWordsForTraining();
  const words = result.success && result.data ? result.data : [];
  
  // Generating a unique key helps force a fresh mount of TrainClient 
  // if the user navigates back and forth, preventing the "completed" screen from sticking.
  const sessionKey = words.length > 0 ? words.map(w => w.id).join("-") : "empty-session";

  return (
    <Suspense fallback={<Loader className="min-h-[60vh]" />}>
      <TrainClient key={sessionKey} initialWords={words} />
    </Suspense>
  );
}
