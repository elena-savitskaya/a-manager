import Link from "next/link";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export function AuthButtonsClient() {
  return (
    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
      <Button asChild variant="outline" className="w-full md:w-auto rounded-xl h-12 px-6 shadow-lg shadow-black/5 hover:shadow-black/10 transition-all active:scale-95 group">
        <Link href="/auth/login">
          Увійти
        </Link>
      </Button>
      <Button asChild variant="default" className="w-full md:w-auto rounded-xl h-12 px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 group">
        <Link href="/auth/sign-up">
          Зареєструватися
        </Link>
      </Button>
    </div>
  );
}
