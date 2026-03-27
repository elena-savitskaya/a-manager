import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function TrainPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 px-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Режим тренування</h1>
          <p className="text-muted-foreground">Сесія флеш-карток</p>
        </div>
        <Badge variant="outline">3 / 5 слів</Badge>
      </div>

      <div className="mb-6">
        <Progress value={60} className="h-2" />
        <p className="text-xs text-muted-foreground mt-1 text-right">
          60% виконано
        </p>
      </div>

      <Card className="min-h-[260px] flex flex-col justify-between shadow-md">
        <CardHeader className="pb-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Перекладіть слово
          </p>
          <CardTitle className="text-4xl font-bold mt-2">Ephemeral</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground text-sm">
            Натисніть &quot;Показати відповідь&quot;, щоб побачити переклад
          </div>
        </CardContent>

        <CardFooter className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" disabled>
            Показати відповідь
          </Button>
        </CardFooter>
      </Card>

      <div className="flex gap-3 mt-4">
        <Button variant="destructive" className="flex-1" disabled>
          ✗ Не знаю
        </Button>
        <Button variant="default" className="flex-1" disabled>
          ✓ Знаю
        </Button>
      </div>
    </div>
  );
}
