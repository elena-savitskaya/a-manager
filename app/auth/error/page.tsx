import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      {params?.error ? (
        <p className="text-sm text-muted-foreground">
          Код помилки: {params.error}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Сталася невідома помилка.
        </p>
      )}
    </>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <div className="max-w-5xl mx-auto w-full full px-4 sm:px-5 py-8">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex flex-col gap-6">
          <Card className="border-none shadow-xl ring-1 ring-foreground/5 rounded-3xl overflow-hidden bg-muted/30">
            <CardHeader className="text-center pb-8 flex flex-col gap-2 space-y-0">
              <CardTitle asChild className="text-[32px] font-black tracking-tight uppercase text-destructive">
                <h4>Помилка</h4>
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                На жаль, виникла проблема під час авторизації
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Suspense>
                <ErrorContent searchParams={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
