"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GradientInput } from "@/components/ui/gradient-input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Виникла помилка");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card className="border-none shadow-xl ring-1 ring-foreground/5 rounded-3xl overflow-hidden bg-muted/30">
          <CardHeader className="text-center pb-8 flex flex-col gap-2 space-y-0">
            <CardTitle asChild className="text-[32px] font-black tracking-tight uppercase">
              <h4>Перевірте пошту</h4>
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">Інструкції з відновлення пароля надіслано</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Якщо ви зареєструвалися за допомогою електронної пошти та пароля, ви отримаєте лист для відновлення пароля.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-xl ring-1 ring-foreground/5 rounded-3xl overflow-hidden bg-muted/30">
          <CardHeader className="text-center pb-8 flex flex-col gap-2 space-y-0">
            <CardTitle asChild className="text-[32px] font-black tracking-tight uppercase">
              <h4>Відновити пароль</h4>
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              Введіть свою електронну пошту, і ми надішлемо вам посилання для скидання пароля
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Електронна пошта</Label>
                  <GradientInput
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? "Надсилання..." : "Надіслати посилання"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Вже маєте акаунт?{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  Увійти
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
