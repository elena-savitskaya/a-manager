"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
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
import { useRouter } from "next/navigation";
import { GoogleIcon } from "@/components/icons";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Паролі не збігаються");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
      // Supabase returns a fake success for already-registered emails.
      // An empty identities array means the email is already in use.
      if (data.user && data.user.identities?.length === 0) {
        setError("Обліковий запис із цією електронною поштою вже існує. Будь ласка, увійдіть.");
        return;
      }
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Виникла помилка");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Виникла помилка");
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none shadow-xl ring-1 ring-foreground/5 rounded-3xl overflow-hidden bg-muted/30">
        <CardHeader className="text-center pb-8 flex flex-col gap-2 space-y-0">
          <CardTitle asChild className="text-[32px] font-black tracking-tight uppercase">
            <h4>Реєстрація</h4>
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium">Створіть новий акаунт, щоб почати навчання</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
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
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Пароль</Label>
                </div>
                <GradientInput
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">Повторіть пароль</Label>
                </div>
                <GradientInput
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading ? "Створення акаунту..." : "Зареєструватися"}
              </Button>
              <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                <div className="h-px flex-1 bg-border" />
                <span>Або за допомогою</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <GoogleIcon className="mr-2" />
                Зареєструватися через Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Вже маєте акаунт?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Увійти
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
