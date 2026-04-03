import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("font-bold tracking-tighter select-none ml-1", size === "lg" ? "text-2xl" : "text-lg")}>
        <span className="text-blue-500">Word</span>
        <span className="text-emerald-500">Trainer</span>
      </span>
    </div>
  );
}
