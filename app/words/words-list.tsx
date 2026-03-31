import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function WordsList() {
  const supabase = await createClient();

  const { data: words, error } = await supabase
    .from("words")
    .select("id, word, translation, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="flex items-center justify-between pb-3">
        <p className="text-muted-foreground">
          {words?.length ?? 0} word{words?.length !== 1 ? "s" : ""} in your
          vocabulary
        </p>

        <Button asChild variant="default">
          <Link href="/add-word">+ Add Word</Link>
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          Failed to load words: {error.message}
        </p>
      )}

      {!error && (!words || words.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <p className="text-4xl">📭</p>
          <p className="text-lg font-medium">No words yet</p>
          <p className="text-sm text-muted-foreground">
            Add your first word to start building your vocabulary.
          </p>
          <Button asChild>
            <Link href="/add-word">Add your first word</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {words?.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 pt-4 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{item.word}</CardTitle>
                  <Badge
                    variant={
                      item.status === "learned" ? "default" : "secondary"
                    }
                  >
                    {item.status === "learned" ? "Learned" : "In progress"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-4 px-5">
                <p className="text-muted-foreground text-sm">
                  {item.translation}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
