import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="max-w-5xl mx-auto w-full full px-4 sm:px-5 py-8">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex flex-col gap-6">
          <Card className="border-none shadow-xl ring-1 ring-foreground/5 rounded-3xl overflow-hidden bg-muted/30">
            <CardHeader className="text-center pb-8 flex flex-col gap-2 space-y-0">
              <CardTitle asChild className="text-[32px] font-black tracking-tight uppercase">
                <h4>Дякуємо за реєстрацію!</h4>
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">Перевірте пошту для підтвердження</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Ви успішно зареєструвалися. Будь ласка, перевірте свою електронну пошту, 
                щоб підтвердити обліковий запис перед входом.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
